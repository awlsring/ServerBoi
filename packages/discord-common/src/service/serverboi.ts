import { GetServerCommand, ListServersCommand, ServerBoiClient, ServerSummary, TrackServerCommand, TrackServerInput } from "@serverboi/client";

export class ServerBoiService {
  private client: ServerBoiClient;

  constructor(endpoint: string, apiKey: string) {
    this.client = new ServerBoiClient({endpoint, apiKey});
  }

  async getServer(id: string): Promise<ServerSummary> {
    const server = await this.client.send(new GetServerCommand({id}));
    if (server.summary) {
      return server.summary;
    }
    throw Error("ServerBoiService.getServer: server not found");
  }

  async listServers(): Promise<ServerSummary[]> {
    const servers = await this.client.send(new ListServersCommand({}));
    return servers.summaries ?? [];
  } 

  async trackServer(input: TrackServerInput): Promise<ServerSummary> {
    const server = await this.client.send(new TrackServerCommand(input));
    if (server.summary) {
      return server.summary;
    }
    throw Error("ServerBoiService.trackServer: server summary not found");
  }
}