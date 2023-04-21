import { Component, DiscordHttpClient, InteractionContext } from "@serverboi/discord-common";
import { APIChatInputApplicationCommandInteraction, APIInteraction,  ApplicationCommandOptionType, InteractionResponseType, InteractionType, MessageFlags } from "discord-api-types/v10";
import { FastifyReply } from "fastify";
import { logger } from "@serverboi/common";
export interface InteractionHandlerOptions {
  token: string;
  components?: Component[];
  version?: string;
}

export class InteractionHandler {
  private readonly logger = logger.child({ name: "InteractionHandler"});
  private readonly httpClient: DiscordHttpClient;
  private readonly components: Map<string, Component>;
  constructor(options: InteractionHandlerOptions) {
    this.httpClient = new DiscordHttpClient({
      token: options.token,
      version: options.version ?? "v10",
    });
    this.components = new Map();
    this.components = this.registerComponents(options.components ?? [])
  }

  private registerComponents(components: Component[]) {
    const registeredComponents = new Map<string, Component>();
    components.forEach((component) => {
      if (registeredComponents.has(component.getIdentifier())) {
        throw new Error(`Component with identifier ${component.getIdentifier()} already registered.`);
      }
      registeredComponents.set(component.getIdentifier(), component);
    });

    this.logger.info("Starting server with the following registered components:");
    for (const [identifier, component] of registeredComponents) {
      this.logger.info(`- ${identifier}`);
    }

    return registeredComponents;
  }

  private async formContext(interaction: APIInteraction, response: FastifyReply): Promise<InteractionContext> {
    let user = "";
    if (interaction.member) {
      user = interaction.member.user.id;
    }

    return {
      http: this.httpClient,
      response: response,
      user: user,
    };
  }

  async pong(response: FastifyReply) {
    response.send({
      type: InteractionResponseType.Pong,
    });
  }

  private determineCommandName(interaction: APIChatInputApplicationCommandInteraction): string {
    if (!interaction.data.options) {
      return interaction.data.name;
    }
    for (const option of interaction.data.options) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        return `${interaction.data.name}-${option.name}`;
      }

      if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
        const subOptions = option.options ?? [];
        const subcommandOption = subOptions.find(o => o.type === ApplicationCommandOptionType.Subcommand);
        if (subcommandOption) {
          return `${interaction.data.name}-${option.name}-${subcommandOption.name}`;
        }
      }
    }
    throw new Error("Unable to determine command name from data.");
  }

  private async determineInteractionName(interaction: APIInteraction): Promise<string> {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        return (this.determineCommandName(interaction as APIChatInputApplicationCommandInteraction));
      case InteractionType.MessageComponent:
      case InteractionType.MessageComponent:
      case InteractionType.ModalSubmit:
        return interaction.data.custom_id;
      default:
        throw new Error("Unable to determine component name from data.");
    }
  }

  async handle(interaction: APIInteraction, response: FastifyReply) {
    this.logger.debug("Handling interaction")
    this.logger.debug(`Interaction ID: ${interaction.id}`)
    this.logger.debug(`Interaction: ${JSON.stringify(interaction)}`)
    const context = await this.formContext(interaction, response);
    this.logger.debug("Routing request")

    const interactionName = await this.determineInteractionName(interaction);
    this.logger.debug(`Interaction name: ${interactionName}`)
    const component = this.components.get(interactionName);
    if (component) {
      this.logger.debug(`Component found: ${component.getIdentifier()}. Enacting...`)
      await component.enact(context, interaction);
    } else {
      this.logger.debug("No registered component found for interaction")
    }
  }
}