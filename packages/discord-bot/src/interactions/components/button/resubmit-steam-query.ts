import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "../../context";
import { SteamQueryInformationModal } from "../modals/steam-query-info";
import { ButtonComponent } from "./button";

export class ResubmitQueryButton extends ButtonComponent {
  public static readonly identifier = "resubmit-query-button";
  protected static readonly style = 1;
  protected static readonly label = "Resubmit";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: SteamQueryInformationModal.toApiData(),
    })
  }
}
