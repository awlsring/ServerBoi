import { Command } from "../command";
import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export const TrackCommand: Command = {
  data: {
    name: "track",
    description: "Track a server",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "name",
        description: "The name of the server",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "application",
        description: "The application running on the server",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "address",
        description: "The address of the server",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "query-type",
        description: "The type of query to use. If not selected, the server will not have its status monitored.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Steam",
            value: "STEAM",
          },
          {
            name: "HTTP",
            value: "HTTP",
          },
        ],
      }
    ],
  },
  enact: async (context, interaction) => {
    console.log("Enacting track command");
    context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Enacting track command",
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}