import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo"
import { InteractionContext } from "@serverboi/discord-common"
import { SteamQueryInformationModal } from "./steam-query-info"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { HTTPQueryInformationModal } from "./http-query-info"
import { ChannelSelectMenu } from "./channel-select-menu"
import { logger } from "@serverboi/common"

export interface QuerySelectMenuOptions {
  readonly trackServerDao: TrackServerRequestRepo
}

export class QuerySelectMenu extends SelectMenuComponent {
  private readonly logger = logger.child({ name: "QuerySelectMenu" });
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
    this.logger.debug("Enacting query select menu")
    this.logger.debug(`Interaction: ${JSON.stringify(interaction.data)}`)
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    this.logger.info(`Selected values: ${selectedValue}`)

    this.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    await this.trackServerDao.update(interaction.message!.interaction!.id, {
      queryType: selectedValue
    })

    switch (selectedValue) {
      case "STEAM":
        this.logger.info("Sending steam query information modal")
        let response = {
          type: InteractionResponseType.Modal,
          data: SteamQueryInformationModal.toApiData()
        }
        await context.response.send(response)
        break;
      case "HTTP":
        this.logger.info("Sending HTTP query information modal")
        await context.response.send({
          type: InteractionResponseType.Modal,
          data: HTTPQueryInformationModal.toApiData()
        })
        break;
      default:
        this.logger.info("Sending channel select menu")
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
        break;
    }
  }
}