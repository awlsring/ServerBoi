import { Capabilities } from "@serverboi/client";
import { EmbedType } from "discord-api-types/v10";
import { EmbedField } from "./embed";
import { ServerEmbed } from "./server-embed";

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
}

export class SteamServerEmbed extends ServerEmbed {
  constructor(options: SteamServerEmbedOptions) {
    const fields: EmbedField[] = [
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
        value: options.address,
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
        text: `Owner: ${options.ownerId} | Running on K8S in DWS | Last Update: ${new Date().toLocaleString()}`
      },
      thumbnail: {
        url: options.thumbnailUrl
      },
    });
  }
}