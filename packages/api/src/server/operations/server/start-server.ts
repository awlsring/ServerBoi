import { Operation } from "@aws-smithy/server-common";
import { StartServerServerInput, StartServerServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "StartServerOperation" });

export const StartServerOperation: Operation<StartServerServerInput, StartServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received StartServer operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);
    
    try {
      await context.controller.server.startServer(input.id!);
    } catch {
      // can be more, route based off error
      throw new ResourceNotFoundError({ message: `Server not found` });
    }

    return {
      success: true
    }
  } catch (e) {
    log.error(e);
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error starting server: ${e}`} );
  }
};