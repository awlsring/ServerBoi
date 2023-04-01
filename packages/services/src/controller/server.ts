import { PrismaRepoOptions, ServerDao } from "../dao/server-dao";
import { SteamQuerent } from "../query/steam-query";
import { HttpQuerent } from "../query/http-query";
import { Querent, Status } from "../query/common";
import { ServerDto } from "../dto/server-dto";
import { IPAPIClient, ServerLocation } from "../ip-lookup/ip-api";

export class ServerController {
  private static instance: ServerController;
  private serverDao: ServerDao;
  private ipLookup = new IPAPIClient();

  public static getInstance(cfg?: PrismaRepoOptions): ServerController {
    if (!ServerController.instance) {
      if (!cfg) {
        throw new Error("ServerController not initialized, config needed");
      }
      ServerController.instance = new ServerController(cfg);
    }
    return ServerController.instance;
  }

  private constructor(cfg: PrismaRepoOptions) {
    this.serverDao = new ServerDao(cfg);
  }

  private async queryServer(type: string, address: string, port?: number): Promise<Status> {
    let querent: Querent;
    switch (type) {
      case "STEAM":
        if (!port) {
          throw new Error("Steam query requires port");
        }
        querent = new SteamQuerent(address, port);
        break;
      case "HTTP":
        querent = new HttpQuerent(address);
        break;
      default:
        throw new Error("Unsupported query type");
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

  async trackServer(input: TrackServerInput): Promise<Server> {
    const location = await this.determineLocation(input.address);

    const serverDto = await this.serverDao.create({
      scopeId: input.scopeId,
      serverId: this.generateServerId(),
      name: input.name,
      application: input.application,
      address: input.address,
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
      platform: input.platform ? {
        type: input.platform.type,
        data: input.platform.data,
      } : undefined,
    });
    return this.enhanceServer(serverDto);
  }

  async untrackServer(id: string): Promise<void> {
    const { scopeId, serverId } = this.unpackId(id);
    await this.serverDao.delete(scopeId, serverId);
  }

  private async enhanceServer(server: ServerDto): Promise<Server> {
    const queryAddress = server.query.address ?? server.address;
    const status = await this.queryServer(server.query.type, queryAddress, server.query.port);
    return {
      ...server,
      id: `${server.scopeId}-${server.serverId}`,
      status,
      query: {
        type: server.query.type,
        address: server.query.address,
        port: server.query.port,
      },
    };
  }

  async getServer(id: string): Promise<Server> {
    const { scopeId, serverId } = this.unpackId(id);
    const serverDto = await this.serverDao.findById(scopeId, serverId);
    if (!serverDto) {
      throw new Error("Server not found");
    }
    return this.enhanceServer(serverDto);
  }

  async listServers(amount?: number, skip?: number): Promise<Server[]> {
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
  readonly capabilities: string[];
  readonly platform?: Platform;
  readonly query: Query;
  readonly owner: string;
  readonly location?: string;
}

export interface Server {
  readonly id: string;
  readonly scopeId: string;
  readonly serverId: string;
  readonly name: string;
  readonly application: string;
  readonly address: string;
  readonly capabilities: string[];
  readonly platform: Platform;
  readonly location: ServerLocation;
  readonly query: Query;
  readonly owner: string;
  readonly status: Status;
  readonly added: Date;
  readonly lastUpdated?: Date;
}

export interface Platform {
  readonly type: string;
  readonly data?: string;
}

export interface Query {
  readonly type: string;
  readonly address?: string;
  readonly port?: number;
}