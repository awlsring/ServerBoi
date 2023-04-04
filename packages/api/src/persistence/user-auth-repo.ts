import { PrismaClient, UserAuth } from '@prisma/client';
import { UserAuthDto } from '../dto/user-auth-dto';
import { PrismaRepoOptions } from '@serverboi/backend-common';

export class UserAuthRepo {
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

  async create(scope: string, key: string): Promise<UserAuthDto> {
    const created = await this.prisma.userAuth.create({
      data: { scope: scope, key: key }
    });
    return this.toDto(created);
  }

  async findByKey(key: string): Promise<UserAuthDto | null> {
    const result = await this.prisma.userAuth.findUnique({
      where: { 
        key: key
      },
    });

    if (!result) {
      return null;
    }
    return this.toDto(result);
  }

  async findAll(amount?: number, skip?: number): Promise<UserAuthDto[]> {
    const users = await this.prisma.userAuth.findMany({
      skip,
      take: amount,
    });
    return users.map((user) => this.toDto(user));
  }

  async update(key: string, user: UserAuth): Promise<UserAuthDto | null> {
    const updated = await this.prisma.userAuth.update({
      where: { 
        key: key
      },
      data: user,
    });
    if (!updated) {
      return null;
    }
    return this.toDto(updated);
  }

  async delete(key: string): Promise<void> {
    await this.prisma.userAuth.delete({
      where: { key: key },
    });
  }

  private toDto(auth: UserAuth): UserAuthDto {
    return {
      scope: auth.scope,
      key: auth.key,
      valid: auth.valid,
    };
  }
}