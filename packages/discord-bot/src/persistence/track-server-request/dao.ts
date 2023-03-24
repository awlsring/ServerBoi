import { PrismaClient, TrackServer } from '@prisma/client';
import { NewTrackServerRequestDto, TrackServerRequestDto } from './dto';

const prisma = new PrismaClient();

export class TrackServerRequestDao {
  async create(request: NewTrackServerRequestDto): Promise<TrackServerRequestDto> {
    const createdServer = await prisma.trackServer.create({
      data: {
        id: request.id,
        name: request.name,
        application: request.application,
        address: request.address,
        ownerId: request.ownerId,
      }
    });
    return this.toDto(createdServer);
  }

  async findById(id: string): Promise<TrackServerRequestDto | null> {
    const trackServer = await prisma.trackServer.findUnique({
      where: { id },
    });
    if (!trackServer) {
      return null;
    }
    console.log(JSON.stringify(trackServer, null, 2));
    return this.toDto(trackServer);
  }

  async findAll(amount?: number, skip?: number): Promise<TrackServerRequestDto[]> {
    const users = await prisma.trackServer.findMany({
      skip,
      take: amount,
    });
    return users.map((trackServer) => this.toDto(trackServer));
  }

  async update(id: string, trackServer: any): Promise<TrackServerRequestDto | null> {
    const updatedServer = await prisma.trackServer.update({
      where: { id: id },
      data: trackServer,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(id: string): Promise<TrackServerRequestDto | null> {
    const deletedServer = await prisma.trackServer.delete({
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
      ownerId: trackServer.ownerId,
      queryType: trackServer.queryType ?? undefined,
      queryPort: trackServer.queryPort ?? undefined,
      queryAddress: trackServer.queryAddress ?? undefined,
    }
  }
}