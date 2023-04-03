import { GetServerCommand, ListServersCommand, ServerBoiClient, ServerSummary, TrackServerCommand, TrackServerInput } from "@serverboi/client";
import { LRUCache } from "../cache/lru-cache";

export class ServerBoiService {
  private apiKeyBase: string;
  private endpoint: string;
  private clientCache: LRUCache<ServerBoiClient>;
  constructor(endpoint: string, apiKey: string) {
    this.apiKeyBase = `Bot ${apiKey}`;
    this.endpoint = endpoint;
    this.clientCache = new LRUCache<ServerBoiClient>(1000);

    setInterval(() => {
      console.log(`ServerBoiService: clearing expired clients from cache`);
      for (const node of this.clientCache.getCache().values()) {
        if (Date.now() - node.created > this.clientCache.maxAge) {
          console.log("ServerBoiService: clearing expired client from cache", node.key)
          this.clientCache.getCache().delete(node.key);
          this.clientCache.clear(node.key);
        }
      }
    }, 60 * 1000 /* 1 minute */);
  }

  async getClientForUser(userId: string): Promise<ServerBoiClient> {
    let client = this.clientCache.get(userId);
    if (!client) {
      console.log("ServerBoiService: creating new client for user", userId)
      client = new ServerBoiClient({ endpoint: this.endpoint, apiKey: `${this.apiKeyBase} User ${userId}`});
      this.clientCache.set(userId, client);
    }
    return client;
  }

  async getServer(user: string, id: string): Promise<ServerSummary> {
    const client = await this.getClientForUser(user);
    const server = await client.send(new GetServerCommand({id}));
    if (server.summary) {
      return server.summary;
    }
    throw Error("ServerBoiService.getServer: server not found");
  }

  async listServers(user: string): Promise<ServerSummary[]> {
    const client = await this.getClientForUser(user);
    const servers = await client.send(new ListServersCommand({}));
    return servers.summaries ?? [];
  } 

  async trackServer(user: string, input: TrackServerInput): Promise<ServerSummary> {
    const client = await this.getClientForUser(user);
    const server = await client.send(new TrackServerCommand(input));
    if (server.summary) {
      return server.summary;
    }
    throw Error("ServerBoiService.trackServer: server summary not found");
  }
}