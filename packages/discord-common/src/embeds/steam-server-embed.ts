import { Capabilities } from "@serverboi/client";
import { APIEmbedField, EmbedType } from "discord-api-types/v10";
import { ServerEmbed } from "./server-embed";

export interface ServerPlatform {
  readonly name: string;
  readonly location: string;
}

export interface ServerLocation {
  readonly city: string;
  readonly country: string;
  readonly region: string;
  readonly emoji: string;
}

export interface SteamServerEmbedOptions {
  readonly serverId: string;
  readonly serverName: string;
  readonly status: string;
  readonly address: string;
  readonly steamPort: number;
  readonly location: ServerLocation;
  readonly game: string;
  readonly players: number;
  readonly maxPlayers: number;
  readonly owner: string;
  readonly capabilities: Capabilities[];
  readonly platform: ServerPlatform;
}

export class SteamServerEmbed extends ServerEmbed {

  private static getThumbnailUrl(application: string): string {
    switch (application.toLocaleLowerCase()) {
      case "valheim":
        return "https://preview.redd.it/f6nbziz4ghh61.gif?width=858&auto=webp&s=27ca2c36dc194caaa1a789f4a2547f9e716c95bf";
      default:
        return "https://giphy.com/embed/ITRemFlr5tS39AzQUL";
    }
  }

  private static formLocationString(location: ServerLocation): string {
    if (location.country.toLocaleLowerCase() === "us") {
      return `${location.emoji} ${location.city}, ${location.region}`;
    }
    return `${location.emoji} ${location.city}, ${location.country}`;
  }

  private static formSteamConnectString(address: string, port: number): string {
    let steamAddress = address;
    if (address.includes(":")) {
      steamAddress = address.split(":")[0];
    }
    return `Connect: steam://connect/${steamAddress}:${port}`;
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
        value: options.game,
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
      type: EmbedType.Rich,
      title: `${options.serverName} (${options.serverId})`,
      description: SteamServerEmbed.formSteamConnectString(options.address, options.steamPort),
      color: SteamServerEmbed.determineColor(options.status),
      fields: fields,
      thumbnail: {
        url: SteamServerEmbed.getThumbnailUrl(options.game)
      },
      footer: {
        text: `🌐 Hosted on ${options.platform.name} in ${options.platform.location} | 🕛 Updated: ${SteamServerEmbed.getUpdateTime()}`
      },
    });
  }
}