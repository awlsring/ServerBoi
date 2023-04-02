import { Operation } from "@aws-smithy/server-common";
import { GetServerServerInput, GetServerServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerController, ServerDto } from "@serverboi/services"
import { serverToSummary } from "./common";

export const GetServerOperation: Operation<GetServerServerInput, GetServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received GetServer operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    
    let server: ServerDto;
    try {
      server = await context.controller.server.getServer(input.id!);
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