import { SteamStatus } from "./steam-query";

export interface Status {
  readonly status: string;
  readonly data?: QueryData;
  readonly steam?: SteamStatus;
}

export interface QueryData {}

export interface Querent {
  Query(): Promise<Status>;
}