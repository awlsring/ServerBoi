import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { ChannelSelectMenu } from "./channel-select-menu";
import { TrackServerSelectProvider } from "./select-provider-menu";
import { logger } from "@serverboi/common";

export interface HTTPQueryInformationModalOptions {
  readonly trackServerDao: TrackServerRequestRepo
  readonly serverboiService: ServerBoiService
}

export class HTTPQueryInformationModal extends ModalComponent {
  private readonly logger = logger.child({ name: "HTTPQueryInformationModal" });
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

  private readonly serverboiService: ServerBoiService;

  private readonly requestDao: TrackServerRequestRepo;

  constructor(options: HTTPQueryInformationModalOptions) {
    super()
    this.requestDao = options.trackServerDao
    this.serverboiService = options.serverboiService
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    this.logger.debug("Enacting HTTP query information modal");
    this.logger.debug(`Interaction data: ${interaction.data}`)
    
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

    const providers = await this.serverboiService.listProviders(context.user)

    if (providers.length === 0) {
      context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "You have no configured provider so one will not be assigned to this server.\n\nSelect the channel to send the server information to.",
          components: [
            ChannelSelectMenu.toApiData()
          ],
          flags: MessageFlags.Ephemeral,
        }
      });
      return
    }

    context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Select the provider you want to use to track this server.",
        components: [
          TrackServerSelectProvider.toApiDataWithProviders(providers)
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}
