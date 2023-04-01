import { PrismaClient, Provider } from '@prisma/client';
import { NewProviderDto, ProviderDto } from '../dto/provider-dto';
import { PrismaRepoOptions } from './prisma-repo-options';

export class ProviderRepo {
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

  async create(request: NewProviderDto): Promise<ProviderDto> {
    const created = await this.prisma.provider.create({
      include: {
        auth: true,
      },
      data: {
        name: request.name,
        type: request.type,
        ownerId: request.owner,
        auth: {
          create: {
            key: request.auth.key,
            secret: request.auth.secret ?? undefined,
          }
        }
      }
    });
    return this.toDto(created);
  }

  async findById(id: string): Promise<ProviderDto | null> {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
    });
    if (!provider) {
      return null;
    }
    console.log(JSON.stringify(provider, null, 2));
    return this.toDto(provider);
  }

  async findAll(amount?: number, skip?: number): Promise<ProviderDto[]> {
    const users = await this.prisma.provider.findMany({
      skip,
      take: amount,
    });
    return users.map((provider) => this.toDto(provider));
  }

  async update(id: string, provider: Provider): Promise<ProviderDto | null> {
    const updated = await this.prisma.provider.update({
      where: { id },
      data: provider,
    });
    if (!updated) {
      return null;
    }
    return this.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.provider.delete({
      where: { id },
    });
  }

  private toDto(provider: Provider): ProviderDto {
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      owner: provider.ownerId,
    };
  }
}