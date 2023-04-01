import { PrismaClient, Server } from '@prisma/client';
import { NewServerDto, ServerDto } from '../dto/server-dto';

export interface PrismaRepoOptions {
  readonly user: string;
  readonly password: string;
  readonly host: string;
  readonly port: number;
  readonly database: string;
}

export class ServerDao {
  readonly prisma: PrismaClient;
  constructor(options: PrismaRepoOptions) {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`
        }
      }
    });
  }

  async create(server: NewServerDto): Promise<ServerDto> {
    const createdServer = await this.prisma.server.create({
      data: {
        scopeId: server.scopeId,
        serverId: server.serverId,
        name: server.name,
        application: server.application,
        address: server.address,
        capabilities: server.capabilities,
        ownerId: server.owner,
        city: server.location.city,
        country: server.location.country,
        region: server.location.region,
        countryEmoji: server.location.emoji,
        queryType: server.query.type,
        queryAddress: server.query.address,
        queryPort: server.query.port,
        platformData: server.platform?.data,
        platform: server.platform?.type ? server.platform.type : "UNKNOWN",
      }
    });
    return this.toDto(createdServer);
  }

  async findById(scopeId: string, serverId: string): Promise<ServerDto | null> {
    const server = await this.prisma.server.findUnique({
      where: { scopeId_serverId: { scopeId, serverId } },
    });
    if (!server) {
      return null;
    }
    console.log(JSON.stringify(server, null, 2));
    return this.toDto(server);
  }

  async findAll(amount?: number, skip?: number): Promise<ServerDto[]> {
    const users = await this.prisma.server.findMany({
      skip,
      take: amount,
    });
    return users.map((server) => this.toDto(server));
  }

  async update(scopeId: string, serverId: string, server: Server): Promise<ServerDto | null> {
    const updatedServer = await this.prisma.server.update({
      where: { scopeId_serverId: { scopeId, serverId } },
      data: server,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(scopeId: string, serverId: string): Promise<ServerDto | null> {
    const deletedServer = await this.prisma.server.delete({
      where: { scopeId_serverId: { scopeId, serverId } },
    });
    if (!deletedServer) {
      return null;
    }
    return this.toDto(deletedServer);
  }

  private toDto(server: Server): ServerDto {
    return {
      scopeId: server.scopeId,
      serverId: server.serverId,
      name: server.name,
      application: server.application,
      address: server.address,
      capabilities: server.capabilities,
      owner: server.ownerId,
      added: new Date(server.addedAt),
      platform: {
        type: server.platform,
        data: server.platformData ?? undefined,
      },
      query: {
        type: server.queryType,
        address: server.queryAddress ?? undefined,
        port: server.queryPort ?? undefined,
      },
      location: {
        city: server.city,
        country: server.country,
        region: server.region,
        emoji: server.countryEmoji,
      },
      lastUpdated: server.updatedAt ? new Date(server.updatedAt) : undefined,
    };
  }
}