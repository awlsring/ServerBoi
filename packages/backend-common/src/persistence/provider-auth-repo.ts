import { PrismaClient, ProviderAuth } from '@prisma/client';
import { ProviderAuthDto } from '../dto/provider-dto';
import { PrismaRepoOptions } from './prisma-repo-options';

export class ProviderAuthRepo {
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

  async findById(id: string): Promise<ProviderAuthDto | null> {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: {
        auth: true,
      }
    });
    if (!provider) {
      return null;
    }
    if (!provider!.auth) {
      return null;
    }
    console.log(JSON.stringify(provider, null, 2));
    return this.toDto(provider.auth);
  }

  async findAll(amount?: number, skip?: number): Promise<ProviderAuthDto[]> {
    const users = await this.prisma.providerAuth.findMany({
      skip,
      take: amount,
    });
    return users.map((provider) => this.toDto(provider));
  }

  async update(id: string, auth: ProviderAuth): Promise<ProviderAuthDto | null> {
    const updated = await this.prisma.providerAuth.update({
      where: { providerId: id },
      data: auth,
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

  private toDto(auth: ProviderAuth): ProviderAuthDto {
    return {
      key: auth.key,
      secret: auth.secret ?? undefined,
    };
  }
}