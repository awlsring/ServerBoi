import { ApplicationCommandOptionType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext, ServerBoiService, ServerCardService } from "@serverboi/discord-common";
import { CommandComponent } from "../../command";

export interface ListServerCommandOptions {
  readonly serverboiService: ServerBoiService
  readonly serverCardService: ServerCardService
}

export class ListServerCommand extends CommandComponent {
  public static readonly identifier = "server-list";
  public static readonly data = {
    name: "list",
    description: "List servers in the guild.",
    type: ApplicationCommandOptionType.Subcommand,
  };

  readonly serverboiService: ServerBoiService
  readonly serverCardService: ServerCardService

  constructor(options: ListServerCommandOptions) {
    super();
    this.serverboiService = options.serverboiService;
    this.serverCardService = options.serverCardService;
  }

  async enact(context: InteractionContext, interaction: any) {
    console.log("Enacting list server command");
    try {
      const servers = await this.serverboiService.listServers(context.user, interaction.guild_id);
      let serverBlobs: string[] = [];

      servers.forEach(async (server) => {
        // const card = await this.serverCardService.getCardFromServer(server.id!);
        const id = server.id?.split("-")[1];
        // const cardlink = card ? `https://discord.com/channels/${interaction.guild_id}/${card.channelId}/${card.messageId}` : "No card";
        serverBlobs.push(`> ${server.name} (${id})\n- Owner: <@${server.owner}>\n- Name: \`${server.name}\`\n- Application: \`${server.application}\`\n- Status: \`${server.status?.status}\``);
      });

      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: serverBlobs.join("\n\n"),
          flags: MessageFlags.Ephemeral,
          allowed_mentions: {
            users: []
          }
        }
      });
    } catch (e) {
      console.error(e);
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Unable to list servers for guild`,
          flags: MessageFlags.Ephemeral,
        }
      });
    }
  }
}