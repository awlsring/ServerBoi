import { InteractionResponseType } from "discord-interactions";
import { ServerTrackInitialModal } from "../modals/track-server-init";
import { ButtonComponent } from "./button";

export const StartTrackServerButton = new ButtonComponent({
  identifier: "start-track-server-request-button",
  style: 1,
  label: "Enter Server Info",
  emojii: {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  },
  enact: async (context, _) => {
    console.log("Enacting start track server button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: ServerTrackInitialModal.toApiData(),
    })
  },
});
