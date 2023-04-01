import { Operation } from "@aws-smithy/server-common";
import { InternalServerError, ListServersServerInput, ListServersServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerController } from "@serverboi/services"
import { serverToSummary } from "./common";

export const ListServersOperation: Operation<ListServersServerInput, ListServersServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received ListServers operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Context: ${JSON.stringify(context)}`);

    const controller = ServerController.getInstance();

    const server = await controller.listServers();
    const summaries = server.map((server) => {
      return serverToSummary(server);
    });
    console.log(`Returning ${summaries.length} summaries.`);
    return {
      summaries: summaries
    }
  } catch (e) {
    throw new InternalServerError({ message: `Error listing servers: ${e}`} );
  }
};