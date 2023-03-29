import { queryGameServerInfo } from "steam-server-query";
import { Querent, QueryData, Status } from "./common";

export interface SteamStatus {
  name: string;
  map: string;
  game: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  visibility: number;
}

export class SteamQuerent implements Querent {
  private readonly address: string;
  private readonly port: number;
  constructor(address: string, port: number) {
    this.address = address;
    if (address.includes(":")) {
      this.address = address.split(":")[0];
    }
    this.port = port;
  }

  private tmp(d: any) {
      return JSON.parse(JSON.stringify(d, (key, value) =>
          typeof value === 'bigint'
              ? value.toString()
              : value // return everything else unchanged
      ));
  }

  async Query(): Promise<Status> {
    const queryAddress = `${this.address}:${this.port}`;
    try {
      const query = await queryGameServerInfo(queryAddress);
      console.log(`Query: ${JSON.stringify(this.tmp(query))}`);
      const status: Status = {
        status: "RUNNING",
        steam: {
          name: query.name,
          map: query.map,
          gameId: Number(query.gameId),
          game: query.game,
          players: query.players,
          maxPlayers: query.maxPlayers,
          visibility: query.visibility,
        },
      };
      console.log(`Status: ${JSON.stringify(status)}`);
      return status;

    } catch (e) {
      console.log(`Error querying ${this.address}:${this.port}`);
      console.log(e);
      return {
        status: "UNREACHABLE",
      };
    }
  }
}