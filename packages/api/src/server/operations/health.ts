import { Operation } from "@aws-smithy/server-common";
import { HealthServerInput, HealthServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "HealthOperation" });

export const HealthOperation: Operation<HealthServerInput, HealthServerOutput, ServiceContext> = async (input, context) => {
  log.debug(`Received Health operation`);
  log.debug("Healthy!")
  return {
    success: true,
  };
};