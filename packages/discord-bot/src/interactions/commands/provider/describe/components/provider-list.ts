import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, APISelectMenuOption, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { ProviderSummary } from "@serverboi/client"

export interface UserProviderListMenuOptions {
  readonly serverBoiService: ServerBoiService;
  readonly providers?: ProviderSummary[];
}

export class UserProviderListMenu extends SelectMenuComponent {
  public static readonly identifier = "user-provider-list-select";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly placeholder = "Select provider type";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  readonly serverBoiService: ServerBoiService

  constructor(options: UserProviderListMenuOptions) {
    super()
    this.serverBoiService = options.serverBoiService
  }

  static toApiDataWithProviders(providers: ProviderSummary[]) {
    const options = providers?.map((provider) => {
      return {
        label: provider.name!,
        value: provider.name!,
        description: `A ${provider.type!.toLocaleLowerCase()} provider`,
      }
    })
    return {
      type: 1,
      components: [
        {
          type: this.selectType.valueOf(),
          custom_id: this.identifier,
          options: options,
          channel_types: this.channelTypes,
          placeholder: this.placeholder,
          min_values: this.minSelectableValues,
          max_values: this.maxSelectableValues
        }
      ]
    }
  }

  private createProviderDataString(data?: string) {
    if (!data) {
      return ""
    }

    const obj = JSON.parse(data)
    return `**Data**: 
${this.toMarkdownBulletList(obj)}
`
  }

  private toMarkdownBulletList(json: any): string {
    const keys = Object.keys(json);
    const rows = keys.map(key => `- ${key}: \`${json[key]}\``).join('\n');
    return `${rows}`;
  }

  async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    context.logger.info(`Selected values: ${selectedValue}`)

    try {
      const provider = await this.serverBoiService.getProvider(context.user, selectedValue);
      
      await context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          components: [],
          content: `**Name**: \`${provider.name}\`
**Type**: \`${provider.type}\`
${this.createProviderDataString(provider.data)}

`,
          flags: MessageFlags.Ephemeral,
        }
      });
    } catch (e) {
      await context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: `You have no provider with the name \`${name}\``,
          flags: MessageFlags.Ephemeral,
        }
      });
    }

  }
}