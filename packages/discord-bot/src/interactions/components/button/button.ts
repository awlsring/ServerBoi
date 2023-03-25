import { ButtonStyle, APIMessageButtonInteractionData, APIMessageComponentButtonInteraction } from "discord-api-types/v10"
import { InteractionContext } from "../../context"

export interface ButtonEmojii {
  readonly name: string;
  readonly id: string;
  readonly animated: boolean;
}

export interface ButtonObjectData {
  readonly type: 2;
  readonly style: ButtonStyle;
  readonly label?: string;
  readonly customId?: string;
  readonly emojii?: ButtonEmojii;
  readonly url?: string;
  readonly disabled?: boolean;
}

export interface ButtonComponentOptions {
  readonly style: ButtonStyle;
  readonly label?: string;
  readonly identifier: string;
  readonly emojii?: ButtonEmojii;
  readonly url?: string;
  readonly disabled?: boolean;
  enact: (context: InteractionContext, interaction: APIMessageComponentButtonInteraction) => Promise<void>;
}

export class ButtonComponent {
  readonly identifier: string;
  readonly buttonData: ButtonObjectData
  readonly enact: (context: InteractionContext, interaction: APIMessageComponentButtonInteraction) => Promise<void>;

  constructor(options: ButtonComponentOptions) {
    this.identifier = options.identifier
    this.buttonData = {
      type: 2,
      style: options.style,
      label: options.label,
      customId: options.identifier,
      emojii: options.emojii,
      url: options.url,
      disabled: options.disabled,
    }
    this.enact = options.enact
  }

  toApiData() {
    return {
      type: 2,
      label: this.buttonData.label,
      style: this.buttonData.style,
      custom_id: this.buttonData.customId,
      url: this.buttonData.url,
      disabled: this.buttonData.disabled,
      emojii: this.buttonData.emojii,
    }
  }
}