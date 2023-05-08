import { Operation } from "@aws-smithy/server-common";
import { ResourceNotFoundError, InternalServerError, UntrackServerServerInput, UntrackServerServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "DeleteServerOperation" });

export const DeleteServerOperation: Operation<UntrackServerServerInput, UntrackServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received DeleteServer operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);

    const server = await context.controller.server.getServer(input.id!);
    if (server.owner !== context.user) {
      throw new ResourceNotFoundError({ message: `Server not found: ${input.id}` });
    }

    await context.controller.server.deleteServer(input.id!);

    return {
      success: true
    }
  } catch (e) {
    log.error(e);
    throw new InternalServerError({ message: `Error deleting server: ${e}`} );
  }
};