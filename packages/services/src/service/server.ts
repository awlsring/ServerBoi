import { ServerDao } from "../dao/server-dao";
// import { UserDao } from "../dao/user-dao";
import { SteamQuerent } from "../query/steam-query";
import { HttpQuerent } from "../query/http-query";
import { Querent, Status } from "../query/common";
import { ServerDto } from "../dto/server-dto";

export class ServerService {
  private static instance: ServerService;
  private serverDao: ServerDao = new ServerDao();

  public static getInstance(): ServerService {
    if (!ServerService.instance) {
      ServerService.instance = new ServerService();
    }
    return ServerService.instance;
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

  async trackServer(input: TrackServerInput): Promise<Server> {
    const serverDto = await this.serverDao.create({
      name: input.name,
      application: input.application,
      address: input.address,
      capabilities: input.capabilities,
      owner: input.owner,
      location: input.location,
      query: {
        type: input.query.type,
        address: input.query.address,
        port: input.query.port,
      },
      platform: {
        type: input.platform.type,
        data: input.platform.data,
      }
    });
    return this.enhanceServer(serverDto);
  }

  async untrackServer(id: string): Promise<void> {
    await this.serverDao.delete(id);
  }

  private async enhanceServer(server: ServerDto): Promise<Server> {
    const queryAddress = server.query.address ?? server.address;
    const status = await this.queryServer(server.query.type, queryAddress, server.query.port);
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

  async getServer(id: string): Promise<Server> {
    const serverDto = await this.serverDao.findById(id);
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
  readonly name: string;
  readonly application: string;
  readonly address: string;
  readonly capabilities: string[];
  readonly platform: Platform;
  readonly query: Query;
  readonly owner: string;
  readonly location?: string;
}

export interface Server {
  readonly id: string;
  readonly name: string;
  readonly application: string;
  readonly address: string;
  readonly capabilities: string[];
  readonly platform: Platform;
  readonly query: Query;
  readonly owner: string;
  readonly status: Status;
  readonly added: Date;
  readonly lastUpdated?: Date;
  readonly location?: string;
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
