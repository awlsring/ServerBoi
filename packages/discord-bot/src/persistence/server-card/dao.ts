import { PrismaClient, ServerCard } from '@prisma/client';
import { ServerCardDto, NewServerCardDto } from './dto';

const prisma = new PrismaClient();

export class ServerCardDao {
  async create(request: NewServerCardDto): Promise<ServerCardDto> {
    const createdServer = await prisma.serverCard.create({
      data: {
        ...request,
      }
    });
    return this.toDto(createdServer);
  }

  async findById(id: string): Promise<ServerCardDto | null> {
    const serverCard = await prisma.serverCard.findUnique({
      where: { id },
    });
    if (!serverCard) {
      return null;
    }
    console.log(JSON.stringify(serverCard, null, 2));
    return this.toDto(serverCard);
  }

  async findAll(amount?: number, skip?: number): Promise<ServerCardDto[]> {
    const users = await prisma.serverCard.findMany({
      skip,
      take: amount,
    });
    return users.map((serverCard) => this.toDto(serverCard));
  }

  async update(id: string, serverCard: any): Promise<ServerCardDto | null> {
    const updatedServer = await prisma.serverCard.update({
      where: { id: id },
      data: serverCard,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(id: string): Promise<ServerCardDto | null> {
    const deletedServer = await prisma.serverCard.delete({
      where: { id },
    });
    if (!deletedServer) {
      return null;
    }
    return this.toDto(deletedServer);
  }

  private toDto(card: ServerCard): ServerCardDto {
    return {
      id: card.id,
      addedAt: new Date(card.addedAt),
      serverId: card.serverId,
      channelId: card.channelId,
      ownerId: card.ownerId,
      admins: card.admins,
      alerts: {
        users: card.alertUsers,
        channels: card.alertChannels,
      },
    }
  }
}