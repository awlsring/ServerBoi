import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "@serverboi/discord-common";
import { ServerTrackInitialModal } from "../modals/track-server-init";
import { ButtonComponent } from "@serverboi/discord-common";

export class StartTrackServerButton extends ButtonComponent {
  public static readonly identifier = "start-track-server-request-button";
  protected static readonly style = 1;
  protected static readonly label = "Enter Server Info";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    context.logger.info("Enacting start track server button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: ServerTrackInitialModal.toApiData(),
    })
  }
}
