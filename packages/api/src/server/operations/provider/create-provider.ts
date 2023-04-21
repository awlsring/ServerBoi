import { Operation } from "@aws-smithy/server-common";
import { CreateProviderServerInput, CreateProviderServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { providerToSummary } from "./common";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "CreateProviderOperation" });

export const CreateProviderOperation: Operation<CreateProviderServerInput, CreateProviderServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received CreateProvider operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);

    const provider = await context.controller.provider.createProvider({
      name: input.name!,
      type: input.type!,
      subType: input.subType,
      owner: context.user,
      data: input.data,
      auth: {
        key: input.auth!.key!,
        secret: input.auth?.secret,
      },
    });

    const summary = providerToSummary(provider)

    return {
      summary: summary
    }
  } catch (e) {
    log.error(e);
    throw new InternalServerError({ message: `Error tracking server: ${e}`} );
  }
};