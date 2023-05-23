import { LocalWorkflowRunnerContext } from "../local-runner/context";
import { ExecutionMetadata } from "../local-runner/runner";

export class ServerBoiLocalRunnerContext extends LocalWorkflowRunnerContext {
    constructor(executionMetadata: ExecutionMetadata) {
        super(executionMetadata);
    }

    registerOutput(output: any) {
        this.executionMetadata.output = output;
    }

    changeStep(step: string) {
        this.executionMetadata.currentStep = step;
    }
}