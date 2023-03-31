import { APIModalInteractionResponseCallbackData, APIModalSubmitInteraction } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { Component } from "../component";

export interface TextModal {
  readonly customId: string;
  readonly placeholder: string
  readonly label: string
  readonly style: number
  readonly minLength: number
  readonly maxLength: number
  readonly required: boolean
}

export abstract class ModalComponent extends Component {
  public static readonly identifier: string;
  protected static readonly title: string;
  protected static readonly textInputs: TextModal[]
  abstract enact(context: InteractionContext, interaction: APIModalSubmitInteraction): Promise<void>;

  static toApiData(): APIModalInteractionResponseCallbackData {
    return {
      title: this.title,
      custom_id: this.identifier,
      components: this.textInputs.map((textInput) => {
        return {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: textInput.customId,
              label: textInput.label,
              style: textInput.style,
              min_length: textInput.minLength,
              max_length: textInput.maxLength,
              placeholder: textInput.placeholder,
              required: textInput.required,
            }
          ]
        }
      })      
    }
  }
}