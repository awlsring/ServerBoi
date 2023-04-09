import { ButtonStyle, APIMessageComponentButtonInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { Component } from "../component";
import { MessageComponentToResponseOptions } from "../message-component-options";

export interface ButtonEmojii {
  readonly name?: string;
  readonly id?: string;
  readonly animated?: boolean;
}

export abstract class ButtonComponent extends Component {
  protected static readonly style: ButtonStyle;
  protected static readonly label?: string;
  protected static readonly emojii?: ButtonEmojii;
  protected static readonly url?: string;
  protected static readonly disabled?: boolean;
  abstract enact(context: InteractionContext, interaction: APIMessageComponentButtonInteraction): Promise<void>;

  static toResponse(options?: MessageComponentToResponseOptions): APIInteractionResponse {
    const componentList = [
      {
        type: 1,
        components: [
          this.toApiData()
        ],
      }
    ]
    if (options?.components) {
      componentList.push(...options.components)
    }

    const data: any = {
      content: options?.content ?? undefined,
      components: componentList,
      flags: options?.ephemeral ? MessageFlags.Ephemeral : undefined
    }
    
    return {
      type: options?.type ?? InteractionResponseType.ChannelMessageWithSource,
      data: data,
    }
  }

  static toApiData() {
    return {
      type: 2,
      label: this.label,
      style: this.style,
      custom_id: this.identifier,
      url: this.url,
      disabled: this.disabled,
      emojii: this.emojii,
    }
  }
}