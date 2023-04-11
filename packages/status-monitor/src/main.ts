import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { setInterval } from 'timers/promises';
import { ServerController, ServerDto, ServerRepo } from '@serverboi/backend-common';
dotenv.config();

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

class StatusMonitor {
  readonly controller: ServerController;
  readonly serverRepo: ServerRepo;

  private async monitorServer(server: ServerDto) {
    console.log(`Updating status of server ${server.serverId}`)
    const status = await this.controller.getServerStatus(server);
    await this.serverRepo.updateStatus(server.scopeId, server.serverId, status);
  }

  async checkServers() {
    const servers = await this.serverRepo.findAll();
    console.log(`Checking status of ${servers.length} servers`)
    await Promise.all(servers.map(server => this.monitorServer(server)));
  }

  constructor(config: Config) {
    this.controller = new ServerController(config.database)
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