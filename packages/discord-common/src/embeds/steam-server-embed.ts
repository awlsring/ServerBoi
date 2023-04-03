import { Capabilities, ServerStatus, ServerStatusSummary, ServerSummary, SteamStatusSummary } from "@serverboi/client";
import { APIEmbedField } from "discord-api-types/v10";
import { ServerEmbed, ServerLocation, ServerProvider } from "./server-embed";

export interface SteamServerEmbedOptions {
  readonly serverId: string;
  readonly serverName: string;
  readonly application: string;
  readonly status: string;
  readonly address: string;
  readonly port: number;
  readonly location: ServerLocation;
  readonly owner: string;
  readonly capabilities: Capabilities[];
  readonly provider?: ServerProvider;
  readonly players: number;
  readonly maxPlayers: number;
  readonly steamPort?: number;
}

export class SteamServerEmbed extends ServerEmbed {

  protected getThumbnailUrl(application: string): string {
    switch (application.toLocaleLowerCase()) {
      case "valheim":
        return "https://preview.redd.it/f6nbziz4ghh61.gif?width=858&auto=webp&s=27ca2c36dc194caaa1a789f4a2547f9e716c95bf";
      default:
        return "https://giphy.com/embed/ITRemFlr5tS39AzQUL";
    }
  }

  private static formSteamConnectString(address: string, port: number, steamPort?: number): string {
    if (steamPort) {
      return `Connect: steam://connect/${address}:${steamPort}`;
    }
    return `Connect: steam://connect/${address}:${port}`;
  }

  private static formGameField(application?: string): APIEmbedField {
    let game = "Unknown";
    if (application) {
      game = application;
    }
    return {
      name: "Game",
      value: game,
      inline: true
    }
  }

  private static formPlayersField(summary?: SteamStatusSummary): APIEmbedField {
    let players = 0;
    let maxPlayers = 0;

    if (summary) {
      if (summary.players) {
        players = summary.players;
      }
      if (summary.maxPlayers) {
        maxPlayers = summary.maxPlayers;
      }
    }

    return {
      name: "Players",
      value: `${players}/${maxPlayers}`,
      inline: true
    }
  }

  constructor(summary: ServerSummary) {
    const fields: APIEmbedField[] = [
      SteamServerEmbed.formStatusField(summary.status),
      SteamServerEmbed.formBlankField(),
      SteamServerEmbed.formAddressField(summary.connectivity),
      SteamServerEmbed.formLocationField(summary.location),
      SteamServerEmbed.formGameField(summary.application),
      SteamServerEmbed.formPlayersField(summary.status?.steam),
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
      description: SteamServerEmbed.formSteamConnectString(summary.connectivity?.address ?? "unknown", summary.connectivity?.port ?? 0, summary.query?.port),
      fields: fields,
    });
  }
}