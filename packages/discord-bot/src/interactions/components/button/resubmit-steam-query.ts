import { InteractionResponseType } from "discord-interactions";
import { SteamQueryInformationModal } from "../modals/steam-query-info";
import { ButtonComponent } from "./button";

export const ResubmitQueryButton = new ButtonComponent({
  identifier: "resubmit-query-button",
  style: 1,
  label: "Resubmit",
  emojii: {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  },
  enact: async (context, _) => {
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: SteamQueryInformationModal.toApiData(),
    })
  },
});
