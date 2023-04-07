import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { ChannelSelectMenu } from "./channel-select-menu";
import { ModalComponent } from "@serverboi/discord-common";

export interface HTTPQueryInformationModalOptions {
  readonly trackServerDao: TrackServerRequestRepo
}

export class HTTPQueryInformationModal extends ModalComponent {
  public static readonly identifier = "http-query-info";
  protected static readonly title = "HTTP Query Information";
  protected static readonly textInputs = [
    {
      customId: "http-query-address",
      placeholder: "Address to run health check on. Leave blank if this should be the same as the previous address",
      label: "HTTP Query Address",
      style: 1,
      minLength: 3,
      maxLength: 128,
      required: false,
    }
  ]

  private readonly requestDao: TrackServerRequestRepo;

  constructor(options: HTTPQueryInformationModalOptions) {
    super()
    this.requestDao = options.trackServerDao
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let queryAddress: string | undefined = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case "http-query-address":
            queryAddress = c.value
            break;
        }
      })
    })

    await this.requestDao.update(interaction.message!.interaction!.id, {
      queryAddress: queryAddress,
    })

    context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Select the channel to send the server information to.",
        components: [
          ChannelSelectMenu.toApiData()
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}
