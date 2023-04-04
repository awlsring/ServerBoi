import { Operation } from "@aws-smithy/server-common";
import { ProviderDto } from "@serverboi/backend-common/dist/dto/provider-dto";
import { GetProviderServerInput, GetProviderServerOutput, InternalServerError, ResourceNotFoundError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { providerToSummary } from "./common";

export const GetProviderOperation: Operation<GetProviderServerInput, GetProviderServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received GetProvider operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    
    let provider: ProviderDto;
    try {
      provider = await context.controller.provider.getProvider(input.name!, context.user);
    } catch {
      throw new ResourceNotFoundError({ message: `Provider not found` });
    }
    const summary = providerToSummary(provider)

    console.log(`Returning summary: ${JSON.stringify(summary)}`);
    return {
      summary: summary
    }
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      throw e;
    }
    throw new InternalServerError({ message: `Internal${e}`} );
  }
};