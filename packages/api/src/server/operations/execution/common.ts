import { ExecutionDto } from "@serverboi/backend-common";
import { ExecutionSummary } from "@serverboi/ssdk";

export function executionToSummary(execution: ExecutionDto): ExecutionSummary {
  return {
    id: execution.id,
    workflowType: execution.workflowType,
    currentStep: execution.currentStep,
    status: execution.status,
    input: execution.input,
    output: execution.output,
    error: execution.error,
    createdAt: execution.createdAt?.getTime(),
    updatedAt: execution.updatedAt?.getTime(),
    endedAt: execution.endedAt?.getTime(),
  };
}