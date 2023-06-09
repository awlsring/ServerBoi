import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common";
import { ResubmitQueryButton } from "./resubmit-steam-query";
import { ModalComponent } from "@serverboi/discord-common";
import { TrackServerSelectProvider } from "./select-provider-menu";
import { ChannelSelectMenu } from "./channel-select-menu";
import { logger } from "@serverboi/common";

export interface SteamQueryInformationModalOptions {
  readonly trackServerDao: TrackServerRequestRepo
  readonly serverboiService: ServerBoiService
}

export class SteamQueryInformationModal extends ModalComponent {
  private readonly logger = logger.child({ name: "SteamQueryInformationModal" });
  public static readonly identifier = "steam-query-info";
  protected static readonly title = "Steam Query Information";
  protected static readonly textInputs = [
    {
      customId: "steam-query-address",
      placeholder: "Steam Query Address. Leave blank if this should be the same as the previous address",
      label: "Steam Query Address",
      style: 1,
      minLength: 1,
      maxLength: 64,
      required: false,
    },
    {
      customId: "steam-query-port",
      placeholder: "The port to query server information on.",
      label: "Query Port",
      style: 1,
      minLength: 1,
      maxLength: 5,
      required: false,
    },
  ]

  private readonly requestDao: TrackServerRequestRepo;
  private readonly serverboiService: ServerBoiService;

  constructor(options: SteamQueryInformationModalOptions) {
    super()
    this.requestDao = options.trackServerDao
    this.serverboiService = options.serverboiService
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    this.logger.debug("Enacting Steam query information modal");
    this.logger.debug(`Interaction data: ${interaction.data}`)
    let steamQueryAddress: string | undefined = undefined
    let steamQueryPort: string | undefined = undefined
    let errorMessage = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case "steam-query-address":
            steamQueryAddress = c.value
            break;
          case "steam-query-port":
            steamQueryPort = c.value
            if  (!isNaN(Number(steamQueryPort))) {
              if (Number(steamQueryPort) < 1 || Number(steamQueryPort) > 65535) {
                errorMessage = "The port must be between 1 and 65535"
              }
            } else {
              errorMessage = `The port must be a number, you gave \`${steamQueryPort}\``
            }
            break;
        }
      })
    })
    
    if (errorMessage) {
      this.logger.debug(`Error validating the data: ${errorMessage}`)
      context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: `Error validating the data: ${errorMessage}`,
          components: [
            {
              type: 1,
              components: [
                ResubmitQueryButton.toApiData()
              ],
            }
          ],
          flags: MessageFlags.Ephemeral,
        }
      });
      return
    }

    await this.requestDao.update(interaction.message!.interaction!.id, {
      queryPort: Number(steamQueryPort),
      queryAddress: steamQueryAddress,
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
