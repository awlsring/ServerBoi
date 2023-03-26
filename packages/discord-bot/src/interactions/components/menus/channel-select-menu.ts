import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, APISelectMenuOption, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { ServerCardDao } from "../../../persistence/server-card/dao"
import { TrackServerRequestDao } from "../../../persistence/track-server-request/dao"
import { ServerBoiService } from "../../../service/serverboi"
import { InteractionContext } from "../../context"
import { SelectMenuComponent } from "./menu"

export interface ChannelSelectMenuOptions {
  readonly serverBoiService: ServerBoiService
  readonly trackServerDao: TrackServerRequestDao
  readonly serverCardDao: ServerCardDao
}

export class ChannelSelectMenu extends SelectMenuComponent {
  public static readonly identifier = "channel-select";
  protected static readonly selectType = ComponentType.ChannelSelect;
  protected static readonly channelTypes = [ChannelType.GuildText];
  protected static readonly placeholder = "Select channel";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly serverboi: ServerBoiService
  private readonly trackServerDao: TrackServerRequestDao
  private readonly serverCardDao: ServerCardDao

  constructor(options: ChannelSelectMenuOptions) {
    super()
    this.serverboi = options.serverBoiService
    this.trackServerDao = options.trackServerDao
    this.serverCardDao = options.serverCardDao
  }

  public async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    console.log(`Selected value: ${selectedValue}`)

    console.log(`Updating request ID ${interaction.message!.interaction!.id}`)
    await context.trackServerDao.update(interaction.message!.interaction!.id, {
      channelId: selectedValue
    })

    // const response = await this.serverboi.trackServer({
    //   id: interaction.message!.interaction!.id,
    // })


    await context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Done, thanks!",
        components: [],
      },
      flags: MessageFlags.Ephemeral
    })
  }

}

let c = ChannelSelectMenu.toApiData()