import { PrismaRepoOptions } from "../persistence/prisma-repo-options";
import { logger } from "@serverboi/common";
import { ExecutionRepo } from "../persistence/executions-repo";
import { CreateServerExecutionDto, ExecutionDto } from "../dto/execution-dto";
import { WorkflowRunner, createRunner } from "../workflow/workflow-runner";
import { ExecutionStatus } from "@serverboi/ssdk";

export class ExecutionController {
  private logger = logger.child({ name: "ExecutionController" });
  private readonly executionRepo: ExecutionRepo;
  // private readonly workflowRunner: WorkflowRunner;

  constructor(cfg: PrismaRepoOptions) {
    this.executionRepo = new ExecutionRepo(cfg);
    // this.workflowRunner = createRunner();
  }

  async runCreateServerExecution(request: CreateServerExecutionDto): Promise<ExecutionDto> {
    throw Error("Not implemented");
    // this.logger.debug(`Running create server execution`);

    // this.logger.debug("Forming execution request")
    // const executionRequest: ExecutionDto = {
    //   id: `create-server-${uuidv4()}`,
    //   scope: request.scope,
    //   user: request.user,
    //   workflowType: "create-server",
    //   status: ExecutionStatus.RUNNING,
    //   input: {},
    //   runnerType: this.workflowRunner.getRunnerType(),
    // }

    // this.logger.debug(`Starting workflow`);
    // await this.workflowRunner.startWorkflow(executionRequest);
    // const execution = await this.executionRepo.create(executionRequest);

    // return execution;
  }

  async getExecution(id: string, user: string): Promise<ExecutionDto> {
    const execution = await this.executionRepo.find(id);
    if (!execution) {
      throw new Error(`Execution with id ${id} not found`);
    }
    if (execution.user !== user) {
      throw new Error(`Execution with id ${id} not found`);
    }

    return execution;
  }

  async listExecutions(user: string, amount?: number, skip?: number): Promise<ExecutionDto[]> {
    return this.executionRepo.findAll(user, amount, skip);
  }
}

function uuidv4(): string {
  throw new Error("Function not implemented.");
}
