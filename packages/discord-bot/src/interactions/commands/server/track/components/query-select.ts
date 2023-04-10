import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo"
import { InteractionContext } from "@serverboi/discord-common"
import { SteamQueryInformationModal } from "./steam-query-info"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { HTTPQueryInformationModal } from "./http-query-info"
import { CapabilitySelectMenu } from "./set-capabilities"

export interface QuerySelectMenuOptions {
  readonly trackServerDao: TrackServerRequestRepo
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

  private readonly trackServerDao: TrackServerRequestRepo

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

    switch (selectedValue) {
      case "STEAM":
        let response = {
          type: InteractionResponseType.Modal,
          data: SteamQueryInformationModal.toApiData()
        }
        await context.response.send(response)
        break;
      case "HTTP":
        await context.response.send({
          type: InteractionResponseType.Modal,
          data: HTTPQueryInformationModal.toApiData()
        })
        break;
      default:
        await context.response.send({
          type: InteractionResponseType.UpdateMessage,
          data: {
            content: "Select the channel to send the server information to.",
            components: [
              CapabilitySelectMenu.toApiData()
            ],
            flags: MessageFlags.Ephemeral,
          }
        })
        break;
    }
  }
}