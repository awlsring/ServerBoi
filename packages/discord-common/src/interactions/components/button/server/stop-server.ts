import { APIMessageComponentButtonInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { ServerCardRepo } from "../../../../persistence/server-card-repo";
import { ServerBoiService } from "../../../../service/serverboi";
import { InteractionContext } from "../../../context";
import { ServerButton, ServerButtonOptions } from "./server-button";

export class StopServerButton extends ServerButton {
  public static readonly identifier = "server-action-stop";
  protected static readonly style = 4;
  protected static readonly label = "Stop";

  private readonly serverboi: ServerBoiService
  private readonly serverCardRepo: ServerCardRepo

  constructor(options: ServerButtonOptions) {
    super()
    this.serverboi = options.serverBoiService
    this.serverCardRepo = options.ServerCardRepo
  }

  public async enact(context: InteractionContext, interaction: APIMessageComponentButtonInteraction) {
    const card = await this.serverCardRepo.findByMessageId(interaction.message.id)

    if (!this.isUserAuthorized(context.user, card!.ownerId, card!.admins ?? [])) {
      return await this.unauthorizedResponse(context)
    }

    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Not implemented",
        flags: MessageFlags.Ephemeral,
      }
    })
  }
}
