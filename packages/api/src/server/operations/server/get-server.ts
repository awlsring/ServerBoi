import { Operation } from "@aws-smithy/server-common";
import { GetServerServerInput, GetServerServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerDto } from "@serverboi/backend-common"
import { serverToSummary } from "./common";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "GetServerOperation" });

export const GetServerOperation: Operation<GetServerServerInput, GetServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received GetServer operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);
    
    let server: ServerDto;
    try {
      server = await context.controller.server.getServer(input.id!);
    } catch {
      console.error("Server not found");
      throw new ResourceNotFoundError({ message: `Server not found` });
    }
    const summary = serverToSummary(server)

    log.debug(`Returning summary: ${JSON.stringify(summary)}`);
    return {
      summary: summary
    }
  } catch (e) {
    log.error(e);
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Error getting server: ${e}`} );
  }
};