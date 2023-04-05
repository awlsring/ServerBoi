import { Operation } from "@aws-smithy/server-common";
import { StopServerServerInput, StopServerServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const StopServerOperation: Operation<StopServerServerInput, StopServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received StopServer operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    
    try {
      await context.controller.server.stopServer(input.id!);
    } catch {
      // can be more, route based off error
      throw new ResourceNotFoundError({ message: `Server not found` });
    }

    return {
      success: true
    }
  } catch (e) {
    console.error(e);
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error starting server: ${e}`} );
  }
};