import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { logger } from "@serverboi/common";
import { Provider } from "./provider";
import { HetznerHttpClient } from "../http/hetzner/client";
import { ServerStatus } from "../http/hetzner/server";

export class HetznerProvider implements Provider {
  private logger = logger.child({ name: "HetznerProvider" });
  private readonly client: HetznerHttpClient

  constructor(auth: ProviderAuthDto) {
    this.client = new HetznerHttpClient({
      token: auth.key,
      version: "v1",
    });
  }

  async getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus> {
    this.logger.debug(`Getting server status for server ${serverData.identifier}`);

    const response = await this.client.getServer(serverData.identifier);

    this.logger.debug(`Got server status ${response.server.status} for server ${serverData.identifier}`);

    switch (response.server.status) {
      case ServerStatus.RUNNING:
        return ProviderServerStatus.RUNNING;
      case ServerStatus.STARTING:
      case ServerStatus.INITIALIZING:
        return ProviderServerStatus.STARTING;
      case ServerStatus.STOPPING:
      case ServerStatus.DELETING:
        return ProviderServerStatus.STOPPING;
      default:
        return ProviderServerStatus.STOPPED;
    }
  }

  async startServer(serverData: ProviderServerDataDto): Promise<void> {
    this.logger.debug(`Starting server ${serverData.identifier}`);
    await this.client.startServer(serverData.identifier);
    this.logger.debug(`Started server ${serverData.identifier}`);
  }

  async stopServer(serverData: ProviderServerDataDto): Promise<void> {
    this.logger.debug(`Stopping server ${serverData.identifier}`);
    await this.client.stopServer(serverData.identifier, true);
    this.logger.debug(`Stopped server ${serverData.identifier}`);
  }

  async rebootServer(serverData: ProviderServerDataDto): Promise<void> {
    this.logger.debug(`Rebooting server ${serverData.identifier}`);
    await this.client.rebootServer(serverData.identifier, true);
    this.logger.debug(`Rebooted server ${serverData.identifier}`);
  }

}