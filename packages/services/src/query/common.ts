import { ServerStatusDto } from "../dto/server-dto";

export interface QueryData {}

export interface Querent {
  Query(): Promise<ServerStatusDto>;
}