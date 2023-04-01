import fastify, { FastifyReply, FastifyRequest, } from 'fastify'
import rawBody from 'fastify-raw-body';
import { APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10"
import { verifyKey } from 'discord-interactions';
import { InteractionHandler } from './interactions/handler';
import { Config } from './config';
import fs from 'fs';
import yaml from 'js-yaml';
import { ServerBoiService, ServerCardRepo } from '@serverboi/discord-common';
import { TrackServerRequestRepo } from './persistence/track-server-request-repo';
import { TrackCommand } from './interactions/components/commands/server/track';
import { QuerySelectMenu } from './interactions/components/menus/query-select';
import { ChannelSelectMenu } from './interactions/components/menus/channel-select-menu';
import { ServerTrackInitialModal } from './interactions/components/modals/track-server-init';
import { SteamQueryInformationModal } from './interactions/components/modals/steam-query-info';
import { StartTrackServerButton } from './interactions/components/button/start-track';
import { ResubmitQueryButton } from './interactions/components/button/resubmit-steam-query';

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

async function main() {
  
  const server = fastify({
    logger: true,
  });
  
  await server.register(rawBody, {
    runFirst: true,
  });
  
  const cfg = loadConfig();
  const serverboi = new ServerBoiService(cfg.serverboi.endpoint, cfg.serverboi.apiKey);
  const requestDao = new TrackServerRequestRepo(cfg.database);
  const cardDao = new ServerCardRepo(cfg.database);
  
  const interactions = new InteractionHandler({
    token: cfg.discord.token,
    version: cfg.discord.apiVersion ?? 'v10',
    components: [
      new TrackCommand(),
      new QuerySelectMenu({ trackServerDao: requestDao }),
      new ChannelSelectMenu({
        serverBoiService: serverboi,
        trackServerDao: requestDao,
        ServerCardRepo: cardDao,
      }),
      new ServerTrackInitialModal({ trackServerDao: requestDao }),
      new SteamQueryInformationModal({ trackServerDao: requestDao }),
      new StartTrackServerButton(),
      new ResubmitQueryButton(),
    ],
    logger: server.log,
  });

  
  server.get('/ping', async => {
    return InteractionResponseType.Pong
  })
  
  server.addHook('preHandler', async (request: FastifyRequest, response) => {
    if (request.method === 'POST') {
      server.log.info('Verifying POST request');
      
      const signature = request.headers['x-signature-ed25519'];
      const timestamp = request.headers['x-signature-timestamp'];
      const isValidRequest = verifyKey(
        request.rawBody as string,
        signature as string,
        timestamp as string,
        cfg.discord.publicKey
      );
      if (!isValidRequest) {
        server.log.info('Invalid Request');
        return response.status(401).send({ error: 'Bad request signature ' });
      }
    }
  });
  
  server.post('/', async (request: FastifyRequest, response: FastifyReply) => {
    const interaction: APIInteraction = request.body as APIInteraction;
    if (interaction.type === InteractionType.Ping) {
      return interactions.pong(response);
    }
    await interactions.handle(interaction, response);
  });
  
  server.listen({ port: cfg.server.port }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

}

(async () => {
  try {
    await main();
    console.log('Server started');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();