import { APIApplicationCommandInteraction, ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common";
import { CommandComponent } from "../../command";
import { UserProviderListMenu } from "./components/provider-list";

export interface DescribeProviderCommandOptions {
  readonly serverBoiService: ServerBoiService
}

export class DescribeProviderCommand extends CommandComponent {
  public static readonly identifier = "provider-describe";
  public static readonly data = {
    name: "describe",
    description: "Describe a provider",
    type: ApplicationCommandOptionType.Subcommand,
  };

  readonly serverBoiService: ServerBoiService

  constructor(options: DescribeProviderCommandOptions) {
    super();
    this.serverBoiService = options.serverBoiService;
  }

  async enact(context: InteractionContext, interaction: APIApplicationCommandInteraction) {
    let response: any
    try {
      const providers = await this.serverBoiService.listProviders(context.user);
      if (providers.length === 0) {
        response = {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "You have no registered providers. Create a new one with the `/provider create` command",
            flags: MessageFlags.Ephemeral,
          }
        }
      } else {
        response = {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Select one of your registered providers to describe",
            components: [
              UserProviderListMenu.toApiDataWithProviders(providers)
            ],
            flags: MessageFlags.Ephemeral,
          }
        }
      }
    } catch (e) {
      console.log(e)
      response = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "There was an unexpected error trying to list your providers. Try again later.",
          flags: MessageFlags.Ephemeral,
        }
      }
    }
    await context.response.send(response);
  }
}