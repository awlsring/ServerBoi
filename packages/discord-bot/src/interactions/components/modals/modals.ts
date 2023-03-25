import { APIModalInteractionResponseCallbackData, APIModalSubmitInteraction } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { Component } from "../component";

export interface TextModalComponentOptions {
  readonly customId: string;
  readonly placeholder: string
  readonly label: string
  readonly style: number
  readonly minLength: number
  readonly maxLength: number
  readonly required: boolean
}

export interface ModalComponentOptions {
  readonly title: string;
  readonly customId: string;
  readonly textInputs: TextModalComponentOptions[]
  enact: (context: InteractionContext, interaction: APIModalSubmitInteraction) => Promise<void>;
}

export class ModalComponent implements Component {
  readonly title: string;
  readonly identifier: string;
  readonly textInputs: TextModalComponentOptions[]
  readonly enact: (context: InteractionContext, interaction: APIModalSubmitInteraction) => Promise<void>;

  constructor(options: ModalComponentOptions) {
    this.textInputs = options.textInputs
    this.title = options.title
    this.identifier = options.customId
    this.enact = options.enact
  }

  toApiData(): APIModalInteractionResponseCallbackData {
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