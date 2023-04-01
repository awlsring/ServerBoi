import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { ResubmitQueryButton } from "../button/resubmit-steam-query";
import { ChannelSelectMenu } from "../menus/channel-select-menu";
import { ModalComponent } from "@serverboi/discord-common";

export interface SteamQueryInformationModalOptions {
  readonly trackServerDao: TrackServerRequestRepo
}

export class SteamQueryInformationModal extends ModalComponent {
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
      required: true,
    },
  ]

  private readonly requestDao: TrackServerRequestRepo;

  constructor(options: SteamQueryInformationModalOptions) {
    super()
    this.requestDao = options.trackServerDao
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
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
