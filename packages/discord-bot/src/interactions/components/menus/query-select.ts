import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { TrackServerRequestDao } from "../../../persistence/track-server-request/dao"
import { InteractionContext } from "../../context"
import { SteamQueryInformationModal } from "../modals/steam-query-info"
import { ChannelSelectMenu } from "./channel-select-menu"
import { SelectMenuComponent } from "./menu"

export interface QuerySelectMenuOptions {
  readonly trackServerDao: TrackServerRequestDao
}

export class QuerySelectMenu extends SelectMenuComponent {
  public static readonly identifier = "query-select";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly options = [
    {
      label: "Steam",
      value: "STEAM",
      description: "Steam source query",
    },
    {
      label: "HTTP",
      value: "HTTP",
      description: "HTTP query",
    },
    {
      label: "None",
      value: "NONE",
      description: "Do not query the server",
    },
  ];
  protected static readonly placeholder = "Select server query type";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly trackServerDao: TrackServerRequestDao

  constructor(options: QuerySelectMenuOptions) {
    super()
    this.trackServerDao = options.trackServerDao
  }

  async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    context.logger.info(`Selected values: ${selectedValue}`)

    context.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    await this.trackServerDao.update(interaction.message!.interaction!.id, {
      queryType: selectedValue
    })
    
    if (selectedValue == "STEAM") {
      let response = {
        type: InteractionResponseType.Modal,
        data: SteamQueryInformationModal.toApiData()
      }
      await context.response.send(response)
    } else {
      await context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "Select the channel to send the server information to.",
          components: [
            ChannelSelectMenu.toApiData()
          ],
          flags: MessageFlags.Ephemeral,
        }
      })
    }
  }
}