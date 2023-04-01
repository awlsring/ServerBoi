import { Operation } from "@aws-smithy/server-common";
import { DeleteProviderServerInput, DeleteProviderServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const DeleteProviderOperation: Operation<DeleteProviderServerInput, DeleteProviderServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({ message: `Not impemented`} );
};