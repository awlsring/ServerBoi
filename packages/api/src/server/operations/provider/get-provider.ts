import { Operation } from "@aws-smithy/server-common";
import { GetProviderServerInput, GetProviderServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const GetProviderOperation: Operation<GetProviderServerInput, GetProviderServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({ message: `Not impemented`} );
};