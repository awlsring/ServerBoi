import { Command } from "../command";
import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { ServerTrackInitialModal } from "../../modals/track-server-init";

export const TrackCommand: Command = {
  data: {
    name: "track",
    description: "Track a server",
    type: ApplicationCommandOptionType.Subcommand,
  },
  enact: async (context, interaction) => {
    console.log("Enacting track command");
    const response = {
      type: InteractionResponseType.Modal,
      data: ServerTrackInitialModal.toApiData(),
    }
    console.log(`Sending response: ${JSON.stringify(response)}`)
    await context.response.send(response);
  }
}