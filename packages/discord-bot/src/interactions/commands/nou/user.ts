import { APIUserApplicationCommandInteraction, ApplicationCommandType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { CommandComponent } from "../command";
import { logger } from "@serverboi/common";
import { createNoU } from "./nous";

export class NoUUserCommand extends CommandComponent {
  private readonly logger = logger.child({ name: "NoUUserCommand"});
  public static readonly identifier = "say no u";
  public static readonly data = {
    name: "say no u",
    description: "",
    type: ApplicationCommandType.User,
  };

  constructor(private readonly appId: string) {
    super();
  }

  async enact(context: InteractionContext, interaction: APIUserApplicationCommandInteraction) {
    this.logger.debug("Enacting no u user command");
    this.logger.debug(JSON.stringify(interaction.data));

    let target = interaction.data.target_id;
    let message = `<@${interaction.member?.user.id}> wanted me to let you know,`;
    if (interaction.data.target_id === this.appId) {
      target = interaction.member?.user.id ?? "";
      message = "Me?";
    }

    message = `${message} ${createNoU(interaction.data.target_id)}.`

    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `I've no u'ed <@${interaction.data.target_id}>`,
        flags: MessageFlags.Ephemeral,
      }
    });

    await context.http.messageUser(target, {
      content: message,
    });
  }
}