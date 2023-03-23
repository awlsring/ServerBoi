import { APIApplicationCommandInteraction, APIChatInputApplicationCommandInteraction, APIInteraction, APIMessageComponentInteraction, APIMessageComponentSelectMenuInteraction, APIModalSubmission, APIModalSubmitInteraction, ApplicationCommandOptionType, ComponentType, InteractionResponseType, InteractionType, MessageFlags } from "discord-api-types/v10";
import { FastifyReply } from "fastify";
import { Command } from "./objects/commands/command";
import { InteractionHttpClient } from "./http/client";
import { InteractionContext } from "./context";
import { SelectMenuComponent } from "./objects/menus/menu";
import { ModalComponent } from "./objects/modals/modals";

export interface InteractionClientOptions {
  token: string;
  commands: Command[];
  selectMenus: SelectMenuComponent[];
  modals: ModalComponent[];
  version?: string;
}

export class InteractionClient {
  private readonly httpClient: InteractionHttpClient;
  private readonly commands: Map<string, Command>;
  private readonly selectMenus: Map<string, SelectMenuComponent>;
  private readonly modals: Map<string, ModalComponent>;
  constructor(options: InteractionClientOptions) {
    this.httpClient = new InteractionHttpClient({
      token: options.token,
      version: options.token ?? "v10",
    });
    this.commands = new Map();
    options.commands.forEach((command) => {
      this.commands.set(command.data.name, command);
    });
    this.selectMenus = new Map();
    options.selectMenus.forEach((selectMenu) => {
      this.selectMenus.set(selectMenu.customId, selectMenu);
    });
    this.modals = new Map();
    options.modals.forEach((modal) => {
      this.modals.set(modal.customId, modal);
    });
  }

  private async formContext(response: FastifyReply) {
    return {
      http: this.httpClient,
      response: response,
    };
  }

  private async pong(response: FastifyReply) {
    console.log("Ponging request")
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

  private async handleApplicationCommand(context: InteractionContext, interaction: APIApplicationCommandInteraction) {
    console.log("Handling application command")
    const commandName = (this.determineCommandName(interaction as APIChatInputApplicationCommandInteraction));
    console.log(`Command name: ${commandName}`)

    const command = this.commands.get(commandName);
    if (command) {
      console.log(`Command found: ${command.data.name}. Enacting...`)
      await command.enact(context, interaction);
    } else {
      console.log("Command not found")
    }
  }

  private async handleSelectMenu(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction) {
    console.log("Handling string select menu")
    console.log(`Select menu custom id: ${interaction.data.custom_id}`)
    const selectMenu = this.selectMenus.get(interaction.data.custom_id);

    if (selectMenu) {
      console.log(`Menu found: ${interaction.data.custom_id}. Enacting...`)
      await selectMenu.enact(context, interaction);
    } else {
      console.log("Menu not found")
    }
  }

  private async handleModal(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    console.log("Handling modal")
    console.log(`Modal custom id: ${interaction.data.custom_id}`)
    const modal = this.modals.get(interaction.data.custom_id);
    
    if (modal) {
      console.log(`Modal found: ${interaction.data.custom_id}. Enacting...`)
      await modal.enact(context, interaction);
    } else {
      console.log("Modal not found")
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
    switch (interaction.type) {
      case InteractionType.Ping:
        await this.pong(response);
        return;
      case InteractionType.ApplicationCommand:
        await this.handleApplicationCommand(context, interaction);
        return;
      case InteractionType.ModalSubmit:
        await this.handleModal(context, interaction as APIModalSubmitInteraction);
        return;
      case InteractionType.MessageComponent:
        console.log(`Interaction component type: ${interaction.data.component_type}`)
        switch (interaction.data.component_type) {
          // case ComponentType.Button:
          //   await this.deferMessageResponse(interaction, response);
          //   return;
          case ComponentType.StringSelect:
          case ComponentType.ChannelSelect:
          case ComponentType.RoleSelect:
          case ComponentType.UserSelect:
            await this.handleSelectMenu(context, interaction as APIMessageComponentSelectMenuInteraction);
            return;
        }
      default:
        console.log("Unknown interaction type");
        return;
    }
  }
}