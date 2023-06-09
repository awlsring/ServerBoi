import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common";
import { CommandComponent } from "../../command";
import { logger } from "@serverboi/common";

export interface RemoveProviderCommandOptions {
  readonly serverBoiService: ServerBoiService
}

export class RemoveProviderCommand extends CommandComponent {
  private readonly logger = logger.child({ name: "RemoveProviderCommand"});
  public static readonly identifier = "provider-remove";
  public static readonly data = {
    name: "remove",
    description: "Remove a provider",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "name",
        description: "The providers name",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  };

  readonly serverBoiService: ServerBoiService

  constructor(options: RemoveProviderCommandOptions) {
    super();
    this.serverBoiService = options.serverBoiService;
  }

  async enact(context: InteractionContext, interaction: any) {
    this.logger.debug("Enacting remove provider command");
    const name = interaction.data.options[0].options![0].value as string;

    try {
      await this.serverBoiService.deleteProvider(context.user, name)
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Provider \`${name}\` has been removed.`,
          flags: MessageFlags.Ephemeral,
        }
      });
    } catch (e) {
      this.logger.error(e);
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `You have no provider with the name \`${name}\`.`,
          flags: MessageFlags.Ephemeral,
        }
      });
    }
  }
}