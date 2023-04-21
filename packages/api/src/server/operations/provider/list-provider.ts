import { Operation } from "@aws-smithy/server-common";
import { ListProvidersServerInput, ListProvidersServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { providerToSummary } from "./common";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "ListProvidersOperation" });

export const ListProvidersOperation: Operation<ListProvidersServerInput, ListProvidersServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received ListProviders operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);

    const providers = await context.controller.provider.listProviders(context.user);
    const summaries = providers.map((provider) => {
      return providerToSummary(provider);
    });
    log.debug(`Returning ${summaries.length} summaries.`);
    return {
      summaries: summaries
    }
  } catch (e) {
    log.error(e);
    throw new InternalServerError({ message: `Error listing servers: ${e}`} );
  }
};