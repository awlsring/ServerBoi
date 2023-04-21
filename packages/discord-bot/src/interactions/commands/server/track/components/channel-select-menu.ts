import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { ServerCardService } from "@serverboi/discord-common"
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo"
import { ServerBoiService } from "@serverboi/discord-common"
import { InteractionContext } from "@serverboi/discord-common"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { logger } from "@serverboi/common"

export interface ChannelSelectMenuOptions {
  readonly serverBoiService: ServerBoiService
  readonly trackServerDao: TrackServerRequestRepo
  readonly serverCardService: ServerCardService
}

export class ChannelSelectMenu extends SelectMenuComponent {
  private readonly logger = logger.child({ name: "ChannelSelectMenu" });
  public static readonly identifier = "channel-select";
  protected static readonly selectType = ComponentType.ChannelSelect;
  protected static readonly channelTypes = [ChannelType.GuildText];
  protected static readonly placeholder = "Select channel";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly serverboi: ServerBoiService
  private readonly trackServerDao: TrackServerRequestRepo
  private readonly serverCardService: ServerCardService

  constructor(options: ChannelSelectMenuOptions) {
    super()
    this.serverboi = options.serverBoiService
    this.trackServerDao = options.trackServerDao
    this.serverCardService = options.serverCardService
  }

  public async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    this.logger.debug("Enacting channel select menu")
    this.logger.debug(`Interaction: ${JSON.stringify(interaction.data)}`)
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]

    this.logger.debug(`Updating request ID ${interaction.message!.interaction!.id}`)
    const finalizedRequest = await this.trackServerDao.update(interaction.message!.interaction!.id, {
      channelId: selectedValue
    })

    const server = await this.serverboi.trackServer(context.user, {
      scope: interaction.guild_id,
      application: finalizedRequest.application,
      name: finalizedRequest.name,
      connectivity: {
        address: finalizedRequest.address,
        port: finalizedRequest.port,
      },
      provider: finalizedRequest.provider,
      providerServerData: finalizedRequest.provider ? {
        identifier: finalizedRequest.providerServerIdentifier,
        location: finalizedRequest.providerServerLocation,
        data: finalizedRequest.providerServerData ? JSON.parse(finalizedRequest.providerServerData) : undefined,
      } : undefined,
      capabilities: finalizedRequest.capabilities,
      query: {
        type: finalizedRequest.queryType,
        address: finalizedRequest.queryAddress,
        port: finalizedRequest.queryPort,
      }
    })
    this.logger.debug(`Server: ${JSON.stringify(server)}`)
    
    await context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Done, thanks!",
        components: [],
      },
      flags: MessageFlags.Ephemeral
    })
    this.logger.debug(`Sent response`)

    await this.serverCardService.createCard(selectedValue, server)
  }
}