import { Operation } from "@aws-smithy/server-common";
import { ListServersServerInput, ListServersServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerController } from "@serverboi/services"

export const ListServersOperation: Operation<ListServersServerInput, ListServersServerOutput, ServiceContext> = async (input, context) => {
  console.log(`Received ListServers operation`);
  console.log(`Input: ${JSON.stringify(input)}`);
  console.log(`Context: ${JSON.stringify(context)}`);

  const controller = ServerController.getInstance();

  try {
    const server = await controller.listServers();
    const summaries = server.map((server) => {
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
      return summary;
    });
    console.log(`Returning summaries: ${JSON.stringify(summaries)}`);
    return {
      summaries: summaries
    }
  } catch (e) {
    console.log(e);
    throw new Error(`Unable to list servers`);
  }
};