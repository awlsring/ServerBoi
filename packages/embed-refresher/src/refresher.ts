import { setInterval } from 'timers/promises';
import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { ServerBoiService, ServerCardRepo, ServerCardDto, serverToEmbed, InteractionHttpClient } from '@serverboi/discord-common';
dotenv.config();

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

class Refresher {
  readonly serverCardRepo: ServerCardRepo;
  readonly serverBoi: ServerBoiService;
  readonly discord: InteractionHttpClient;

  async refreshEmbeds(card: ServerCardDto) {
    const server = await this.serverBoi.getServer(card.serverId);
    const embed = serverToEmbed(server);
    await this.discord.editMessage(card.channelId, card.messageId, embed.toMessage(false, false))
  }

  async refreshCards() {
    const cards = await this.serverCardRepo.findAll();
    console.log(`Refreshing ${cards.length} cards`)
    await Promise.all(cards.map(card => this.refreshEmbeds(card)));
  }

  constructor(config: Config) {
    this.serverBoi = new ServerBoiService(config.serverboi.endpoint, config.serverboi.apiKey);
    this.serverCardRepo = new ServerCardRepo(config.database);
    this.discord = new InteractionHttpClient({
      token: config.discord.token,
      version: "v10"
    });
  }
}

async function startRefresher() {
  console.log('Starting refresher');
  const config = loadConfig();
  const refresher = new Refresher(config);

  console.log('Refreshing cards');
  await refresher.refreshCards();

  console.log(`Starting interval, waiting ${config.refresher.interval}ms between refreshes`);
  for await (const _ of setInterval(config.refresher.interval)) {
    console.log('Refreshing cards');
    await refresher.refreshCards();
    console.log(`Refreshed cards`);
  }
}

startRefresher();