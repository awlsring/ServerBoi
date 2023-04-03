import { APIMessageComponentSelectMenuInteraction, APISelectMenuOption, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { ServerEmbedMoreActions } from "../../../embeds/server-embed"
import { ServerCardRepo } from "../../../persistence/server-card-repo"
import { ServerBoiService } from "../../../service/serverboi"
import { InteractionContext } from "../../context"
import { SelectMenuComponent } from "./menu"

export interface ServerMoreActionsMenuOptions {
  readonly serverBoiService: ServerBoiService
  readonly ServerCardRepo: ServerCardRepo
}

export class ServerMoreActionsMenu extends SelectMenuComponent {
  public static readonly identifier = "server-action-more";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly placeholder = "Actions";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly serverboi: ServerBoiService
  private readonly serverCardRepo: ServerCardRepo

  constructor(options: ServerMoreActionsMenuOptions) {
    super()
    this.serverboi = options.serverBoiService
    this.serverCardRepo = options.ServerCardRepo
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

  public async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const card = await this.serverCardRepo.findById(interaction.message.id)

    if (!this.isUserAuthorized(context.user, card!.ownerId, card!.admins ?? [])) {
      return await this.unauthorizedResponse(context)
    }
    
    await context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Not implemented",
        flags: MessageFlags.Ephemeral,
      }
    })
  }
}