import { ServerQueryType, ServerStatus, ServerSummary } from "@serverboi/client";
import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { HTTPServerEmbed } from "./http-server-embed";
import { ServerEmbedMoreActions } from "./server-embed";
import { SteamServerEmbed } from "./steam-server-embed";

export interface IServerEmbed {
  toMessage(startEnabled: boolean, stopEnabled: boolean, actions?: ServerEmbedMoreActions[] | undefined): RESTPostAPIChannelMessageJSONBody
}

export function serverToEmbed(server: ServerSummary): IServerEmbed {
  switch (server.query?.type) {
    case ServerQueryType.STEAM:
      return new SteamServerEmbed(server);
    case ServerQueryType.HTTP:
      return new HTTPServerEmbed(server);
    default:
      throw new Error(`Unsupported server type: ${server.query?.type}`);
  }
}