export class Config {
  readonly server: {
    readonly port?: number;
  };
  readonly discord: {
    readonly token: string;
    readonly publicKey: string;
    readonly applicationId: string;
    readonly apiVersion?: string;
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
    this.server = data.server;
    this.discord = data.discord;
    this.database = data.database;
    this.serverboi = data.serverboi;
  }
}