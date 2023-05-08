import { Operation } from "@aws-smithy/server-common";
import { GetApplicationServerInput, GetApplicationServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "GetApplicationOperation" });

export const GetApplicationOperation: Operation<GetApplicationServerInput, GetApplicationServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({ message: `Not implemented`} );
};