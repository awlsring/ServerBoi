import { APIApplicationCommandInteraction, APIInteraction, APIModalSubmitInteraction, InteractionResponseType, InteractionType, MessageFlags, ModalSubmitComponent } from "discord-api-types/v10";
import { FastifyReply } from "fastify";
import { Command } from "./objects/commands/command";
import { InteractionHttpClient } from "./http/client";
import { InteractionContext } from "./context";

export interface InteractionClientOptions {
  token: string;
  commands: Command[];
  version?: string;
}

export class InteractionClient {
  private readonly httpClient: InteractionHttpClient;
  private readonly commands: Map<string, Command>;
  constructor(options: InteractionClientOptions) {
    this.httpClient = new InteractionHttpClient({
      token: options.token,
      version: options.token ?? "v10",
    });
    this.commands = new Map();
    options.commands.forEach((command) => {
      this.commands.set(command.data.name, command);
    });
  }

  private async formContext(response: FastifyReply) {
    return {
      http: this.httpClient,
      response: response,
    };
  }

  private async pong(response: FastifyReply) {
    response.send({
      type: InteractionResponseType.Pong,
    });
  }

  private async handleApplicationCommand(context: InteractionContext, interaction: APIApplicationCommandInteraction) {
    const command = this.commands.get(interaction.data.name);
    if (command) {
      await command.enact!(context, interaction);
    }
  }

  private async deferMessageResponse(interaction: APIInteraction, response: FastifyReply) {
    response.send({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
      }
    });
  }

  async handle(interaction: APIInteraction, response: FastifyReply) {
    const context = await this.formContext(response);
    switch (interaction.type) {
      case InteractionType.Ping:
        await this.pong(response);
        return;
      case InteractionType.ApplicationCommand:
        await this.handleApplicationCommand(context, interaction);
        return;
      default:
        console.log("Unknown interaction type");
        return;
    }
  }
}