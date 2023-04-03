import { Capabilities, ServerStatus, ServerSummary } from "@serverboi/client";
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

  constructor(summary: ServerSummary) {
    const fields: APIEmbedField[] = [
      HTTPServerEmbed.formStatusField(summary.status),
      HTTPServerEmbed.formBlankField(),
      HTTPServerEmbed.formAddressField(summary.connectivity),
      HTTPServerEmbed.formLocationField(summary.location),
      HTTPServerEmbed.formBlankField(),
      HTTPServerEmbed.formApplicationField(summary.application),
    ]
    super({
      owner: summary.owner ?? "Unknown",
      serverId: summary.id ?? "Unknown-Unknown",
      serverName: summary.name ?? "Unknown",
      status: summary.status?.status ?? ServerStatus.UNREACHABLE,
      application: summary.application ?? "Unknown",
      capabilities: summary.capabilities ?? [Capabilities.READ],
      provider: summary.provider ? {
        name: summary.provider.name ?? "Unknown",
        location: summary.providerServerData?.location ?? "Unknown",
      } : undefined,
      description: `Connect: ${HTTPServerEmbed.fromAddressString(summary.connectivity)}`,
      fields: fields,
    });
  }
}