import { Execution, PrismaClient } from '@prisma/client';
import { PrismaRepoOptions } from './prisma-repo-options';
import { ExecutionDto } from '../dto/execution-dto';
import { ExecutionStatus } from '@serverboi/ssdk';

export class ExecutionRepo {
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

  async create(request: ExecutionDto): Promise<ExecutionDto> {
    const created = await this.prisma.execution.create({
      data: {
        id: request.id,
        scope: request.scope,
        user: request.user,
        runnerType: request.runnerType,
        workflowType: request.workflowType,
        status: ExecutionStatus.RUNNING,
        input: request.input,
      }
    });
    return this.toDto(created);
  }

  async find(id: string): Promise<ExecutionDto | null> {
    const results = await this.prisma.execution.findUnique({
      where: { 
        id,
      },
    });

    if (!results) {
      return null;
    }

    return this.toDto(results);
  }

  async findAll(user: string, amount?: number, skip?: number): Promise<ExecutionDto[]> {
    const users = await this.prisma.execution.findMany({
      where: { 
        user,
      },
      skip,
      take: amount,
    });
    return users.map((provider) => this.toDto(provider));
  }

  async update(id: string, execution: Execution): Promise<ExecutionDto | null> {
    const updated = await this.prisma.execution.update({
      where: { 
        id: id
      },
      data: execution,
    });
    if (!updated) {
      return null;
    }
    return this.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.execution.delete({
      where: { id },
    });
  }

  private toDto(provider: Execution): ExecutionDto {
    return {
      id: provider.id,
      scope: provider.scope,
      user: provider.user,
      workflowType: provider.workflowType,
      status: provider.status,
      input: provider.input,
      runnerType: provider.runnerType,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt ?? undefined,
      endedAt: provider.endedAt ?? undefined,
      currentStep: provider.currentStep ?? undefined,
      output: provider.output ?? undefined,
      error: provider.errorType ? {
        name: provider.errorType,
        message: provider.errorMesage ?? undefined,
      } : undefined,
    };
  }
}