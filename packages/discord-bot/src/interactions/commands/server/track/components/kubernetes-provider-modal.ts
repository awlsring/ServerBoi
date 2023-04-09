import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { ResubmitKubernetesProviderInfoButton } from "./resubmit-kubernetes-info-button";
import { ChannelSelectMenu } from "./channel-select-menu";

export interface KubernetesServerProviderInformationModalOptions {
  readonly requestRepo: TrackServerRequestRepo
}

export class KubernetesServerProviderInformationModal extends ModalComponent {
  public static readonly identifier = "track-server-kubernetes-provider-info";
  protected static readonly title = "Kubernetes Provider Information";
  protected static readonly textInputs = [
    {
      customId: "deployment",
      placeholder: "The deployment's name",
      label: "Deployment",
      style: 1,
      minLength: 1,
      maxLength: 128,
      required: true,
    },
    {
      customId: "namespace",
      placeholder: "The deployment's namespace",
      label: "Namespace",
      style: 1,
      minLength: 1,
      maxLength: 128,
      required: true,
    },
    {
      customId: "replicas",
      placeholder: "Amount of replicas for the deployment.",
      label: "Replicas",
      style: 1,
      minLength: 1,
      maxLength: 2,
      required: true,
    }
  ]

  private readonly requestRepo: TrackServerRequestRepo;

  constructor(options: KubernetesServerProviderInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let deployment: string | undefined = undefined
    let namespace: string | undefined = undefined
    let replicas: string | undefined = undefined
    let errorMessage = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case "deployment":
            deployment = c.value
            break;
          case "namespace":
            namespace = c.value
            break;
          case "replicas":
            replicas = c.value
            if  (isNaN(Number(replicas))) {
              errorMessage = `The replic amount must be a number, you gave \`${replicas}\``
            }
            break;
        }
      })
    })

    if (errorMessage) {
      context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: `Error validating the data: ${errorMessage}`,
          components: [
            {
              type: 1,
              components: [
                ResubmitKubernetesProviderInfoButton.toApiData()
              ],
            }
          ],
          flags: MessageFlags.Ephemeral,
        }
      });
      return
    }

    if (!deployment || !namespace || !replicas || !interaction.member) {
      context.logger.error("All required fields not provided.")
      return
    }

    context.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerServerIdentifier: deployment,
      providerServerData: JSON.stringify({
        namespace: namespace,
        replicaCount: replicas,
      })
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