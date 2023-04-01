export class Config {
  readonly refresher: {
    readonly interval: number;
  };
  readonly discord: {
    readonly token: string;
  };
  readonly database: {
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;
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