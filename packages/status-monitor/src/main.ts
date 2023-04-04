import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { setInterval } from 'timers/promises';
import { ServerQueryType, ServerStatus } from '@serverboi/ssdk';
import { HttpQuerent, ServerDto, ServerRepo, ServerStatusDto, SteamQuerent } from '@serverboi/backend-common';
dotenv.config();

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

export interface Connectivity {
  readonly address: string;
  readonly port: number;
}

class StatusMonitor {
  readonly serverRepo: ServerRepo;

  async monitorServer(server: ServerDto) {
    console.log(`Updating status of server ${server.serverId}`)
    const status = await this.getStatus(server);
    await this.serverRepo.updateStatus(server.scopeId, server.serverId, status);
  }

  async getStatus(server: ServerDto): Promise<ServerStatusDto> {
    const connectivity = await this.determineConnectivity(server);
    switch (server.query.type) {
      case ServerQueryType.STEAM:
        return await new SteamQuerent(connectivity.address, connectivity.port).Query();
      case ServerQueryType.HTTP:
        return await new HttpQuerent(connectivity.address, connectivity.port).Query();
      default:
        return {
          type: ServerQueryType.NONE,
          status: ServerStatus.UNREACHABLE,
        }
    }
  }

  async determineConnectivity(server: ServerDto): Promise<Connectivity> {
    let queryAddress = server.address;
    if (server.query.address) {
      if (server.query.address != "") {
        queryAddress = server.query.address;
      }
    }

    let queryPort = server.port;
    if (server.query.port) {
      if (server.query.port != 0) {
        queryPort = server.query.port;
      }
    }

    return {
      address: queryAddress,
      port: queryPort,
    }
  }

  async checkServers() {
    const servers = await this.serverRepo.findAll();
    console.log(`Checking status of ${servers.length} servers`)
    await Promise.all(servers.map(server => this.monitorServer(server)));
  }

  constructor(config: Config) {
    this.serverRepo = new ServerRepo(config.database);
  }
}

async function start() {
  console.log('Initializing status monitor');
  const config = loadConfig();
  const monitor = new StatusMonitor(config);

  console.log('Starting status monitor');
  await monitor.checkServers();

  console.log(`Starting interval, waiting ${config.monitor.interval}ms between checks`);
  for await (const _ of setInterval(config.monitor.interval)) {
    console.log("Starting next run")
    await monitor.checkServers();
  }
}

start();