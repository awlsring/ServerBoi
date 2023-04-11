import { QueryServerStatus, ServerQueryType, ServerStatus } from "@serverboi/ssdk";
import { queryGameServerInfo } from "steam-server-query";
import { ServerDto, ServerStatusDto } from "../dto/server-dto";
import { Connectivity, Querent, QuerentBase } from "./common";

export interface SteamStatusData {
  readonly name: string;
  readonly map: string;
  readonly game: string;
  readonly gameId: number;
  readonly players: number;
  readonly maxPlayers: number;
  readonly visibility: number;
}

export class SteamQuerent extends QuerentBase {
  protected readonly type = ServerQueryType.STEAM;
  private readonly address: string;
  private readonly port: number;
  constructor(connectivity: Connectivity) {
    super(connectivity);

    this.address = this.connectivity.address;
    if (this.connectivity.address.includes(":")) {
      this.address = this.connectivity.address.split(":")[0];
    }
    this.port = this.connectivity.port;
  }

  async Query(): Promise<Partial<ServerStatusDto>> {
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

      return {
        query: QueryServerStatus.REACHABLE,
        data: steamData
      };
    } catch (e) {
      console.log(`Error querying ${this.address}:${this.port}`);
      console.log(e);
      return {
        query: QueryServerStatus.UNREACHABLE,
      };
    }
  }
}