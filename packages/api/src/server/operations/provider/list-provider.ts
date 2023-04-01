import { Operation } from "@aws-smithy/server-common";
import { ListProvidersServerInput, ListProvidersServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const ListProvidersOperation: Operation<ListProvidersServerInput, ListProvidersServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({ message: `Not impemented`} );
};