import { PrismaClient, ServerCard } from '@prisma/client';
import { ServerCardDto, NewServerCardDto } from '../dto/server-card-dto';
import { PrismaRepoOptions } from './prisma-options';

export class ServerCardRepo {
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

  async create(request: NewServerCardDto): Promise<ServerCardDto> {
    const createdServer = await this.prisma.serverCard.create({
      data: {
        ...request,
      }
    });
    return this.toDto(createdServer);
  }

  async findById(id: string): Promise<ServerCardDto | null> {
    const serverCard = await this.prisma.serverCard.findUnique({
      where: { id },
    });
    if (!serverCard) {
      return null;
    }
    return this.toDto(serverCard);
  }

  async findByMessageId(messageId: string): Promise<ServerCardDto | null> {
    const serverCard = await this.prisma.serverCard.findUnique({
      where: { messageId },
    });
    if (!serverCard) {
      return null;
    }
    return this.toDto(serverCard);
  }

  async findByServerId(id: string): Promise<ServerCardDto | null> {
    const serverCard = await this.prisma.serverCard.findUnique({
      where: { serverId: id },
    });
    if (!serverCard) {
      return null;
    }
    return this.toDto(serverCard);
  }

  async findAll(amount?: number, skip?: number): Promise<ServerCardDto[]> {
    const users = await this.prisma.serverCard.findMany({
      skip,
      take: amount,
    });
    return users.map((serverCard) => this.toDto(serverCard));
  }

  async update(id: string, serverCard: any): Promise<ServerCardDto | null> {
    const updatedServer = await this.prisma.serverCard.update({
      where: { id: id },
      data: serverCard,
    });
    if (!updatedServer) {
      return null;
    }
    return this.toDto(updatedServer);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.serverCard.delete({
      where: { id: id },
    });
  }

  private toDto(card: ServerCard): ServerCardDto {
    return {
      id: card.id,
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