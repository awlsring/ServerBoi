import { Operation } from "@aws-smithy/server-common";
import { TrackServerServerInput, TrackServerServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerService } from "@serverboi/services"

export const TrackServerOperation: Operation<TrackServerServerInput, TrackServerServerOutput, ServiceContext> = async (input, context) => {
  console.log(`Received TrackServer operation`);
  console.log(`Input: ${JSON.stringify(input)}`);
  console.log(`Context: ${JSON.stringify(context)}`);

  const serverService = ServerService.getInstance();
  try {
    const server = await serverService.trackServer({
      name: input.name!,
      address: input.address!,
      platform: {
        type: input.platform!.type!,
        data: input.platform?.data,
      },
      query: {
        type: input.query!.type!,
        address: input.query?.address,
        port: input.query?.port,
      },
      application: input.application!,
      capabilities: input.capabilities!,
      owner: input.owner!,
    });

    const summary: ServerSummary = {
      id: server.id,
      name: server.name,
      address: server.address,
      status: {
        status: server.status.status,
      },
      platform: {
        type: server.platform.type,
        data: server.platform.data,
      },
      query: {
        type: server.query.type,
        address: server.query.address,
        port: server.query.port,
      },
      application: server.application,
      capabilities: server.capabilities,
      added: server.added.getMilliseconds(),
      lastUpdated: server.lastUpdated?.getMilliseconds(),
      owner: server.owner,
    };
    return {
      summary: summary
    }
  } catch (e) {
    console.log(e);
    throw new Error(`Unable to make server`);
  }

};