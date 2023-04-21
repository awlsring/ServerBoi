import { Operation } from "@aws-smithy/server-common";
import { InternalServerError, UpdateServerServerInput, UpdateServerServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "UpdateServerOperation" });

export const UpdateServerOperation: Operation<UpdateServerServerInput, UpdateServerServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({message: "Not implemented"});
};