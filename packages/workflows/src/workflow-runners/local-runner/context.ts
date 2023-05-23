import { ExecutionMetadata } from "./runner";

export class LocalWorkflowRunnerContext {
  constructor(protected executionMetadata: ExecutionMetadata) {}

  registerOutput(output: any) {
      this.executionMetadata.output = output;
  }

  changeStep(step: string) {
      this.executionMetadata.currentStep = step;
  }
}