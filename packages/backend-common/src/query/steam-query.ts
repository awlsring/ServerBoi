import { queryGameServerInfo } from "steam-server-query";
import { ServerStatusDto } from "../dto/server-dto";
import { Querent } from "./common";

export interface SteamStatusData {
  name: string;
  map: string;
  game: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  visibility: number;
}

export class SteamQuerent implements Querent {
  private readonly type = "STEAM";
  private readonly address: string;
  private readonly port: number;
  constructor(address: string, port: number) {
    this.address = address;
    if (address.includes(":")) {
      this.address = address.split(":")[0];
    }
    this.port = port;
  }

  async Query(): Promise<ServerStatusDto> {
    const queryAddress = `${this.address}:${this.port}`;
    try {
      const query = await queryGameServerInfo(queryAddress);
      const steamData: SteamStatusData = {
        name: query.name,
        map: query.map,
        gameId: Number(query.gameId),
        game: query.game,
        players: query.players,
        maxPlayers: query.maxPlayers,
        visibility: query.visibility,
      }

      const status: ServerStatusDto = {
        type: this.type,
        status: "RUNNING",
        data: JSON.stringify(steamData),
      };

      return status;

    } catch (e) {
      console.log(`Error querying ${this.address}:${this.port}`);
      console.log(e);
      return {
        type: this.type,
        status: "UNREACHABLE",
      };
    }
  }
}