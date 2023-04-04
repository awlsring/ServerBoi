export class Config {
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
    this.monitor = data.monitor;
    this.database = data.database;
  }
}