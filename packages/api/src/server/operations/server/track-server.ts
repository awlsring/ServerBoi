import { Operation } from "@aws-smithy/server-common";
import { TrackServerServerInput, TrackServerServerOutput, ServerSummary, InternalServerError } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerController } from "@serverboi/services"
import { serverToSummary } from "./common";

export const TrackServerOperation: Operation<TrackServerServerInput, TrackServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    console.log(`Received TrackServer operation`);
    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Context: ${JSON.stringify(context)}`);

    const controller = ServerController.getInstance();

    const server = await controller.trackServer({
      scopeId: input.scope!,
      name: input.name!,
      address: input.address!,
      platform: input.platform ? {
        type: input.platform.type!,
        data: input.platform.data,
      } : undefined,
      query: {
        type: input.query!.type!,
        address: input.query?.address,
        port: input.query?.port,
      },
      application: input.application!,
      capabilities: input.capabilities!,
      owner: input.owner!,
    });

    const summary = serverToSummary(server)

    return {
      summary: summary
    }
  } catch (e) {
    console.log(e);
    throw new InternalServerError({ message: `Error tracking server: ${e}`} );
  }
};