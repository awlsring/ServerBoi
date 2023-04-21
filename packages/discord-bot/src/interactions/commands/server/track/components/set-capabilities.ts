import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo"
import { InteractionContext } from "@serverboi/discord-common"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { Capabilities } from "@serverboi/client"
import { ChannelSelectMenu } from "./channel-select-menu"
import { logger } from "@serverboi/common"

export interface QuerySelectMenuOptions {
  readonly trackServerDao: TrackServerRequestRepo
}

export class CapabilitySelectMenu extends SelectMenuComponent {
  private readonly logger = logger.child({ name: "CapabilitySelectMenu" });
  public static readonly identifier = "capabilites-select";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly options = [
    {
      label: "Start",
      value: Capabilities.START,
      description: "Allow server start",
    },
    {
      label: "Stop",
      value: Capabilities.STOP,
      description: "Allow server stop",
    },
    {
      label: "Reboot",
      value: Capabilities.REBOOT,
      description: "Allow server reboot",
    },
  ];
  protected static readonly placeholder = "Select server capabilities";
  protected static readonly minSelectableValues = 0;
  protected static readonly maxSelectableValues = 3;

  private readonly trackServerDao: TrackServerRequestRepo

  constructor(options: QuerySelectMenuOptions) {
    super()
    this.trackServerDao = options.trackServerDao
  }

  async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    this.logger.debug("Enacting query select menu")
    this.logger.debug(`Interaction: ${JSON.stringify(interaction.data)}`)
    const selectedValues = (interaction.data as APIMessageSelectMenuInteractionData).values
    this.logger.info(`Selected values: ${selectedValues}`)

    const capabilities: Capabilities[] = []

    for (const selectedValue of selectedValues) {
      capabilities.push(selectedValue as Capabilities)
    }

    this.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    await this.trackServerDao.update(interaction.message!.interaction!.id, {
      capabilities: capabilities
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