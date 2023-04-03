import { ButtonStyle, APIMessageComponentButtonInteraction } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { Component } from "../component";

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