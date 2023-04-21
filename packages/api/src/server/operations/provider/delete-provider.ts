import { Operation } from "@aws-smithy/server-common";
import { DeleteProviderServerInput, DeleteProviderServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "DeleteProviderOperation" });

export const DeleteProviderOperation: Operation<DeleteProviderServerInput, DeleteProviderServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received DeleteProvider operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);
    
    try {
      await context.controller.provider.deleteProvider(input.name!, context.user);
    } catch (e) {
      log.error(e)
      throw new ResourceNotFoundError({ message: `Provider not found` });
    }

    return {
      success: true
    }
  } catch (e) {
    log.error(e)
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Internal${e}`} );
  }
};