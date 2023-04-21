import { ButtonComponent, InteractionContext } from "@serverboi/discord-common";
import { InteractionResponseType } from "discord-api-types/v10";
import { SteamQueryInformationModal } from "./steam-query-info";
import { logger } from "@serverboi/common";

export class ResubmitQueryButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "ResubmitQueryButton"});
  public static readonly identifier = "resubmit-query-button";
  protected static readonly style = 1;
  protected static readonly label = "Resubmit";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.debug("Enacting resubmit Steam query information button");
    context.response.send({
      type: InteractionResponseType.Modal,
      data: SteamQueryInformationModal.toApiData(),
    })
  }
}
