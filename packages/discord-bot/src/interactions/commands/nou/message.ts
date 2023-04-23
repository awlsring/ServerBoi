import { APIMessageApplicationCommandInteraction, ApplicationCommandType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { CommandComponent } from "../command";
import { logger } from "@serverboi/common";
import { createNoU } from "./nous";

export class NoUMessageCommand extends CommandComponent {
  private readonly logger = logger.child({ name: "NoUMessageCommand"});
  public static readonly identifier = "reply no u";
  public static readonly data = {
    name: "reply no u",
    description: "",
    type: ApplicationCommandType.Message,
  };

  constructor(private readonly appId: string) {
    super();
  }

  async enact(context: InteractionContext, interaction: APIMessageApplicationCommandInteraction) {
    this.logger.debug("Enacting no u message command");
    this.logger.debug(JSON.stringify(interaction.data));

    let messageId = interaction.data.target_id;
    let channel = interaction.data.resolved.messages[messageId].channel_id;

    let message = `${createNoU(interaction.data.resolved.messages[messageId].author.id)}.`

    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `I've no u'ed that message`,
        flags: MessageFlags.Ephemeral,
      }
    });

    await context.http.replyToMessage(channel, messageId, {
      content: message,
    });
  }
}