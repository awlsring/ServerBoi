import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { setInterval } from 'timers/promises';
import { logger, ServerController, ServerDto, ServerRepo } from '@serverboi/backend-common';
dotenv.config();

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

class StatusMonitor {
  private logger = logger.child({ name: "StatusMonitor" });

  readonly controller: ServerController;
  readonly serverRepo: ServerRepo;

  private async monitorServer(server: ServerDto) {
    this.logger.debug(`Updating status of server ${server.serverId}`)
    const status = await this.controller.getServerStatus(server);
    await this.serverRepo.updateStatus(server.scopeId, server.serverId, status);
  }

  async checkServers() {
    const servers = await this.serverRepo.findAll();
    this.logger.info(`Checking status of ${servers.length} servers`)
    await Promise.all(servers.map(server => this.monitorServer(server)));
  }

  constructor(config: Config) {
    this.controller = new ServerController(config.database)
    this.serverRepo = new ServerRepo(config.database);
  }
}

async function start() {
  const log = logger.child({ name: "main" });
  log.info('Initializing status monitor');
  const config = loadConfig();
  const monitor = new StatusMonitor(config);

  log.info('Starting status monitor');
  await monitor.checkServers();

  log.info(`Starting interval, waiting ${config.monitor.interval}ms between checks`);
  for await (const _ of setInterval(config.monitor.interval)) {
    log.info("Starting next run")
    await monitor.checkServers();
  }
}

start();