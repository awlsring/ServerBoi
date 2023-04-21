import { Operation } from "@aws-smithy/server-common";
import { InternalServerError, ListServersServerInput, ListServersServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { serverToSummary } from "./common";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "ListServersOperation" });

export const ListServersOperation: Operation<ListServersServerInput, ListServersServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received ListServers operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);

    const server = await context.controller.server.listServers({
      user: context.user,
      scopeId: input.scope,
    });
    const summaries = server.map((server) => {
      return serverToSummary(server);
    });
    log.debug(`Returning ${summaries.length} summaries.`);
    return {
      summaries: summaries
    }
  } catch (e) {
    log.error(e);
    throw new InternalServerError({ message: `Error listing servers: ${e}`} );
  }
};