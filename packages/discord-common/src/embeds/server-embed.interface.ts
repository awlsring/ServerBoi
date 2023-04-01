import { ServerQueryType, ServerSummary } from "@serverboi/client";
import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { ServerEmbedMoreActions } from "./server-embed";
import { SteamServerEmbed } from "./steam-server-embed";

export interface IServerEmbed {
  toMessage(startEnabled: boolean, stopEnabled: boolean, actions?: ServerEmbedMoreActions[] | undefined): RESTPostAPIChannelMessageJSONBody
}

export function serverToEmbed(server: ServerSummary): IServerEmbed {
  if (server.query?.type === ServerQueryType.STEAM) {
    return new SteamServerEmbed({
      serverId: server.id?.split("-")[1]!,
      serverName: server.name!,
      status: server.status?.status!,
      address: server.address!,
      steamPort: server.query?.port!,
      location: {
        city: server.location?.city!,
        country: server.location?.country!,
        region: server.location?.region!,
        emoji: server.location?.emoji!,
      },
      game: server.application!,
      players: server.status?.steam?.players!,
      maxPlayers: server.status?.steam?.maxPlayers!,
      owner: server.owner!,
      capabilities: [],
      platform: {
        name: "K8S",
        location: "DWS",
      }
    });
  }
  throw new Error(`Unsupported server type: ${server.query?.type}`);
}