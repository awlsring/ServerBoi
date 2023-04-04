import { Operation } from "@aws-smithy/server-common";
import { DeleteProviderServerInput, DeleteProviderServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const DeleteProviderOperation: Operation<DeleteProviderServerInput, DeleteProviderServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received DeleteProvider operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    
    try {
      await context.controller.provider.deleteProvider(input.name!, context.user);
    } catch {
      throw new ResourceNotFoundError({ message: `Provider not found` });
    }

    return {
      success: true
    }
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Internal${e}`} );
  }
};