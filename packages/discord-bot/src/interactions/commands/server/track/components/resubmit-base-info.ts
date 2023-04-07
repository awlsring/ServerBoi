import { ButtonComponent, InteractionContext } from "@serverboi/discord-common";
import { InteractionResponseType } from "discord-api-types/v10";
import { ServerTrackInitialModal } from "./track-server-init";

export class ResubmitBaseInfoButton extends ButtonComponent {
  public static readonly identifier = "resubmit-base-info-button";
  protected static readonly style = 1;
  protected static readonly label = "Resubmit";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    context.response.send({
      type: InteractionResponseType.Modal,
      data: ServerTrackInitialModal.toApiData(),
    })
  }
}
