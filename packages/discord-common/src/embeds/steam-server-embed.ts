import { Capabilities } from "@serverboi/client";
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

  constructor(options: SteamServerEmbedOptions) {
    const fields: APIEmbedField[] = [
      {
        name: "Status",
        value: SteamServerEmbed.formStatusString(options.status),
        inline: true
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true
      },
      {
        name: "Address",
        value: `\`${options.address}\``,
        inline: true
      },
      {
        name: "Location",
        value: SteamServerEmbed.formLocationString(options.location),
        inline: true
      },
      {
        name: "Game",
        value: options.application,
        inline: true
      },
      {
        name: "Players",
        value: `${options.players}/${options.maxPlayers}`,
        inline: true
      }
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
      description: SteamServerEmbed.formSteamConnectString(options.address, options.port, options.steamPort),
      fields: fields,
    });
  }
}