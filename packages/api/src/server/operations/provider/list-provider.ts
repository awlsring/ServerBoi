import { Operation } from "@aws-smithy/server-common";
import { ListProvidersServerInput, ListProvidersServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { providerToSummary } from "./common";

export const ListProvidersOperation: Operation<ListProvidersServerInput, ListProvidersServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received ListProviders operation`);
    console.log(`Input: ${JSON.stringify(input)}`);

    const providers = await context.controller.provider.listProviders(context.user);
    const summaries = providers.map((provider) => {
      return providerToSummary(provider);
    });
    console.log(`Returning ${summaries.length} summaries.`);
    return {
      summaries: summaries
    }
  } catch (e) {
    console.error(e);
    throw new InternalServerError({ message: `Error listing servers: ${e}`} );
  }
};