import { PrismaClient, ServerCard } from '@prisma/client';
import { ServerCardDto, NewServerCardDto } from '../dto/server-card-dto';

const prisma = new PrismaClient();

export class ServerCardRepo {
  async create(request: NewServerCardDto): Promise<ServerCardDto> {
    const createdServer = await prisma.serverCard.create({
      data: {
        ...request,
      }
    });
    return this.toDto(createdServer);
  }

  async findById(messageId: string): Promise<ServerCardDto | null> {
    const serverCard = await prisma.serverCard.findUnique({
      where: { messageId },
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

  async update(messageId: string, serverCard: any): Promise<ServerCardDto | null> {
    const updatedServer = await prisma.serverCard.update({
      where: { messageId: messageId },
      data: serverCard,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(messageId: string): Promise<ServerCardDto | null> {
    const deletedServer = await prisma.serverCard.delete({
      where: { messageId },
    });
    if (!deletedServer) {
      return null;
    }
    return this.toDto(deletedServer);
  }

  private toDto(card: ServerCard): ServerCardDto {
    return {
      messageId: card.messageId,
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