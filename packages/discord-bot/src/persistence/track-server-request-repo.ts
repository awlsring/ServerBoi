import { PrismaClient, TrackServer } from '@prisma/client';
import { NewTrackServerRequestDto, TrackServerRequestDto } from '../dto/track-server-request-dto';
import { PrismaRepoOptions } from '@serverboi/discord-common';

export class TrackServerRequestRepo {
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
  
  async create(request: NewTrackServerRequestDto): Promise<TrackServerRequestDto> {
    const createdServer = await this.prisma.trackServer.create({
      data: {
        id: request.id,
        name: request.name,
        application: request.application,
        address: request.address,
        port: request.port,
        ownerId: request.ownerId,
      }
    });
    return this.toDto(createdServer);
  }

  async findById(id: string): Promise<TrackServerRequestDto | null> {
    const trackServer = await this.prisma.trackServer.findUnique({
      where: { id },
    });
    if (!trackServer) {
      return null;
    }
    console.log(JSON.stringify(trackServer, null, 2));
    return this.toDto(trackServer);
  }

  async findAll(amount?: number, skip?: number): Promise<TrackServerRequestDto[]> {
    const users = await this.prisma.trackServer.findMany({
      skip,
      take: amount,
    });
    return users.map((trackServer) => this.toDto(trackServer));
  }

  async update(id: string, trackServer: any): Promise<TrackServerRequestDto> {
    const updatedServer = await this.prisma.trackServer.update({
      where: { id: id },
      data: trackServer,
    });
    return this.toDto(updatedServer);
  }

  async delete(id: string): Promise<TrackServerRequestDto | null> {
    const deletedServer = await this.prisma.trackServer.delete({
      where: { id },
    });
    if (!deletedServer) {
      return null;
    }
    return this.toDto(deletedServer);
  }

  private toDto(trackServer: TrackServer): TrackServerRequestDto {
    return {
      id: trackServer.id,
      name: trackServer.name,
      application: trackServer.application,
      address: trackServer.address,
      port: trackServer.port,
      ownerId: trackServer.ownerId,
      queryType: trackServer.queryType ?? undefined,
      queryPort: trackServer.queryPort ?? undefined,
      queryAddress: trackServer.queryAddress ?? undefined,
    }
  }
}