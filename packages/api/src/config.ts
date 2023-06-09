import fs from 'fs';
import yaml from 'js-yaml';

export function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? '/config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

export class Config {
  readonly logLevel?: string;
  readonly server: {
    readonly port?: number;
  };
  readonly metrics?: {
    readonly port?: number;
  }
  readonly database: {
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;
  };
  constructor(data: any) {
    this.logLevel = data.logLevel;
    this.metrics = data.metrics;
    this.server = data.server;
    this.database = data.database;
  }
}