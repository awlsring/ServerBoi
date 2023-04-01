import { Operation } from "@aws-smithy/server-common";
import { CreateProviderServerInput, CreateProviderServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const CreateProviderOperation: Operation<CreateProviderServerInput, CreateProviderServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({ message: `Not impemented`} );
};