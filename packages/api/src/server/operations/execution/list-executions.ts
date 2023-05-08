import { Operation } from "@aws-smithy/server-common";
import { ListExecutionsServerInput, ListExecutionsServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ExecutionDto } from "@serverboi/backend-common"
import { logger } from "@serverboi/common";
import { executionToSummary } from "./common";

const log = logger.child({ name: "ListExecutionsOperation" });

export const ListExecutionsOperation: Operation<ListExecutionsServerInput, ListExecutionsServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received ListExecutions operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);
    
    let executions: ExecutionDto[];
    try {
       executions = await context.controller.execution.listExecutions(context.user);
    } catch {
      console.error("Execution not found");
      throw new ResourceNotFoundError({ message: `Execution not found` });
    }

    log.debug(`Returning summaries: ${executions.length}`);
    return {
      summaries: executions.map(e => executionToSummary(e))
    }
  } catch (e) {
    log.error(e);
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error getting execution: ${e}`} );
  }
};