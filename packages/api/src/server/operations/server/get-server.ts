import { Operation } from "@aws-smithy/server-common";
import { GetServerServerInput, GetServerServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerController, SteamStatus } from "@serverboi/services"

export const GetServerOperation: Operation<GetServerServerInput, GetServerServerOutput, ServiceContext> = async (input, context) => {
  console.log(`Received GetServer operation`);
  console.log(`Input: ${JSON.stringify(input)}`);
  console.log(`Context: ${JSON.stringify(context)}`);

  const controller = ServerController.getInstance();
  try {
    const server = await controller.getServer(input.id!);

    const summary: ServerSummary = {
      id: server.id,
      name: server.name,
      address: server.address,
      status: {
        status: server.status.status,
        steam: server.status.steam,
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
      location: {
        country: server.location.country,
        region: server.location.region,
        city: server.location.city,
        emoji: server.location.emoji,
      },
      application: server.application,
      capabilities: server.capabilities,
      added: server.added.getTime(),
      lastUpdated: server.lastUpdated?.getTime(),
      owner: server.owner,
    };
    console.log(`Returning summary: ${JSON.stringify(summary)}`);
    return {
      summary: summary
    }
  } catch (e) {
    console.log(e);
    throw new Error(`Server not found`);
  }

};