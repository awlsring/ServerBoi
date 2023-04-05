import { Operation } from "@aws-smithy/server-common";
import { StartServerServerInput, StartServerServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const StartServerOperation: Operation<StartServerServerInput, StartServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received StartServer operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    
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
    console.error(e);
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error starting server: ${e}`} );
  }
};