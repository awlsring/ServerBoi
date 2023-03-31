export class Config {
  readonly refresher: {
    readonly interval: number;
  };
  readonly discord: {
    readonly token: string;
  };
  readonly database: {
    readonly connectionString: string;
  };
  readonly serverboi: {
    readonly endpoint: string;
    readonly apiKey: string;
  };
  constructor(data: any) {
    this.refresher = data.refresher;
    this.discord = data.discord;
    this.database = data.database;
    this.serverboi = data.serverboi;
  }
}