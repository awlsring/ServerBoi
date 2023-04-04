import { Operation } from "@aws-smithy/server-common";
import { ResourceNotFoundError, InternalServerError, UntrackServerServerInput, UntrackServerServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const UntrackServerOperation: Operation<UntrackServerServerInput, UntrackServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received UntrackServer operation`);
    console.log(`Input: ${JSON.stringify(input)}`);

    const server = await context.controller.server.getServer(input.id!);
    if (server.owner !== context.user) {
      throw new ResourceNotFoundError({ message: `Server not found: ${input.id}` });
    }

    await context.controller.server.untrackServer(input.id!);

    return {
      success: true
    }
  } catch (e) {
    console.error(e);
    throw new InternalServerError({ message: `Error untracking server: ${e}`} );
  }
};