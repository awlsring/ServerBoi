import { randomUUID } from "crypto";
import { logger } from "@serverboi/common";
import { LRUCache } from "@serverboi/backend-common";
import { LocalWorkflowRunnerContext } from "./context";

type WorkflowFunction = (input: any, context: LocalWorkflowRunnerContext) => any;

type ContextClass = new (executionMetadata: ExecutionMetadata) => LocalWorkflowRunnerContext;

export interface RunWorkflowInput {
  readonly workflowName: string;
  readonly input: any;
}

export enum ExecutionStatus {
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export interface ExecutionMetadata {
  readonly status: ExecutionStatus;
  readonly startedAt: Date;
  readonly finishedAt?: Date;
  readonly executionId: string;
  readonly workflowName: string;
  readonly input: any;
  currentStep?: string;
  output?: any;
}

export class LocalWorkflowRunner{
  private logger = logger.child({ name: "LocalWorkflowRunner" });
  private readonly providerCache: LRUCache<ExecutionMetadata>;
  
  constructor() {
    this.providerCache = new LRUCache<ExecutionMetadata>(1000);
    setInterval(() => {
      for (const node of this.providerCache.getCache().values()) {
        if (Date.now() - node.created > this.providerCache.maxAge) {
          this.logger.info("clearing expired execution from cache", node.key)
          this.providerCache.getCache().delete(node.key);
          this.providerCache.clear(node.key);
        }
      }
    }, 60 * 1000 * 60);
  }

  private generateExecutionId(): string {
    return randomUUID();
  }

  async getExecutionMetadata(executionId: string): Promise<ExecutionMetadata> {
    const metadata = this.providerCache.get(executionId);
    if (!metadata) {
      throw new Error(`Execution ${executionId} not found in cache`);
    }
    return metadata;
  }

  async runWorkflow(input: RunWorkflowInput, contextClass: ContextClass, workflow: WorkflowFunction): Promise<ExecutionMetadata> {
    const executionId = this.generateExecutionId();
    const metadata = {
      status: ExecutionStatus.RUNNING,
      startedAt: new Date(),
      executionId: executionId,
      workflowName: input.workflowName,
      input: input.input,
    }
    this.providerCache.set(executionId, metadata);
    const context = new contextClass(metadata);

    this.runWorkflowInBackground(executionId, input, context, workflow);
    return metadata;
  }
  
  private async runWorkflowInBackground(executionId: string, input: any, context: LocalWorkflowRunnerContext, workflow: WorkflowFunction): Promise<void> {
    this.logger.debug('Starting background workflow execution');
    
    const metadata = this.providerCache.get(executionId);
    if (!metadata) {
      throw new Error(`Execution ${executionId} not found in cache`);
    }

    let status = metadata.status;
    try {
      await workflow(input, context)
      this.providerCache.set(executionId, {
        status: ExecutionStatus.COMPLETED,
        startedAt: metadata.startedAt,
        finishedAt: new Date(),
        executionId: executionId,
        workflowName: input.workflowName,
        input: input.input,
        output: metadata.output,
      });
      status = ExecutionStatus.COMPLETED;
    } catch (error) {
      this.logger.error(`Workflow ${executionId} failed`, error);
      this.providerCache.set(executionId, {
        status: ExecutionStatus.FAILED,
        startedAt: metadata.startedAt,
        currentStep: metadata.currentStep,
        finishedAt: new Date(),
        executionId: executionId,
        workflowName: input.workflowName,
        input: input.input,
        output: error,
      });
      status = ExecutionStatus.FAILED;
    }
    
    this.logger.debug(`Workflow ${executionId} finished with status ${status}`);
  }
}
