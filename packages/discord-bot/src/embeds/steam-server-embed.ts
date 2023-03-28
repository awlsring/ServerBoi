import { Capabilities } from "@serverboi/client";
import { APIEmbedField, EmbedType } from "discord-api-types/v10";
import { platform } from "os";
import { ServerEmbed } from "./server-embed";

export interface ServerPlatform {
  readonly name: string;
  readonly location: string;
}

export interface SteamServerEmbedOptions {
  readonly serverId: string;
  readonly serverName: string;
  readonly thumbnailUrl: string;
  readonly status: string;
  readonly address: string;
  readonly location: string;
  readonly game: string;
  readonly players: number;
  readonly maxPlayers: number;
  readonly ownerId: string;
  readonly capabilities: Capabilities[];
  readonly platform: ServerPlatform;
}

export class SteamServerEmbed extends ServerEmbed {
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
        value: options.location,
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
      type: EmbedType.Rich,
      title: `${options.serverName} (${options.serverId})`,
      description: `Connect: steam://connect/${options.address}`,
      color: SteamServerEmbed.determineColor(options.status),
      fields: fields,
      footer: {
        text: `Owner: ${options.ownerId} | 🌐 Hosted on ${options.platform.name} in ${options.platform.location} | 🕛 Updated: ${SteamServerEmbed.getUpdateTime()}`
      },
      thumbnail: {
        url: options.thumbnailUrl
      },
    });
  }
}