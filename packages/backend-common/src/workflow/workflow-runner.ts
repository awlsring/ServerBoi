import { ExecutionDto } from "../dto/execution-dto";

export interface WorkflowRunner {
  startWorkflow(request: ExecutionDto): Promise<string>;
  getExecution(id: string): Promise<ExecutionDto>;
  listExecutions(user: string): Promise<ExecutionDto[]>;
  getRunnerType(): string;
}

export function createRunner(): WorkflowRunner {
  throw new Error("Not implemented");
}