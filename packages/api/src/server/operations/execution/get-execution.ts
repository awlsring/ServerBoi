import { Operation } from "@aws-smithy/server-common";
import { GetExecutionServerInput, GetExecutionServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ExecutionDto } from "@serverboi/backend-common"
import { logger } from "@serverboi/common";
import { executionToSummary } from "./common";

const log = logger.child({ name: "GetExecutionOperation" });

export const GetExecutionOperation: Operation<GetExecutionServerInput, GetExecutionServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received GetExecution operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);
    
    let execution: ExecutionDto;
    try {
       execution = await context.controller.execution.getExecution(input.id!, context.user);
    } catch {
      console.error("Execution not found");
      throw new ResourceNotFoundError({ message: `Execution not found` });
    }
    const summary = executionToSummary(execution)

    log.debug(`Returning summary: ${JSON.stringify(summary)}`);
    return {
      summary: summary
    }
  } catch (e) {
    log.error(e);
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error getting execution: ${e}`} );
  }
};