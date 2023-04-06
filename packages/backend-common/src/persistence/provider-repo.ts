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

  async find(name: string, ownerId: string): Promise<ProviderDto> {
    const results = await this.prisma.provider.findMany({
      where: { 
        name: name,
        ownerId: ownerId,
      },
    });

    if (results.length != 1) {
      throw new Error("Provider not found");
    }

    console.log(JSON.stringify(results[0], null, 2));
    return this.toDto(results[0]);
  }

  async findAll(ownerId: string, amount?: number, skip?: number): Promise<ProviderDto[]> {
    const users = await this.prisma.provider.findMany({
      where: { 
        ownerId: ownerId,
      },
      skip,
      take: amount,
    });
    return users.map((provider) => this.toDto(provider));
  }

  async update(name: string, ownerId: string, provider: Provider): Promise<ProviderDto | null> {
    const entry = await this.find(name, ownerId);
    const updated = await this.prisma.provider.update({
      where: { 
        id: entry.id
      },
      data: provider,
    });
    if (!updated) {
      return null;
    }
    return this.toDto(updated);
  }

  async delete(name: string, ownerId: string,): Promise<void> {
    const entry = await this.find(name, ownerId);
    await this.prisma.provider.delete({
      where: { id: entry.id },
    });
  }

  private toDto(provider: Provider): ProviderDto {
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      owner: provider.ownerId,
      data: provider.data ?? undefined,
    };
  }
}