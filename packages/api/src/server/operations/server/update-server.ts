import { Operation } from "@aws-smithy/server-common";
import { InternalServerError, UpdateServerServerInput, UpdateServerServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";

export const UpdateServerOperation: Operation<UpdateServerServerInput, UpdateServerServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError("Not implemented");
};