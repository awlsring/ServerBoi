import { Component, Logger, DiscordHttpClient } from "@serverboi/discord-common";
import { APIChatInputApplicationCommandInteraction, APIInteraction,  ApplicationCommandOptionType, InteractionResponseType, InteractionType, MessageFlags } from "discord-api-types/v10";
import { FastifyReply } from "fastify";

export interface InteractionHandlerOptions {
  token: string;
  logger: Logger;
  components?: Component[];
  version?: string;
}

export class InteractionHandler {
  private readonly httpClient: DiscordHttpClient;
  private readonly components: Map<string, Component>;
  private readonly log: Logger;
  constructor(options: InteractionHandlerOptions) {
    this.httpClient = new DiscordHttpClient({
      token: options.token,
      version: options.version ?? "v10",
    });
    this.log = options.logger;
    this.components = new Map();
    options.components?.forEach((component) => {
      this.components.set(component.getIdentifier(), component);
    });
  }

  private async formContext(response: FastifyReply) {
    return {
      http: this.httpClient,
      response: response,
      logger: this.log,
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
        return option.name;
      }

      if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
        const subOptions = option.options ?? [];
        const subcommandOption = subOptions.find(o => o.type === ApplicationCommandOptionType.Subcommand);
        if (subcommandOption) {
          return subcommandOption.name;
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

  private async deferMessageResponse(interaction: APIInteraction, response: FastifyReply) {
    console.log("Deferring message response")
    response.send({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
      }
    });
  }

  async handle(interaction: APIInteraction, response: FastifyReply) {
    console.log("Handling interaction")
    console.log(`Interaction ID: ${interaction.id}`)
    console.log(`Interaction: ${JSON.stringify(interaction)}`)
    const context = await this.formContext(response);
    console.log("Routing request")

    const interactionName = await this.determineInteractionName(interaction);
    console.log(`Interaction name: ${interactionName}`)
    const component = this.components.get(interactionName);
    if (component) {
      console.log(`Component found: ${component.getIdentifier()}. Enacting...`)
      await component.enact(context, interaction);
    } else {
      console.log("No registered component found for interaction")
    }
  }
}