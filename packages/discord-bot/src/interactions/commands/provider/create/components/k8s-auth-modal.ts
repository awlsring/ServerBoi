import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo";
import { CreateProviderNameInputPromptButton } from "./name-prompt-modal";

const PROVIDER_AUTH = "kubernetes-provider-auth";

export interface KubernetesProviderAuthInformationModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
}

export class KubernetesProviderAuthInformationModal extends ModalComponent {
  private readonly requestRepo: CreateProviderRequestRepo;
  public static readonly identifier = "k8s-provider-auth-info";
  protected static readonly title = "Kubernetes Provider Auth Information";
  protected static readonly textInputs = [
    {
      customId: PROVIDER_AUTH,
      placeholder: "Service Account token.",
      label: "Service Account Token",
      style: 1,
      minLength: 12,
      maxLength: 512,
      required: true,
    }
  ]

  constructor(options: KubernetesProviderAuthInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let token: string | undefined = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case PROVIDER_AUTH:
            token = c.value
            break;
        }
      })
    })

    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerAuthKey: token
    })

    context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "All the information needed has been collected, new we can create your provider! Give it a name.",
        components: [
          {
            type: 1,
            components: [
              CreateProviderNameInputPromptButton.toApiData()
            ],
          }
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}
