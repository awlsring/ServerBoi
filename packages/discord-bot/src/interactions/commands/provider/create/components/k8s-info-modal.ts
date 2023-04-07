import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo";
import { KubernetesProviderAuthInformationModal } from "./k8s-auth-modal";
import { KubernetesProviderAuthPromptButton } from "./k8s-auth-prompt";

const PROVIDER_ENDPOINT = "kubernetes-provider-endpoint";

export interface KubernetesProviderInformationModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
}

export class KubernetesProviderInformationModal extends ModalComponent {
  public static readonly identifier = "k8s-provider-info";
  protected static readonly title = "Kubernetes Provider Information";
  protected static readonly textInputs = [
    {
      customId: PROVIDER_ENDPOINT,
      placeholder: "Endpoint to connect to cluster on.",
      label: "Cluster Endpoint",
      style: 1,
      minLength: 6,
      maxLength: 128,
      required: true,
    }
  ]

  private readonly requestRepo: CreateProviderRequestRepo;

  constructor(options: KubernetesProviderInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let endpoint: string | undefined = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case PROVIDER_ENDPOINT:
            endpoint = c.value
            break;
        }
      })
    })

    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerData: JSON.stringify({ "endpoint": endpoint })},
    )

    await context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "You'll need to provide a token from a ServiceAccount that can describe deployments in the cluster.",
        components: [
          {
            type: 1,
            components: [
              KubernetesProviderAuthPromptButton.toApiData()
            ],
          }
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}
