import { APIApplicationCommandInteraction, ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { StartTrackServerButton } from "../../button/start-track";
import { CommandComponent } from "../command";

export class TrackCommand extends CommandComponent {
  public static readonly identifier = "track";
  public static readonly data = {
    name: "track",
    description: "Track a server",
    type: ApplicationCommandOptionType.Subcommand,
  };
  async enact(context: InteractionContext, interaction: APIApplicationCommandInteraction) {
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
}