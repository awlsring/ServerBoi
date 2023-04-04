import { ServerRepo } from "../persistence/server-repo";
import { SteamQuerent } from "../query/steam-query";
import { HttpQuerent } from "../query/http-query";
import { Querent } from "../query/common";
import { ProviderServerDataDto, ServerDto, ServerQueryDto, ServerStatusDto } from "../dto/server-dto";
import { IPAPIClient, ServerLocation } from "../ip-lookup/ip-api";
import { PrismaRepoOptions } from "../persistence/prisma-repo-options";
import { ProviderDto } from "../dto/provider-dto";
import { ProviderRepo } from "../persistence/provider-repo";

export class ServerController {
  private serverDao: ServerRepo;
  private providerDao: ProviderRepo;
  private ipLookup = new IPAPIClient();

  constructor(cfg: PrismaRepoOptions) {
    this.serverDao = new ServerRepo(cfg);
    this.providerDao = new ProviderRepo(cfg);
  }

  private async queryServer(type: string, address: string, port: number): Promise<ServerStatusDto> {
    let querent: Querent;
    switch (type) {
      case "STEAM":
        querent = new SteamQuerent(address, port);
        break;
      case "HTTP":
        querent = new HttpQuerent(address, port);
        break;
      default:
        return {
          type: "NONE",
          status: "UNREACHABLE",
        }
    }
    return querent.Query();
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
      query: {
        type: input.query.type,
        address: input.query.address,
        port: input.query.port,
      },
      provider: provider,
      providerServerData: input.providerServerData,
    });
    return this.enhanceServer(serverDto);
  }

  async untrackServer(id: string): Promise<void> {
    const { scopeId, serverId } = this.unpackId(id);
    await this.serverDao.delete(scopeId, serverId);
  }

  private async enhanceServer(server: ServerDto): Promise<ServerDto> {
    let queryAddress = server.address;
    if (server.query.address) {
      if (server.query.address != "") {
        queryAddress = server.query.address;
      }
    }

    let queryPort = server.port;
    if (server.query.port) {
      if (server.query.port != 0) {
        queryPort = server.query.port;
      }
    }
    
    const status = await this.queryServer(server.query.type, queryAddress, queryPort);
    return {
      ...server,
      status,
      query: {
        type: server.query.type,
        address: server.query.address,
        port: server.query.port,
      },
    };
  }

  async getServer(id: string): Promise<ServerDto> {
    const { scopeId, serverId } = this.unpackId(id);
    const serverDto = await this.serverDao.findById(scopeId, serverId);
    if (!serverDto) {
      throw new Error("Server not found");
    }
    return this.enhanceServer(serverDto);
  }

  async listServers(amount?: number, skip?: number): Promise<ServerDto[]> {
    const servers = await this.serverDao.findAll(amount, skip);
    return Promise.all(servers.map(async (server) => {
      return this.enhanceServer(server);
    }
    ));
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