import { Capabilities } from "@serverboi/client";
import { APIEmbedField } from "discord-api-types/v10";
import { ServerEmbed, ServerLocation, ServerProvider } from "./server-embed";

export interface HTTPServerEmbedOptions {
  readonly serverId: string;
  readonly serverName: string;
  readonly application: string;
  readonly status: string;
  readonly address: string;
  readonly port?: number;
  readonly location: ServerLocation;
  readonly owner: string;
  readonly capabilities: Capabilities[];
  readonly provider?: ServerProvider;
}

export class HTTPServerEmbed extends ServerEmbed {
  protected getThumbnailUrl(application: string): string {
    switch (application.toLocaleLowerCase()) {
      case "jellyfin":
        return "https://pcbwayfile.s3-us-west-2.amazonaws.com/project/21/04/26/1557005893806.png";
      default:
        return "https://giphy.com/embed/ITRemFlr5tS39AzQUL";
    }
  }

  constructor(options: HTTPServerEmbedOptions) {
    const fields: APIEmbedField[] = [
      {
        name: "Status",
        value: HTTPServerEmbed.formStatusString(options.status),
        inline: true
      },
      {
        name: "Address",
        value: `\`${options.address}\``,
        inline: true
      },
      {
        name: "Location",
        value: HTTPServerEmbed.formLocationString(options.location),
        inline: true
      },
    ]
    super({
      owner: options.owner,
      serverId: options.serverId,
      serverName: options.serverName,
      application: options.application,
      status: options.status,
      address: options.address,
      port: options.port,
      location: options.location,
      capabilities: options.capabilities,
      provider: options.provider,
      description: `Connect: ${options.address}`,
      fields: fields,
    });
  }
}