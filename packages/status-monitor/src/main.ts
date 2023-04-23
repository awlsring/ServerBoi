import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { setInterval } from 'timers/promises';
import { ServerController, ServerDto, ServerRepo } from '@serverboi/backend-common';
import { logger } from '@serverboi/common';
import { StatusMonitorPrometheusMetrics } from './metrics/prometheus-metrics-controller';
import { MetricsController } from './metrics/metrics-controller';
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
    const started = Date.now();
    this.logger.debug(`Updating status of server ${server.serverId}`)
    const status = await this.controller.getServerStatus(server);
    await this.serverRepo.updateStatus(server.scopeId, server.serverId, status);
    const completion = Date.now() - started;
    this.metrics.observeSingleRun(
      server.provider?.type ?? "NONE",
      server.query.type ?? "NONE",
      server.application,
      status.provider ?? "NONE",
      status.query ?? "NONE",
      status.status ?? "NONE",
      completion
    );
  }

  async checkServers() {
    const started = Date.now();
    this.logger.info("Starting next run")

    const servers = await this.serverRepo.findAll();

    this.logger.info(`Checking status of ${servers.length} servers`)
    await Promise.all(servers.map(server => this.monitorServer(server)));

    const completion = Date.now() - started;
    this.metrics.observeBatchRun(servers.length, completion)
  }

  constructor(config: Config, private readonly metrics: MetricsController) {
    this.controller = new ServerController(config.database)
    this.serverRepo = new ServerRepo(config.database);
  }
}

async function start() {
  const log = logger.child({ name: "main" });
  log.info('Initializing status monitor');
  const config = loadConfig();
  log.level = config.logLevel ?? 'info';
  log.debug(`Log level set to ${config.logLevel}`);

  const metrics = new StatusMonitorPrometheusMetrics({
    app: "serverboi-status-monitor",
    prefix: "status-monitor",
    server: {
      port: config.metrics?.port ?? 9090,
    }
  })

  const monitor = new StatusMonitor(config, metrics);

  log.info('Starting status monitor');
  await monitor.checkServers();

  log.info(`Starting interval, waiting ${config.monitor.interval}ms between checks`);
  for await (const _ of setInterval(config.monitor.interval)) {
    await monitor.checkServers();
  }
}

start();