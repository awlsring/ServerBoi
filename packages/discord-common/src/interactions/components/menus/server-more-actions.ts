import { APIMessageComponentSelectMenuInteraction, APISelectMenuOption, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { ServerEmbedMoreActions } from "../../../embeds/server-embed"
import { ServerCardRepo } from "../../../persistence/server-card-repo"
import { ServerCardService } from "../../../service/server-card"
import { ServerBoiService } from "../../../service/serverboi"
import { InteractionContext } from "../../context"
import { SelectMenuComponent } from "./menu"

export interface ServerMoreActionsMenuOptions {
  readonly serverBoiService: ServerBoiService
  readonly serverCardService: ServerCardService
}

export class ServerMoreActionsMenu extends SelectMenuComponent {
  public static readonly identifier = "server-action-more";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly placeholder = "Actions";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly serverboi: ServerBoiService
  private readonly cardService: ServerCardService

  constructor(options: ServerMoreActionsMenuOptions) {
    super()
    this.serverboi = options.serverBoiService
    this.cardService = options.serverCardService
  }

  static toApiDataWithOptions(options: ServerEmbedMoreActions[]) {
    const opts: APISelectMenuOption[] = []

    options.forEach((option) => {
      switch (option) {
        case ServerEmbedMoreActions.Remove:
          opts.push({
            label: `Remove`,
            value: `remove`,
            description: `Stop tracking server`,
            default: false
          })
          break
        default:
          break
      }
    })

    return {
      type: this.selectType.valueOf(),
      custom_id: this.identifier,
      options: opts,
      channel_types: this.channelTypes,
      placeholder: this.placeholder,
      min_values: this.minSelectableValues,
      max_values: this.maxSelectableValues
    }
  }

  private isUserAuthorized(callerId: string, ownerId: string, admins: string[]): boolean {
    return callerId === ownerId || admins.includes(callerId)
  }

  private async unauthorizedResponse(context: InteractionContext) {
    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "You aren't authorized to perform actions on this server.",
        flags: MessageFlags.Ephemeral,
      }
    })
  }

  private async runRemove(context: InteractionContext, interaction: any) {
    console.log("Running remove")
    try {
      const card = await this.cardService.getCardFromMessage(interaction.message.id);
      await this.serverboi.untrackServer(context.user, card.serverId);
      await this.cardService.deleteCard({ serverId: card.serverId });
      console.log("Removed server")
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Removed server \`${card.serverId.split("-")[1]}\``,
          flags: MessageFlags.Ephemeral,
        }
      });
    } catch (e) {
      console.error(e);
      await context.response.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Unable to remove server.`,
          flags: MessageFlags.Ephemeral,
        }
      });
    }
  }

  public async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const card = await this.cardService.getCardFromMessage(interaction.message.id)
    
    const selectedValue = interaction.data.values[0]

    if (!this.isUserAuthorized(context.user, card!.ownerId, card!.admins ?? [])) {
      return await this.unauthorizedResponse(context)
    }

    switch (selectedValue) {
      case "remove":
        return await this.runRemove(context, interaction)
      default:
        await context.response.send({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Not implemented",
            flags: MessageFlags.Ephemeral,
          }
        })
      }
  }
}