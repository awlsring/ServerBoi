import { Operation } from "@aws-smithy/server-common";
import { ListApplicationsServerInput, ListApplicationsServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "ListApplicationsOperation" });

export const ListApplicationsOperation: Operation<ListApplicationsServerInput, ListApplicationsServerOutput, ServiceContext> = async (input, context) => {
  throw new InternalServerError({ message: `Not implemented`} );
};