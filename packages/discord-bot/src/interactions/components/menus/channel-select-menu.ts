import { Capabilities } from "@serverboi/client"
import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { SteamServerEmbed } from "@serverboi/discord-common"
import { ServerCardRepo } from "@serverboi/discord-common"
import { TrackServerRequestRepo } from "../../../persistence/track-server-request-repo"
import { ServerBoiService } from "@serverboi/discord-common"
import { InteractionContext } from "@serverboi/discord-common"
import { SelectMenuComponent } from "@serverboi/discord-common"

export interface ChannelSelectMenuOptions {
  readonly serverBoiService: ServerBoiService
  readonly trackServerDao: TrackServerRequestRepo
  readonly ServerCardRepo: ServerCardRepo
}

export class ChannelSelectMenu extends SelectMenuComponent {
  public static readonly identifier = "channel-select";
  protected static readonly selectType = ComponentType.ChannelSelect;
  protected static readonly channelTypes = [ChannelType.GuildText];
  protected static readonly placeholder = "Select channel";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly serverboi: ServerBoiService
  private readonly trackServerDao: TrackServerRequestRepo
  private readonly ServerCardRepo: ServerCardRepo

  constructor(options: ChannelSelectMenuOptions) {
    super()
    this.serverboi = options.serverBoiService
    this.trackServerDao = options.trackServerDao
    this.ServerCardRepo = options.ServerCardRepo
  }

  public async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]

    context.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    const finalizedRequest = await this.trackServerDao.update(interaction.message!.interaction!.id, {
      channelId: selectedValue
    })

    const server = await this.serverboi.trackServer({
      scope: interaction.guild_id,
      application: finalizedRequest.application,
      name: finalizedRequest.name,
      connectivity: {
        address: finalizedRequest.address,
        port: finalizedRequest.port,
      },
      capabilities: [ Capabilities.READ, Capabilities.QUERY ],
      query: {
        type: finalizedRequest.queryType,
        address: finalizedRequest.queryAddress,
        port: finalizedRequest.queryPort,
      }
    })
    console.log(`Server: ${JSON.stringify(server)}`)
    
    await context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Done, thanks!",
        components: [],
      },
      flags: MessageFlags.Ephemeral
    })
    console.log(`Sent response`)

    const serverId = server.id!.split("-")[1]

    const embed = new SteamServerEmbed({
      serverId: serverId,
      serverName: server.name!,
      status: server.status?.status!,
      address: server.connectivity?.address!,
      port: server.connectivity?.port!,
      steamPort: server.query?.port!,
      location: {
        city: server.location?.city!,
        country: server.location?.country!,
        region: server.location?.region!,
        emoji: server.location?.emoji!,
      },
      application: server.application!,
      players: server.status?.steam?.players!,
      maxPlayers: server.status?.steam?.maxPlayers!,
      owner: interaction.member?.user.username!,
      capabilities: [],
      provider: {
        name: "K8S",
        location: "DWS",
      }
    })
    console.log(`Created embed`)

    const message = await context.http.createMessage(selectedValue, embed.toMessage(false, false))

    await this.ServerCardRepo.create({
      messageId: message.id,
      serverId: server.id!,
      channelId: selectedValue,
      ownerId: finalizedRequest.ownerId,
    })
  }
}