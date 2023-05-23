import { CreateServerWorkflowInput } from "../../workflows/create-server";
import { WorkflowMetadata, WorkflowRunner, WorkflowStatus } from "../workflow-runner";
import { CreateServerWorkflow } from "./workflows/create-server";
import { logger } from "@serverboi/common";
import { ExecutionMetadata, LocalWorkflowRunner } from "../local-runner/runner";
import { ServerBoiLocalRunnerContext } from "./context";

export class ServerBoiLocalWorkflowRunner implements WorkflowRunner {
  private logger = logger.child({ name: "ServerBoiLocalWorkflowRunner" });
  private runner = new LocalWorkflowRunner();

  private excutionToWorkflow(execution: ExecutionMetadata): WorkflowMetadata {
    return {
      status: execution.status as string as WorkflowStatus,
      startedAt: execution.startedAt,
      currentStep: execution.currentStep,
      finishedAt: execution.finishedAt,
      executionId: execution.executionId,
      workflowName: execution.workflowName,
      input: execution.input,
      output: execution.output,
    }
  }

  async getWorkflowStatus(executionId: string): Promise<WorkflowMetadata> {
    const execution = await this.runner.getExecutionMetadata(executionId);
    return this.excutionToWorkflow(execution);
  }

  async launchCreateServerWorkflow(input: CreateServerWorkflowInput): Promise<WorkflowMetadata> {
    this.logger.debug("Launching create server workflow with id");
    const execution = await this.runner.runWorkflow({
      workflowName: "create-server",
      input,
    },
    ServerBoiLocalRunnerContext,
    CreateServerWorkflow)
    return this.excutionToWorkflow(execution);
  }

  async launchDebugWorkflow(input: {message: string}): Promise<WorkflowMetadata> {
    const execution = await this.runner.runWorkflow({
      workflowName: "debug",
      input,
    },
    ServerBoiLocalRunnerContext,
    DebugWorkflow)
    return this.excutionToWorkflow(execution);
  }
}

export async function DebugWorkflow(input: { message: string}) {
  console.log(input.message);
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
