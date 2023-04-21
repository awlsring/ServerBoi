export class Config {
  readonly logLevel: string;
  readonly monitor: {
    readonly interval: number;
  };
  readonly database: {
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;
  };
  constructor(data: any) {
    this.logLevel = data.logLevel;
    this.monitor = data.monitor;
    this.database = data.database;
  }
}