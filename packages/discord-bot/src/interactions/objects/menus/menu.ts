import { ChannelType, APISelectMenuOption, APIMessageSelectMenuInteractionData, ComponentType, APIMessageComponentSelectMenuInteraction, APIActionRowComponent, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "../../context"

export interface SelectMenuComponentOptions {
  readonly selectType: ComponentType;
  readonly customId: string;
  readonly options?: APISelectMenuOption[];
  readonly channelTypes?: ChannelType[];
  readonly placeholder: string
  readonly minSelectableValues: number
  readonly maxSelectableValues: number
  enact: (context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction) => Promise<void>;
}

export class SelectMenuComponent {
  readonly selectType: ComponentType;
  readonly customId: string;
  readonly placeholder: string
  readonly minSelectableValues: number
  readonly maxSelectableValues: number
  readonly options?: APISelectMenuOption[];
  readonly channelTypes?: ChannelType[];
  readonly enact: (context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction) => Promise<void>;

  constructor(options: SelectMenuComponentOptions) {
    this.selectType = options.selectType
    this.customId = options.customId
    this.placeholder = options.placeholder
    this.minSelectableValues = options.minSelectableValues
    this.maxSelectableValues = options.maxSelectableValues
    this.options = options.options
    this.channelTypes = options.channelTypes
    this.enact = options.enact
  }

  toApiData() {
    return {
      type: 1,
      components: [
        {
          type: this.selectType.valueOf(),
          custom_id: this.customId,
          options: this.options,
          channel_types: this.channelTypes,
          placeholder: this.placeholder,
          min_values: this.minSelectableValues,
          max_values: this.maxSelectableValues
        }
      ]
    }
  }
}


