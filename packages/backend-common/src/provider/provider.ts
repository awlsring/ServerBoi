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

export interface ProviderServerData {
  readonly serverId: string;
  readonly identifier: string;
  readonly location?: string;
}

export interface Provider {
  getServerStatus(serverData: ProviderServerData): Promise<Status>;
  startServer(serverData: ProviderServerData): Promise<void>;
  stopServer(serverData: ProviderServerData): Promise<void>;
  rebootServer(serverData: ProviderServerData): Promise<void>;
}