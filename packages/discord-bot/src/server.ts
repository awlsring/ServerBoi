import fastify, { FastifyReply, FastifyRequest, } from 'fastify'
import rawBody from 'fastify-raw-body';
import { APIInteraction, InteractionType, APIInteractionResponse, InteractionResponseType} from "discord-api-types/v10"
import { PingInteraction } from './interactions/ping';
import { verifyKey } from 'discord-interactions';
import { RouteApplicationCommand } from './interactions/route-application-command';
import dotenv from 'dotenv';
dotenv.config();

type Request = FastifyRequest<{
  Body: APIInteraction;
  Headers: {
    'x-signature-ed25519': string;
    'x-signature-timestamp': string;
  };
}>;

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
    const message: APIInteraction = request.body as APIInteraction;
  
    switch (message.type) {
      case InteractionType.Ping:
        await PingInteraction(message, response);
        return
      case InteractionType.ApplicationCommand:
        await RouteApplicationCommand(message, response);
      default:
        server.log.error("Unknown Type");
        response.status(400).send({ error: "Unknown Type" });
        return
    }
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