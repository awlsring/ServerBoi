import { ChannelType, APISelectMenuOption, APIMessageSelectMenuInteractionData, ComponentType, APIMessageComponentSelectMenuInteraction, APIActionRowComponent, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { Component } from "../component";

export interface SelectMenuComponentOptions {
  readonly selectType: ComponentType;
  readonly customId: string;
  readonly options?: APISelectMenuOption[];
  readonly channelTypes?: ChannelType[];
  readonly placeholder: string
  readonly minSelectableValues: number
  readonly maxSelectableValues: number
}

export abstract class SelectMenuComponent extends Component {
  protected static readonly selectType: ComponentType;
  protected static readonly placeholder: string
  protected static readonly minSelectableValues: number
  protected static readonly maxSelectableValues: number
  protected static options?: APISelectMenuOption[] = undefined
  protected static channelTypes?: ChannelType[] = undefined
  
  abstract enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void>;

  static toApiData() {
    return {
      type: 1,
      components: [
        {
          type: this.selectType.valueOf(),
          custom_id: this.identifier,
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