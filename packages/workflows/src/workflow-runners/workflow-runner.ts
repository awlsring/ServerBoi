import { CreateServerWorkflowInput } from "../workflows/create-server";

export enum WorkflowStatus {
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}

export interface WorkflowMetadata {
  readonly status: WorkflowStatus;
  readonly startedAt: Date;
  readonly currentStep?: string;
  readonly finishedAt?: Date;
  readonly executionId: string;
  readonly workflowName: string;
  readonly input: any;
  readonly output?: any;
}

export interface WorkflowRunner {
  getWorkflowStatus(executionId: string): Promise<WorkflowMetadata>;
  launchCreateServerWorkflow(executionId: string, input: CreateServerWorkflowInput): Promise<WorkflowMetadata>;
  launchDebugWorkflow(executionId: string, input: { message: string}): Promise<WorkflowMetadata>;
}