import { ServerRepo } from "../persistence/server-repo";
import { SteamQuerent } from "../query/steam-query";
import { HttpQuerent } from "../query/http-query";
import { Connectivity, Querent } from "../query/common";
import { ProviderServerDataDto, ServerDto, ServerQueryDto, ServerStatusDto } from "../dto/server-dto";
import { IPAPIClient, ServerLocation } from "../ip-lookup/ip-api";
import { PrismaRepoOptions } from "../persistence/prisma-repo-options";
import { ProviderDto } from "../dto/provider-dto";
import { ProviderRepo } from "../persistence/provider-repo";
import { ServerQueryType, ServerStatus } from '@serverboi/ssdk';
import { LRUCache } from "../cache/lru-cache";
import { Provider } from "../provider/provider";
import { AwsEc2Provider } from "../provider/aws-ec2";
import { ProviderAuthRepo } from "../persistence/provider-auth-repo";
import { KubernetesProvider, KubernetesProviderOptions, KubernetesProviderServerData } from "../provider/kubernetes";

export class ServerController {
  private readonly serverDao: ServerRepo;
  private readonly providerDao: ProviderRepo;
  private readonly providerAuthDao: ProviderAuthRepo;

  private readonly providerCache: LRUCache<Provider>;

  private ipLookup = new IPAPIClient();

  constructor(cfg: PrismaRepoOptions) {
    this.serverDao = new ServerRepo(cfg);
    this.providerDao = new ProviderRepo(cfg);
    this.providerAuthDao = new ProviderAuthRepo(cfg);
    this.providerCache = new LRUCache<Provider>(100);
    setInterval(() => {
      for (const node of this.providerCache.getCache().values()) {
        if (Date.now() - node.created > this.providerCache.maxAge) {
          console.log("ServerBoiService: clearing expired client from cache", node.key)
          this.providerCache.getCache().delete(node.key);
          this.providerCache.clear(node.key);
        }
      }
    }, 60 * 1000 /* 1 minute */);
  }

  private async queryServer(type: string, connectivity: Connectivity): Promise<ServerStatusDto> {
    let querent: Querent;
    switch (type) {
      case ServerQueryType.STEAM:
        querent = new SteamQuerent(connectivity);
        break;
      case ServerQueryType.HTTP:
        querent = new HttpQuerent(connectivity);
        break;
      default:
        return {
          type: ServerQueryType.NONE,
          status: ServerStatus.UNREACHABLE,
        }
    }
    return querent.Query();
  }

  private determineConnectivity(address: string, port: number, queryAddress?: string, queryPort?: number): Connectivity {
    let a = address;
    if (queryAddress) {
      if (queryAddress != "") {
        a = queryAddress;
      }
    }

    let p = port;
    if (queryPort) {
      if (queryPort != 0) {
        p = queryPort;
      }
    }
    return {
      address: a,
      port: p,
    }
  }

  private async determineLocation(address: string): Promise<ServerLocation> {
    return await this.ipLookup.getIPInfo(address);
  }

  private generateServerId(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  private unpackId(id: string): { scopeId: string, serverId: string } {
    const [scopeId, serverId] = id.split("-");
    return { scopeId, serverId };
  }

  async trackServer(input: TrackServerInput): Promise<ServerDto> {
    const location = await this.determineLocation(input.address);

    let provider: ProviderDto | undefined = undefined;
    if (input.providerName) {
      provider = await this.providerDao.find(input.providerName, input.owner);
    }

    const status = await this.queryServer(input.query.type, this.determineConnectivity(input.address, input.port, input.query.address, input.query.port));

    const serverDto = await this.serverDao.create({
      scopeId: input.scopeId,
      serverId: this.generateServerId(),
      name: input.name,
      application: input.application,
      address: input.address,
      port: input.port,
      capabilities: input.capabilities,
      owner: input.owner,
      location: {
        city: location.city,
        country: location.country,
        region: location.region,
        emoji: location.emoji,
      },
      status: status,
      query: {
        type: input.query.type,
        address: input.query.address,
        port: input.query.port,
      },
      provider: provider,
      providerServerData: input.providerServerData,
    });
    return serverDto;
  }

  async untrackServer(id: string): Promise<void> {
    const { scopeId, serverId } = this.unpackId(id);
    await this.serverDao.delete(scopeId, serverId);
  }

  async getServer(id: string): Promise<ServerDto> {
    const { scopeId, serverId } = this.unpackId(id);
    const serverDto = await this.serverDao.findById(scopeId, serverId);
    if (!serverDto) {
      throw new Error("Server not found");
    }
    return serverDto;
  }

  async listServers(amount?: number, skip?: number): Promise<ServerDto[]> {
    const servers = await this.serverDao.findAll(amount, skip);
    return Promise.all(servers.map(async (server) => { return server; }));
  }

  async startServer(id: string): Promise<void> {
    const server = await this.getServer(id);
    if (!server.providerServerData) {
      throw new Error("Server has no provider data");
    }
    const provider = await this.getProvider(server);

    await provider.startServer(server.providerServerData);
  }

  async stopServer(id: string): Promise<void> {
    const server = await this.getServer(id);
    if (!server.providerServerData) {
      throw new Error("Server has no provider data");
    }
    const provider = await this.getProvider(server);

    await provider.stopServer(server.providerServerData);
  }

  async rebootServer(id: string): Promise<void> {
    const server = await this.getServer(id);
    if (!server.providerServerData) {
      throw new Error("Server has no provider data");
    }
    const provider = await this.getProvider(server);

    await provider.rebootServer(server.providerServerData);
  }

  private async loadProvider(server: ServerDto): Promise<Provider> {
    if (!server.provider || !server.providerServerData) {
      throw new Error("Server has no provider or provider data");
    }

    const provider = await this.providerDao.find(server.provider.name, server.owner);

    const auth = await this.providerAuthDao.findById(server.provider.id);
    if (!auth) {
      throw new Error("Missing provider auth");
    }
    
    switch (provider.type) {
      case "AWS":
        if (!server.providerServerData.subType) {
          throw new Error("Missing AWS subtype");
        }
        if (!server.providerServerData.location) {
          throw new Error("Missing location data");
        }
        switch (server.providerServerData.subType) {
          case "EC2":
            return new AwsEc2Provider({region: server.providerServerData.location}, auth);
          default:
            throw new Error(`Unknown AWS subtype ${server.providerServerData.subType}`);
        }
      case "KUBERNETES":
        if (!provider.data) {
          throw new Error("Provider has no needed kubernetes data");
        }
        provider.data as KubernetesProviderServerData
        const k8sCfg: KubernetesProviderOptions = {
          endpoint: server.providerServerData.data.endpoint,
          allowUnsecure: server.providerServerData.data.allowUnsecure,
        }
        return new KubernetesProvider(k8sCfg, auth);
      default:
        throw new Error(`Unknown provider type ${provider.type}`);
    }
  }

  private async getProvider(server: ServerDto): Promise<Provider> {
    const serverIdentifier = `${server.scopeId}-${server.serverId}`;
    let provider = this.providerCache.get(serverIdentifier);
    if (!provider) {
      provider = await this.loadProvider(server);
      this.providerCache.set(serverIdentifier, provider);
    }
    return provider;
  }
}


export interface TrackServerInput {
  readonly scopeId: string;
  readonly name: string;
  readonly application: string;
  readonly address: string;
  readonly port: number;
  readonly capabilities: string[];
  readonly providerName?: string;
  readonly providerServerData?: ProviderServerDataDto;
  readonly query: ServerQueryDto;
  readonly owner: string;
  readonly location?: string;
}