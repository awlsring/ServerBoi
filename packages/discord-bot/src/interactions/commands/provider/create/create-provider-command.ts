import { APIApplicationCommandInteraction, ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { CommandComponent } from "../../command";
import { ProviderCreateMenu } from "./components/provider-create-menu";
import { logger } from "@serverboi/common";

export class CreateProviderCommand extends CommandComponent {
  private readonly logger = logger.child({ name: "CreateProviderCommand"});
  public static readonly identifier = "provider-create";
  public static readonly data = {
    name: "create",
    description: "Create a new provider",
    type: ApplicationCommandOptionType.Subcommand,
  };
  async enact(context: InteractionContext, interaction: APIApplicationCommandInteraction) {
    this.logger.debug("Enacting create provider command");
    this.logger.debug(`Interaction: ${JSON.stringify(interaction)}`)
    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Select the type of provider you'd like to create.",
        components: [
          ProviderCreateMenu.toApiData()
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}