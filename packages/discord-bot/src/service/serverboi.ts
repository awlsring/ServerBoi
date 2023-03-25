import { GetServerCommand, ListServersCommand, ServerBoiClient, ServerSummary, TrackServerCommand, TrackServerInput } from "@serverboi/client";

export class ServerBoiService {
  private static instance: ServerBoiService;
  private client: ServerBoiClient;

  private constructor(endpoint: string, apiKey: string) {
    this.client = new ServerBoiClient({endpoint, apiKey});
  }

  public static getInstance(endpoint?: string, apiKey?: string): ServerBoiService {
    if (!ServerBoiService.instance) {
      if (!endpoint || !apiKey) {
        throw Error("ServerBoiService requires endpoint and apiKey for new creation");
      }
      ServerBoiService.instance = new ServerBoiService(endpoint, apiKey);
    }
    return ServerBoiService.instance;
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