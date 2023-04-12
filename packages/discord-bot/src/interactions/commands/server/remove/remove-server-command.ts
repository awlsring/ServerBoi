import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext, ServerBoiService, ServerCardService } from "@serverboi/discord-common";
import { CommandComponent } from "../../command";

export interface GetProviderCommandOptions {
  readonly serverboiService: ServerBoiService
  readonly serverCardService: ServerCardService
}

export class RemoveCommand extends CommandComponent {
  public static readonly identifier = "server-remove";
  public static readonly data = {
    name: "remove",
    description: "Remove a tracked server",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "id",
        description: "The server's id",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  };

  readonly serverboiService: ServerBoiService
  readonly cardService: ServerCardService

  constructor(options: GetProviderCommandOptions) {
    super();
    this.serverboiService = options.serverboiService;
    this.cardService = options.serverCardService;
  }

  async enact(context: InteractionContext, interaction: any) {
    console.log("Enacting remove command");
    const id = interaction.data.options[0].options![0].value as string;

    try {
      const serverId = `${interaction.guild_id}-${id}`;
      await this.serverboiService.untrackServer(context.user, serverId);
      await this.cardService.deleteCard({ serverId: serverId });
      console.log("Removed server")
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Removed server \`${id}\``,
          flags: MessageFlags.Ephemeral,
        }
      });
    } catch (e) {
      console.error(e);
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Unable to find server with id \`${id}\``,
          flags: MessageFlags.Ephemeral,
        }
      });
    }
  }
}