import { queryGameServerInfo } from "steam-server-query";
import { Querent, Status } from "./common";

export interface SteamStatus extends Status {
  name: string;
  map: string;
  game: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  visibility: number;
}

export class SteamQuerent implements Querent {
  constructor(private readonly address: string, private readonly port: number) {}

  async Query(): Promise<Status> {
    try {
      const query = await queryGameServerInfo(this.address, this.port);
      const status: SteamStatus = {
        status: "RUNNING",
        name: query.name,
        map: query.map,
        gameId: query.appId,
        game: query.game,
        players: query.players,
        maxPlayers: query.maxPlayers,
        visibility: query.visibility,
      };
      return status;
    } catch (e) {
      return {
        status: "UNREACHABLE",
      };
    }
  }
}