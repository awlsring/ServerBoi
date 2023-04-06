import { ProviderServerDataDto } from "../dto/server-dto";

export enum State {
  UNKNOWN = "UNKNOWN",
  RUNNING = "RUNNING",
  STARTING = "STARTING",
  STOPPED = "STOPPED",
  STOPPING = "STOPPING",
}

export interface Status {
  readonly state: State;
}

export interface Provider {
  getServerStatus(serverData: ProviderServerDataDto): Promise<Status>;
  startServer(serverData: ProviderServerDataDto): Promise<void>;
  stopServer(serverData: ProviderServerDataDto): Promise<void>;
  rebootServer(serverData: ProviderServerDataDto): Promise<void>;
}