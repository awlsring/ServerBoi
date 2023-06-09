import { PrismaClient, Provider, ProviderServerData, Server, Status } from '@prisma/client';
import { NewServerDto, ServerDto, ServerStatusDto } from '../dto/server-dto';
import { PrismaRepoOptions } from './prisma-repo-options';

type ServerFull = Server & {
  provider: Provider | null;
  providerData: ProviderServerData | null;
  status: Status | null;
}

export class ServerRepo {
  readonly defaultInclude = {
    provider: true,
    providerData: true,
    status: true,
  }
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
      include: this.defaultInclude,
      data: {
        scopeId: server.scopeId,
        serverId: server.serverId,
        name: server.name,
        application: server.application,
        address: server.address,
        port: server.port,
        capabilities: server.capabilities,
        ownerId: server.owner,
        city: server.location.city,
        country: server.location.country,
        region: server.location.region,
        countryEmoji: server.location.emoji,
        queryType: server.query.type,
        queryAddress: server.query.address,
        queryPort: server.query.port,
        providerId: server.provider?.id,
        providerData: server.provider ? {
          create: {
            providerId: server.provider?.id,
            identifier: server.providerServerData!.identifier,
            location: server.providerServerData!.location,
            data: server.providerServerData!.data ? JSON.stringify(server.providerServerData!.data) : undefined,
          }
        } : undefined,
        status: {
          create: {
            status: server.status.status,
            provider: server.status.provider,
            query: server.status.query,
            data: server.status.data ? JSON.stringify(server.status.data) : undefined,
          }
        }
      }
    });
    return this.toDto(createdServer);
  }

  async findById(scopeId: string, serverId: string): Promise<ServerDto | null> {
    const server = await this.prisma.server.findUnique({
      where: { scopeId_serverId: { scopeId, serverId } },
      include: this.defaultInclude,
    });
    if (!server) {
      return null;
    }
    return this.toDto(server);
  }

  async findAll(amount?: number, skip?: number): Promise<ServerDto[]> {
    const users = await this.prisma.server.findMany({
      include: this.defaultInclude,
      skip,
      take: amount,
    });
    return users.map((server) => this.toDto(server));
  }

  async findAllInScope(scope: string, amount?: number, skip?: number): Promise<ServerDto[]> {
    const users = await this.prisma.server.findMany({
      include: this.defaultInclude,
      where: { scopeId: scope },
      skip,
      take: amount,
    });
    return users.map((server) => this.toDto(server));
  }

  async findAllInForUser(user: string, amount?: number, skip?: number): Promise<ServerDto[]> {
    const users = await this.prisma.server.findMany({
      include: this.defaultInclude,
      where: { ownerId: user },
      skip,
      take: amount,
    });
    return users.map((server) => this.toDto(server));
  }

  async update(scopeId: string, serverId: string, server: Server): Promise<ServerDto | null> {
    const updatedServer = await this.prisma.server.update({
      include: this.defaultInclude,
      where: { scopeId_serverId: { scopeId, serverId } },
      data: server,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async updateStatus(scopeId: string, serverId: string, status: ServerStatusDto): Promise<ServerDto | null> {
    const updatedServer = await this.prisma.server.update({
      include: this.defaultInclude,
      where: { scopeId_serverId: { scopeId, serverId } },
      data: {
        status: {
          upsert: {
            create: {
              status: status.status,
              provider: status.provider,
              query: status.query,
              data: status.data ? JSON.stringify(status.data) : undefined,
            },
            update: {
              status: status.status,
              provider: status.provider,
              query: status.query,
              data: status.data ? JSON.stringify(status.data) : undefined,
            },
          }
        }
      },
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(scopeId: string, serverId: string): Promise<ServerDto | null> {
    await this.prisma.providerServerData.deleteMany({
      where: {
        server: {
          scopeId,
          serverId,
        },
      }
    });

    await this.prisma.status.deleteMany({
      where: {
        server: {
          scopeId,
          serverId,
        },
      }
    });

    const deletedServer = await this.prisma.server.delete({
      include: this.defaultInclude,
      where: { scopeId_serverId: { scopeId, serverId } },
    });
    if (!deletedServer) {
      return null;
    }
    return this.toDto(deletedServer);
  }

  private toDto(server: ServerFull): ServerDto {
    return {
      scopeId: server.scopeId,
      serverId: server.serverId,
      name: server.name,
      application: server.application,
      address: server.address,
      port: server.port ?? 0,
      capabilities: server.capabilities,
      owner: server.ownerId,
      added: new Date(server.addedAt),
      provider: server.provider ? {
        id: server.providerId!,
        name: server.provider.name,
        type: server.provider.type,
        subType: server.provider?.subType ?? undefined,
        owner: server.provider?.ownerId,
      } : undefined,
      providerServerData: server.providerData ? {
        identifier: server.providerData.identifier ?? undefined,
        location: server.providerData.location ?? undefined,
        data: server.providerData.data ? JSON.parse(server.providerData.data) : undefined,
      } : undefined,
      query: {
        type: server.queryType,
        address: server.queryAddress ?? undefined,
        port: server.queryPort ?? undefined,
      },
      status: server.status ? {
        status: server.status.status,
        provider: server.status.provider ?? undefined,
        query: server.status.query ?? undefined,
        data: server.status.data ? JSON.parse(server.status.data) : undefined,
      } : undefined,
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