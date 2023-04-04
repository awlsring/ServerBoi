import { ServerQueryType } from "@serverboi/ssdk";
import { ServerDto, ServerStatusDto } from "../dto/server-dto";

export interface Connectivity {
  readonly address: string;
  readonly port: number;
}

export async function determineConnectivity(server: ServerDto): Promise<Connectivity> {
  let queryAddress = server.address;
  if (server.query.address) {
    if (server.query.address != "") {
      queryAddress = server.query.address;
    }
  }

  let queryPort = server.port;
  if (server.query.port) {
    if (server.query.port != 0) {
      queryPort = server.query.port;
    }
  }

  return {
    address: queryAddress,
    port: queryPort,
  }
}

export interface QueryData {}

export interface Querent {
  Query(): Promise<ServerStatusDto>;
}

export abstract class QuerentBase implements Querent {
  protected abstract readonly type: ServerQueryType;

  constructor(protected readonly connectivity: Connectivity) {}

  abstract Query(): Promise<ServerStatusDto>;
}