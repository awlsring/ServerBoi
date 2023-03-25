import fastify, { FastifyReply, FastifyRequest, } from 'fastify'
import rawBody from 'fastify-raw-body';
import { APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10"
import { verifyKey } from 'discord-interactions';
import dotenv from 'dotenv';
import { InteractionClient } from './interactions/client';
import { TrackCommand } from './interactions/components/commands/server/track';
import { SteamQueryInformationModal } from './interactions/components/modals/steam-query-info';
import { ServerTrackInitialModal } from './interactions/components/modals/track-server-init';
import { QuerySelectMenu } from './interactions/components/menus/query-select';
import { ChannelSelectMenu } from './interactions/components/menus/channel-select-menu';
import { StartTrackServerButton } from './interactions/components/button/start-track';
import { ResubmitQueryButton } from './interactions/components/button/resubmit-steam-query';
import { ServerBoiService } from './service/serverboi';
dotenv.config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PORT: number = Number(process.env.PORT) || 7033

if (!PUBLIC_KEY) {
  console.error('PUBLIC_KEY is not set');
  process.exit(1);
}

async function main() {
  
  const server = fastify({
    logger: true,
  });
  
  await server.register(rawBody, {
    runFirst: true,
  });

  const interactions = new InteractionClient({
    token: process.env.DISCORD_BOT_TOKEN!,
    version: "v10",
    components: [
      TrackCommand,
      QuerySelectMenu,
      ChannelSelectMenu,
      ServerTrackInitialModal,
      SteamQueryInformationModal,
      StartTrackServerButton,
      ResubmitQueryButton,
    ],
  });

  // init singleton
  ServerBoiService.getInstance(process.env.SERVERBOI_ENDPOINT, process.env.SERVERBOI_TOKEN);
  
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
        PUBLIC_KEY!
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
  
  server.listen({ port: PORT }, (err, address) => {
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