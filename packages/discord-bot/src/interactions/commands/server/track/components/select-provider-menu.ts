import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext, SelectMenuComponent, ServerBoiService } from "@serverboi/discord-common";
import { ProviderSubtype, ProviderSummary, ProviderType } from "@serverboi/client";
import { KubernetesServerProviderInformationModal } from "./kubernetes-provider-modal";
import { ChannelSelectMenu } from "./channel-select-menu";
import { AWSEC2ServerProviderInformationModal } from "./aws-ec2-provider-modal";
import { HetznerServerProviderInformationModal } from "./hetzner-provider-modal";
import { logger } from "@serverboi/common";

export interface TrackServerSelectProviderOptions {
  readonly trackServerDao: TrackServerRequestRepo
  readonly serverboiService: ServerBoiService
}

// consider making a base "dynamic provider" class for this and provider-list.ts
export class TrackServerSelectProvider extends SelectMenuComponent {
  private readonly logger = logger.child({ name: "TrackServerSelectProvider" });
  public static readonly identifier = "track-server-provider-select";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly placeholder = "Select a provider";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly trackServerDao: TrackServerRequestRepo
  private readonly serverboi: ServerBoiService

  constructor(options: TrackServerSelectProviderOptions) {
    super()
    this.trackServerDao = options.trackServerDao
    this.serverboi = options.serverboiService
  }

  static toApiDataWithProviders(providers: ProviderSummary[]) {
    const options = providers?.map((provider) => {
      return {
        label: provider.name!,
        value: provider.name!,
        description: `A ${provider.type!.toLocaleLowerCase()} provider`,
      }
    })

    // add None option
    options.push({
      label: "None",
      value: "None",
      description: "Use no provider"
    })

    return {
      type: 1,
      components: [
        {
          type: this.selectType.valueOf(),
          custom_id: this.identifier,
          options: options,
          channel_types: this.channelTypes,
          placeholder: this.placeholder,
          min_values: this.minSelectableValues,
          max_values: this.maxSelectableValues
        }
      ]
    }
  }

  async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    this.logger.debug("Enacting TrackServerSelectProvider");
    this.logger.debug(`Interaction data: ${interaction.data}`)
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    this.logger.info(`Selected values: ${selectedValue}`)

    if (selectedValue === "None") {
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
      return
    }

    this.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    await this.trackServerDao.update(interaction.message!.interaction!.id, {
      provider: selectedValue
    })

    try {
      const provider = await this.serverboi.getProvider(context.user, selectedValue)

      switch (provider.type) {
        case ProviderType.KUBERNETES:
          await context.response.send(KubernetesServerProviderInformationModal.toResponse())
          break;
        case `${ProviderType.AWS}-${ProviderSubtype.EC2}`:
          await context.response.send(AWSEC2ServerProviderInformationModal.toResponse())
          break;
        case ProviderType.HETZNER:
          await context.response.send(HetznerServerProviderInformationModal.toResponse())
        default:
          throw new Error("Provider type not supported")
      }

    } catch (e) {
      this.logger.error(e)
      await context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "The provider you selected is not available. Please try tracking this server again later.",
          components: [],
          flags: MessageFlags.Ephemeral,
        }
      })
      return
    }
  }
}