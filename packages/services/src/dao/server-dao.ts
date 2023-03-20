import { PrismaClient, Server } from '@prisma/client';
import { NewServerDto, ServerDto } from '../dto/server-dto';

const prisma = new PrismaClient();

export class ServerDao {
  async create(server: NewServerDto): Promise<ServerDto> {
    const createdServer = await prisma.server.create({
      data: {
        name: server.name,
        application: server.application,
        address: server.address,
        capabilities: server.capabilities,
        ownerId: server.owner,
        location: server.location,
        queryType: server.query.type,
        platformData: server.platform.data,
        platform: server.platform.type,
      }
    });
    return this.toDto(createdServer);
  }

  async findById(id: string): Promise<ServerDto | null> {
    const server = await prisma.server.findUnique({
      where: { id },
    });
    if (!server) {
      return null;
    }
    console.log(JSON.stringify(server, null, 2));
    return this.toDto(server);
  }

  async findAll(amount?: number, skip?: number): Promise<ServerDto[]> {
    const users = await prisma.server.findMany({
      skip,
      take: amount,
    });
    return users.map((server) => this.toDto(server));
  }

  async update(id: string, server: Server): Promise<ServerDto | null> {
    const updatedServer = await prisma.server.update({
      where: { id },
      data: server,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(id: string): Promise<ServerDto | null> {
    const deletedServer = await prisma.server.delete({
      where: { id },
    });
    if (!deletedServer) {
      return null;
    }
    return this.toDto(deletedServer);
  }

  private toDto(server: Server): ServerDto {
    return {
      id: server.id,
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
      location: server.location ?? undefined,
      lastUpdated: server.updatedAt ? new Date(server.updatedAt) : undefined,
    };
  }
}