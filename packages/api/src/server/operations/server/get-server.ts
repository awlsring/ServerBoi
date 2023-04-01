import { Operation } from "@aws-smithy/server-common";
import { GetServerServerInput, GetServerServerOutput, InternalServerError, ResourceNotFoundError, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { Server, ServerController } from "@serverboi/services"
import { serverToSummary } from "./common";

export const GetServerOperation: Operation<GetServerServerInput, GetServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received GetServer operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Context: ${JSON.stringify(context)}`);
  
    const controller = ServerController.getInstance();
  
    let server: Server;
    try {
      server = await controller.getServer(input.id!);
    } catch {
      throw new ResourceNotFoundError({ message: `Server not found` });
    }
    const summary = serverToSummary(server)

    console.log(`Returning summary: ${JSON.stringify(summary)}`);
    return {
      summary: summary
    }
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error getting server: ${e}`} );
  }
};