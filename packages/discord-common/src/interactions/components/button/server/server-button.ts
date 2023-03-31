import { APIButtonComponent } from "discord-api-types/v10";
import { ButtonComponent } from "../button";

export abstract class ServerButton extends ButtonComponent {
  static formButton(enabled: boolean): APIButtonComponent {
    return {
      type: 2,
      label: this.label,
      style: this.style,
      custom_id: this.identifier,
      url: this.url ?? "",
      disabled: !enabled,
      emoji: this.emojii,
    }
  }
}