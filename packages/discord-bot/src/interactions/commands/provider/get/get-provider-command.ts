import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common";
import { CommandComponent } from "../../command";
import { logger } from "@serverboi/common";

export interface GetProviderCommandOptions {
  readonly serverBoiService: ServerBoiService
}

export class GetProviderCommand extends CommandComponent {
  private readonly logger = logger.child({ name: "GetProviderCommand"});
  public static readonly identifier = "provider-get";
  public static readonly data = {
    name: "get",
    description: "Get a provider",
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

  constructor(options: GetProviderCommandOptions) {
    super();
    this.serverBoiService = options.serverBoiService;
  }

  private createProviderDataString(data?: any) {
    if (!data) {
      return ""
    }

    return `**Data**: 
${this.toMarkdownBulletList(data)}
`
  }

  private toMarkdownBulletList(json: any): string {
    const keys = Object.keys(json);
    const rows = keys.map(key => `- ${key}: ${json[key]}`).join('\n');
    return `${rows}`;
  }

  async enact(context: InteractionContext, interaction: any) {
    this.logger.debug("Enacting get provider command");
    const name = interaction.data.options[0].options![0].value as string;

    try {
      const provider = await this.serverBoiService.getProvider(context.user, name);
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `**Name**: ${provider.name}
**Type**: ${provider.type}
${this.createProviderDataString(provider.data)}

`,
          flags: MessageFlags.Ephemeral,
        }
      });
    } catch (e) {
      this.logger.error(e)
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `You have no provider with the name \`${name}\``,
          flags: MessageFlags.Ephemeral,
        }
      });
    }

  }
}