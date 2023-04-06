import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "@serverboi/discord-common"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { ProviderType } from "@serverboi/client"
import { CreateProviderRequestRepo } from "../../../persistence/create-provider-request-repo"
import { KubernetesProviderInformationModal } from "../modals/k8s-info-modal"

export interface ProviderCreateMenuOptions {
  readonly createProviderRequestRepo: CreateProviderRequestRepo
}

export class ProviderCreateMenu extends SelectMenuComponent {
  public static readonly identifier = "provider-type-select";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly options = [
    {
      label: ProviderType.AWS,
      value: ProviderType.AWS,
      description: "AWS Cloud",
    },
    {
      label: "Kubernetes",
      value: ProviderType.KUBERNETES,
      description: "A Kubernetes cluster",
    },
  ];
  protected static readonly placeholder = "Select Provider type";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly createProviderRequestRepo: CreateProviderRequestRepo

  constructor(options: ProviderCreateMenuOptions) {
    super()
    this.createProviderRequestRepo = options.createProviderRequestRepo
  }

  async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    context.logger.info(`Selected values: ${selectedValue}`)

    switch (selectedValue) {
      case ProviderType.AWS:
        await context.response.send({
          type: InteractionResponseType.UpdateMessage,
          data: {
            content: "AWS is not implemented, please select a new option.",
            components: [
              ProviderCreateMenu.toApiData()
            ],
            flags: MessageFlags.Ephemeral,
          }
        })
        return
      case ProviderType.KUBERNETES:
        await context.response.send({
          type: InteractionResponseType.Modal,
          data: KubernetesProviderInformationModal.toApiData()
        })
        break;
      default:
        await context.response.send({
          type: InteractionResponseType.UpdateMessage,
          data: {
            content: "Invalid option when selecting provider.",
            components: [
              ProviderCreateMenu.toApiData()
            ],
            flags: MessageFlags.Ephemeral,
          }
        })
        return
    }

    context.logger.info(`Creating request ID ${interaction.message!.interaction!.id}`)
    await this.createProviderRequestRepo.create({
      id: interaction.message!.interaction!.id,
      providerType: selectedValue
    })
  }
}