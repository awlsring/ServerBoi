import { Operation } from "@aws-smithy/server-common";
import { TrackServerServerInput, TrackServerServerOutput, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { serverToSummary } from "./common";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "TrackServerOperation" });

export const TrackServerOperation: Operation<TrackServerServerInput, TrackServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received TrackServer operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);

    const server = await context.controller.server.trackServer({
      scopeId: input.scope!,
      name: input.name!,
      address: input.connectivity!.address!,
      port: input.connectivity!.port!,
      providerName: input.provider,
      providerServerData: input.providerServerData ? {
        identifier: input.providerServerData.identifier!,
        location: input.providerServerData.location,
        data: input.providerServerData.data,
      } : undefined,
      query: {
        type: input.query!.type!,
        address: input.query?.address,
        port: input.query?.port,
      },
      application: input.application!,
      capabilities: input.capabilities!,
      owner: context.user,
    });

    const summary = serverToSummary(server)

    return {
      summary: summary
    }
  } catch (e) {
    log.error(e);
    throw new InternalServerError({ message: `Error tracking server: ${e}`} );
  }
};