import { CreateProviderCommand, CreateProviderInput, DeleteProviderCommand, GetProviderCommand, GetServerCommand, ListProvidersCommand, ListServersCommand, ProviderSummary, ServerBoiClient, ServerSummary, TrackServerCommand, TrackServerInput, UntrackServerCommand } from "@serverboi/client";
import { LRUCache } from "../cache/lru-cache";

export class ServerBoiService {
  private clientCache: LRUCache<ServerBoiClient>;
  constructor(private readonly endpoint: string, private readonly apiKey: string) {
    this.clientCache = new LRUCache<ServerBoiClient>(1000);

    setInterval(() => {
      for (const node of this.clientCache.getCache().values()) {
        if (Date.now() - node.created > this.clientCache.maxAge) {
          console.log("ServerBoiService: clearing expired client from cache", node.key)
          this.clientCache.getCache().delete(node.key);
          this.clientCache.clear(node.key);
        }
      }
    }, 60 * 1000 /* 1 minute */);
  }

  private async getClientForUser(userId: string): Promise<ServerBoiClient> {
    let client = this.clientCache.get(userId);
    if (!client) {
      console.log("ServerBoiService: creating new client for user", userId)
      client = new ServerBoiClient({ endpoint: this.endpoint, apiKey: this.apiKey});
      client.middlewareStack.add(
        (next, _) => async (args) => {
          const request = args.request as any
          request.headers!["x-serverboi-user"] = userId;
          const result = await next(args);
          return result;
        },
        {
          step: "build",
          name: "addUserHeader",
          tags: ["BOT", "USER"],
        }
      );
      this.clientCache.set(userId, client);
    }
    return client;
  }

  async getProvider(user: string, name: string): Promise<ProviderSummary> {
    const client = await this.getClientForUser(user);
    const provider = await client.send(new GetProviderCommand({name}));
    if (provider.summary) {
      return provider.summary;
    }
    throw Error("ServerBoiService.getProvider: provider not found");
  }

  async listProviders(user: string): Promise<ProviderSummary[]> {
    const client = await this.getClientForUser(user);
    const providers = await client.send(new ListProvidersCommand({}));
    return providers.summaries ?? [];
  }

  async createProvider(user: string, input: CreateProviderInput): Promise<ProviderSummary> {
    const client = await this.getClientForUser(user);
    const provider = await client.send(new CreateProviderCommand(input));
    if (provider.summary) {
      return provider.summary;
    }
    throw Error("ServerBoiService.createProvider: error making provider");
  }

  async deleteProvider(user: string, name: string): Promise<boolean> {
    const client = await this.getClientForUser(user);
    const response = await client.send(new DeleteProviderCommand({name}));
    return response.success ?? false;
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

  async untrackServer(user: string, id: string): Promise<boolean> {
    const client = await this.getClientForUser(user);
    const response = await client.send(new UntrackServerCommand({id}));
    return response.success ?? false;
  }
}