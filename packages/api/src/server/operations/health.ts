import { Operation } from "@aws-smithy/server-common";
import { HealthServerInput, HealthServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../handler/context";

export const HealthOperation: Operation<HealthServerInput, HealthServerOutput, ServiceContext> = async (input, context) => {
  console.log(`Received Health operation`);
  console.log(`Context: ${JSON.stringify(context)}`);
  return {
    success: true,
  };
};