import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { logger } from "@serverboi/common";
import { CreateServerInput, Provider } from "./provider";
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

  async createServer(request: CreateServerInput): Promise<ProviderServerDataDto> {
    this.logger.debug(`Creating server with name ${request.name}`);

    let architecture: "x86" | "arm"
    switch (request.architecture) {
      case "x86_64":
        architecture = "x86";
        break;
      case "arm64":
        architecture = "arm";
        break;
      default:
        throw new Error(`Unknown architecture ${request.architecture}`);
    }

    const images = await this.client.listImages({
      architecture: architecture,
      type: "system",
    })
  
    const ubuntu22 = images.images.find((image) => image.os_flavor === "ubuntu" && image.os_version === "22.04")

    if (!ubuntu22) {
      throw new Error("Could not find ubuntu 22.04 image");
    }

    const response = await this.client.createServer({
      name: request.name,
      server_type: request.serverType,
      image: ubuntu22?.id.toString(),
      location: request.location,
      labels: request.tags,
      start_after_create: true,
      user_data: request.cloudInit,
      public_net: { enable_ipv4: true, enable_ipv6: true }
    });
    this.logger.debug(`Created server with name ${request.name}`);

    this.logger.debug(`Applying firewall to server ${response.server.id}`);
    await this.client.createFirewall({
      name: `serverboi-${request.id}`,
      apply_to: [{
        server: { id: response.server.id },
        type: "server",
      }],
      rules: request.allowedPorts.map((port) => ({
        direction: "in",
        protocol: port.protcol,
        port: port.port.toString(),
        source_ips: ["0.0.0.0/0", "::/0"]
      })),
    });

    return {
      identifier: response.server.id.toString(),
      location: request.location,
    };
  }

  async deleteServer(serverData: ProviderServerDataDto): Promise<void> {
    this.logger.debug(`Deleting server ${serverData.identifier}`);
    await this.client.deleteServer(serverData.identifier);
    this.logger.debug(`Deleted server ${serverData.identifier}`);
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