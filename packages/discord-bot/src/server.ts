import fastify, { FastifyReply, FastifyRequest, } from 'fastify'
import rawBody from 'fastify-raw-body';
import { APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10"
import { verifyKey } from 'discord-interactions';
import { InteractionHandler } from './interactions/handler';
import { Config } from './config';
import fs from 'fs';
import yaml from 'js-yaml';
import { DiscordHttpClient, ServerBoiService, ServerCardRepo, ServerCardService, ServerMoreActionsMenu, StartServerButton, StopServerButton, RebootServerButton } from '@serverboi/discord-common';
import { TrackServerRequestRepo } from './persistence/track-server-request-repo';
import { TrackCommand } from './interactions/commands/server/track/track-server-command';
import { QuerySelectMenu } from './interactions/commands/server/track/components/query-select';
import { ChannelSelectMenu } from './interactions/commands/server/track/components/channel-select-menu';
import { ServerTrackInitialModal } from './interactions/commands/server/track/components/track-server-init';
import { SteamQueryInformationModal } from './interactions/commands/server/track/components/steam-query-info';
import { StartTrackServerButton } from './interactions/commands/server/track/components/start-track';
import { ResubmitQueryButton } from './interactions/commands/server/track/components/resubmit-steam-query';
import { ResubmitBaseInfoButton } from './interactions/commands/server/track/components/resubmit-base-info';
import { HTTPQueryInformationModal } from './interactions/commands/server/track/components/http-query-info';
import { CreateProviderRequestRepo } from './persistence/create-provider-request-repo';
import { ProviderCreateMenu } from './interactions/commands/provider/create/components/provider-create-menu';
import { KubernetesProviderInformationModal } from './interactions/commands/provider/create/components/k8s-info-modal';
import { KubernetesProviderAuthInformationModal } from './interactions/commands/provider/create/components/k8s-auth-modal';
import { CreateProviderNameInputModal } from './interactions/commands/provider/create/components/provider-name-input';
import { CreateProviderCommand } from './interactions/commands/provider/create/create-provider-command';
import { KubernetesProviderAuthPromptButton } from './interactions/commands/provider/create/components/k8s-auth-prompt';
import { CreateProviderNameInputPromptButton } from './interactions/commands/provider/create/components/name-prompt-modal';
import { GetProviderCommand } from './interactions/commands/provider/get/get-provider-command';
import { DescribeProviderCommand } from './interactions/commands/provider/describe/describe-provider-command';
import { UserProviderListMenu } from './interactions/commands/provider/describe/components/provider-list';
import { RemoveProviderCommand } from './interactions/commands/provider/remove/remove-provider-command';
import { TrackServerSelectProvider } from './interactions/commands/server/track/components/select-provider-menu';
import { ResubmitKubernetesProviderInfoButton } from './interactions/commands/server/track/components/resubmit-kubernetes-info-button';
import { KubernetesServerProviderInformationModal } from './interactions/commands/server/track/components/kubernetes-provider-modal';
import { CapabilitySelectMenu } from './interactions/commands/server/track/components/set-capabilities';
import { RemoveCommand } from './interactions/commands/server/remove/remove-server-command';
import { ListServerCommand } from './interactions/commands/server/list/list-server-command';
import { APIKeyAuthInformationModal } from './interactions/commands/provider/create/components/api-key-info-modal';
import { APIKeyAuthPromptButton } from './interactions/commands/provider/create/components/api-key-auth-prompt';
import { HetznerServerProviderInformationModal } from './interactions/commands/server/track/components/hetzner-provider-modal';
import { ResubmitHetznerProviderInfoButton } from './interactions/commands/server/track/components/resubmit-hetzner-info-button';
import { AWSEC2ServerProviderInformationModal } from './interactions/commands/server/track/components/aws-ec2-provider-modal';
import { ResubmitAWSEC2ProviderInfoButton } from './interactions/commands/server/track/components/resubmit-aws-ec2-info-button';
import { logger } from '@serverboi/common';
import { NoUUserCommand } from './interactions/commands/nou/user';
import { NoUMessageCommand } from './interactions/commands/nou/message';

function loadConfig(): Config {
  const configPath = process.env.CONFIG_PATH ?? './config/config.yaml';
  const data = fs.readFileSync(configPath, 'utf-8');
  return new Config(yaml.load(data));
}

async function main() {
  const log = logger.child({ module: 'server' });
  const server = fastify();
  
  await server.register(rawBody, {
    runFirst: true,
  });
  
  const cfg = loadConfig();
  logger.level = cfg.logLevel ?? 'info';
  log.debug(`Log level set to ${cfg.logLevel}`);

  const serverboi = new ServerBoiService(cfg.serverboi.endpoint, cfg.serverboi.apiKey);
  const requestDao = new TrackServerRequestRepo(cfg.database);
  const createProviderRequestRepo = new CreateProviderRequestRepo(cfg.database);
  const cardRepo = new ServerCardRepo(cfg.database);
  const discord = new DiscordHttpClient({
    token: cfg.discord.token,
    version: "v10"
  });
  const serverCardService = new ServerCardService(cardRepo, discord);

  log.debug('Registering interactions')
  const interactions = new InteractionHandler({
    token: cfg.discord.token,
    version: cfg.discord.apiVersion ?? 'v10',
    components: [
      new TrackCommand(),
      new RemoveCommand({ serverboiService: serverboi, serverCardService }),
      new ListServerCommand({ serverboiService: serverboi, serverCardService }),
      new GetProviderCommand({ serverBoiService: serverboi }),
      new CreateProviderCommand(),
      new QuerySelectMenu({ trackServerDao: requestDao }),
      new ChannelSelectMenu({
        serverBoiService: serverboi,
        trackServerDao: requestDao,
        serverCardService: serverCardService,
      }),
      new APIKeyAuthInformationModal({ requestRepo: createProviderRequestRepo }),
      new APIKeyAuthPromptButton(),
      new CapabilitySelectMenu({ trackServerDao: requestDao }),
      new KubernetesServerProviderInformationModal({ requestRepo: requestDao }),
      new ResubmitKubernetesProviderInfoButton(),
      new TrackServerSelectProvider({ trackServerDao: requestDao, serverboiService: serverboi }),
      new RemoveProviderCommand({ serverBoiService: serverboi }),
      new DescribeProviderCommand({ serverBoiService: serverboi }),
      new UserProviderListMenu({ serverBoiService: serverboi }),
      new ServerTrackInitialModal({ trackServerDao: requestDao }),
      new SteamQueryInformationModal({ trackServerDao: requestDao, serverboiService: serverboi }),
      new HTTPQueryInformationModal({ trackServerDao: requestDao, serverboiService: serverboi}),
      new HetznerServerProviderInformationModal({ requestRepo: requestDao }),
      new ResubmitHetznerProviderInfoButton(),
      new AWSEC2ServerProviderInformationModal({ requestRepo: requestDao }),
      new ResubmitAWSEC2ProviderInfoButton(),
      new StartTrackServerButton(),
      new ResubmitQueryButton(),
      new ResubmitBaseInfoButton(),
      new CreateProviderNameInputPromptButton(),
      new ProviderCreateMenu({ createProviderRequestRepo }),
      new KubernetesProviderAuthPromptButton(),
      new KubernetesProviderInformationModal({ requestRepo: createProviderRequestRepo }),
      new KubernetesProviderAuthInformationModal({ requestRepo: createProviderRequestRepo }),
      new CreateProviderNameInputModal({ serverBoiService: serverboi, requestRepo: createProviderRequestRepo }),
      new StartServerButton({ serverBoiService: serverboi, ServerCardRepo: cardRepo }),
      new StopServerButton({ serverBoiService: serverboi, ServerCardRepo: cardRepo }),
      new RebootServerButton({ serverBoiService: serverboi, ServerCardRepo: cardRepo }),
      new ServerMoreActionsMenu({ serverBoiService: serverboi, serverCardService: serverCardService }),
      new NoUUserCommand(cfg.discord.applicationId),
      new NoUMessageCommand(cfg.discord.applicationId)
    ],
  });

  server.get('/ping', async => {
    log.debug('Received ping request')
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
  
  server.listen({ port: cfg.server.port, host: "::" }, (err, address) => {
    if (err) {
      log.error(err)
      process.exit(1)
    }
    log.info(`Server listening at ${address}`)
  })

}

(async () => {
  try {
    await main();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();