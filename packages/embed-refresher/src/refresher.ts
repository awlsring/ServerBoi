import { setInterval } from 'timers/promises';
import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { ServerBoiService, ServerCardRepo, ServerCardDto, DiscordHttpClient, formServerEmbedMessage, ServerCardService } from '@serverboi/discord-common';
import { ResourceNotFoundError } from '@serverboi/client';
import { logger } from '@serverboi/common';
dotenv.config();

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

class Refresher {
  private logger = logger.child({ name: 'Refresher' })
  readonly serverBoi: ServerBoiService;
  readonly serverCard: ServerCardService;

  async refreshEmbed(card: ServerCardDto) {
    try {
      const server = await this.serverBoi.getServer("refreshed", card.serverId);
      await this.serverCard.refreshCard(card, server)
    } catch (e) {
      this.logger.error(e)
      if (e instanceof ResourceNotFoundError) {
        this.logger.info(`Deleting card for server ${card.serverId} as it no longer exists`)
        await this.serverCard.deleteCard({ serverId: card.serverId });
        return
      }
    }
  }

  async refreshCards() {
    const cards = await this.serverCard.listCards();
    this.logger.debug(`Refreshing ${cards.length} cards`)
    await Promise.all(cards.map(card => this.refreshEmbed(card)));
  }

  constructor(config: Config) {
    this.serverBoi = new ServerBoiService(config.serverboi.endpoint, config.serverboi.apiKey);
    const cardRepo = new ServerCardRepo(config.database);
    const discord = new DiscordHttpClient({
      token: config.discord.token,
      version: "v10"
    });
    this.serverCard = new ServerCardService(cardRepo, discord);
  }
}

async function startRefresher() {
  const log = logger.child({ name: 'EmbedRefresher' })
  log.info('Starting refresher');
  const config = loadConfig();
  logger.level = config.logLevel ?? 'info';
  logger.debug(`Log level set to ${logger.level}`);

  const refresher = new Refresher(config);

  log.info('Refreshing cards');
  await refresher.refreshCards();

  log.info(`Starting interval, waiting ${config.refresher.interval}ms between refreshes`);
  for await (const _ of setInterval(config.refresher.interval)) {
    log.debug('Refreshing cards');
    await refresher.refreshCards();
    log.debug(`Refreshed cards`);
  }
}

startRefresher();