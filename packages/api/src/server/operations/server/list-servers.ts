import { Operation } from "@aws-smithy/server-common";
import { InternalServerError, ListServersServerInput, ListServersServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { serverToSummary } from "./common";

export const ListServersOperation: Operation<ListServersServerInput, ListServersServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received ListServers operation`);
    console.log(`Input: ${JSON.stringify(input)}`);

    const server = await context.controller.server.listServers();
    const summaries = server.map((server) => {
      return serverToSummary(server);
    });
    console.log(`Returning ${summaries.length} summaries.`);
    return {
      summaries: summaries
    }
  } catch (e) {
    console.error(e);
    throw new InternalServerError({ message: `Error listing servers: ${e}`} );
  }
};