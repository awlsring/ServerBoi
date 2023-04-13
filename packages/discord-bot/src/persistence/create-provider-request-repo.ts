import { CreateProviderRequest, PrismaClient } from '@prisma/client';
import { PrismaRepoOptions } from '@serverboi/discord-common';
import { CreateProviderRequestDto, NewCreateProviderRequestDto } from '../dto/create-provider-request-dto';

export class CreateProviderRequestRepo {
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
  
  async create(request: NewCreateProviderRequestDto): Promise<CreateProviderRequestDto> {
    const req = await this.prisma.createProviderRequest.create({
      data: {
        id: request.id,
        providerType: request.providerType,
        providerSubType: request.providerSubType,
      }
    });
    return this.toDto(req);
  }

  async findById(id: string): Promise<CreateProviderRequestDto | null> {
    const request = await this.prisma.createProviderRequest.findUnique({
      where: { id },
    });
    if (!request) {
      return null;
    }
    return this.toDto(request);
  }

  async findAll(amount?: number, skip?: number): Promise<CreateProviderRequestDto[]> {
    const users = await this.prisma.createProviderRequest.findMany({
      skip,
      take: amount,
    });
    return users.map((trackServer) => this.toDto(trackServer));
  }

  async update(id: string, trackServer: any): Promise<CreateProviderRequestDto> {
    const request = await this.prisma.createProviderRequest.update({
      where: { id: id },
      data: trackServer,
    });
    return this.toDto(request);
  }

  async delete(id: string): Promise<CreateProviderRequestDto | null> {
    const request = await this.prisma.createProviderRequest.delete({
      where: { id },
    });
    if (!request) {
      return null;
    }
    return this.toDto(request);
  }

  private toDto(trackServer: CreateProviderRequest): CreateProviderRequestDto {
    return {
      id: trackServer.id,
      startedAt: trackServer.startedAt,
      endedAt: trackServer.endedAt ?? undefined,
      providerType: trackServer.providerType,
      providerSubType: trackServer.providerSubType ?? undefined,
      providerData: trackServer.providerData ?? undefined,
      providerAuthKey: trackServer.providerAuthKey ?? undefined,
      providerAuthSecret: trackServer.providerAuthSecret ?? undefined,
      providerName: trackServer.providerName ?? undefined,
    }
  }
}