import { ServerButton, ServerButtonOptions } from "./server-button";
import { APIMessageComponentButtonInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { ServerCardRepo } from "../../../../persistence/server-card-repo";
import { ServerBoiService } from "../../../../service/serverboi";
import { InteractionContext } from "../../../context";

export class StartServerButton extends ServerButton {
  public static readonly identifier = "server-action-start";
  protected static readonly style = 1;
  protected static readonly label = "Start";

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

    let message = "Unable to send request, try again later"

    if (card) {
      await this.serverboi.startServer(card.ownerId, card.serverId)
      let serverShortId = card.serverId.split("-")[1]
      message = `Starting server ${serverShortId}`
    }

    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: message,
        flags: MessageFlags.Ephemeral,
      }
    })
  }
}
