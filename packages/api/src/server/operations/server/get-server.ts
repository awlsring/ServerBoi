import { Operation } from "@aws-smithy/server-common";
import { GetServerServerInput, GetServerServerOutput, ServerSummary } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { ServerService } from "@serverboi/services"

export const GetServerOperation: Operation<GetServerServerInput, GetServerServerOutput, ServiceContext> = async (input, context) => {
  console.log(`Received GetServer operation`);
  console.log(`Input: ${JSON.stringify(input)}`);
  console.log(`Context: ${JSON.stringify(context)}`);

  const serverService = ServerService.getInstance();
  try {
    const server = await serverService.getServer(input.id!);
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