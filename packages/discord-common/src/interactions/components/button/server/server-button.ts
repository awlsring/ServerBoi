import { APIButtonComponent, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { ServerCardRepo } from "../../../../persistence/server-card-repo";
import { ServerBoiService } from "../../../../service/serverboi";
import { InteractionContext } from "../../../context";
import { ButtonComponent } from "../button";

export interface ServerButtonOptions {
  readonly serverBoiService: ServerBoiService
  readonly ServerCardRepo: ServerCardRepo
}

export abstract class ServerButton extends ButtonComponent {
  protected isUserAuthorized(callerId: string, ownerId: string, admins: string[]): boolean {
    return callerId === ownerId || admins.includes(callerId)
  }

  protected async unauthorizedResponse(context: InteractionContext) {
    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "You aren't authorized to perform actions on this server.",
        flags: MessageFlags.Ephemeral,
      }
    })
  }

  static formButton(enabled: boolean): APIButtonComponent {
    return {
      type: 2,
      label: this.label,
      style: this.style.valueOf(),
      custom_id: this.identifier,
      url: this.url,
      disabled: !enabled,
      emoji: this.emojii,
    }
  }
}