import { setInterval } from 'timers/promises';
import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Config } from './config';
import { ServerBoiService, ServerCardRepo, ServerCardDto, DiscordHttpClient, formServerEmbedMessage, ServerCardService } from '@serverboi/discord-common';
import { ResourceNotFoundError } from '@serverboi/client';
dotenv.config();

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

class Refresher {
  readonly serverBoi: ServerBoiService;
  readonly serverCard: ServerCardService;

  async refreshEmbed(card: ServerCardDto) {
    try {
      const server = await this.serverBoi.getServer("refreshed", card.serverId);
      await this.serverCard.refreshCard(card, server)
    } catch (e) {
      console.log(e)
      if (e instanceof ResourceNotFoundError) {
        console.log(`Deleting card for server ${card.serverId} as it no longer exists`)
        await this.serverCard.deleteCard({ serverId: card.serverId });
        return
      }
    }
  }

  async refreshCards() {
    const cards = await this.serverCard.listCards();
    console.log(`Refreshing ${cards.length} cards`)
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