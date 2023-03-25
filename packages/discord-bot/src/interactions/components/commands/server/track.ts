import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { StartTrackServerButton } from "../../button/start-track";
import { CommandComponent } from "../command";

export const TrackCommand = new CommandComponent({
  identifier: "track",
  data: {
    name: "track",
    description: "Track a server",
    type: ApplicationCommandOptionType.Subcommand,
  },
  enact: async (context, _) => {
    console.log("Enacting track command");
    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "To start tracking the server, we'll start with entering some information about it. Hit the button below to start.",
        components: [
          {
            type: 1,
            components: [
              StartTrackServerButton.toApiData()
            ],
          }
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
});