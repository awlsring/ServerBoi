import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo";
import { KubernetesProviderAuthPromptButton } from "./k8s-auth-prompt";
import { logger } from "@serverboi/common";

const PROVIDER_ENDPOINT = "kubernetes-provider-endpoint";

export interface KubernetesProviderInformationModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
}

export class KubernetesProviderInformationModal extends ModalComponent {
  private readonly logger = logger.child({ name: "KubernetesProviderInformationModal"});
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
    this.logger.debug("Enacting Kubernetes provider information modal");
    this.logger.debug(`Interaction data: ${interaction.data}`)
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
        content: `To access your cluster, you'll need to provide an access token that is tied to a ServiceAccount that can describe deployments in the cluster.

Below is a sample manifest you can deploy to your cluster that will create resources needed to access the cluster.

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: serverboi-role
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: serverboi-role-role
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete", "scale"]
- apiGroups: ["apps"]
  resources: ["deployments/status"]
  verbs: ["get", "watch"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: serverboi-role-binding
subjects:
- kind: ServiceAccount
  name: serverboi-role
  namespace: default
roleRef:
  kind: ClusterRole
  name: serverboi-role-role
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: v1
kind: Secret
type: kubernetes.io/service-account-token
metadata:
  name: serverboi-role
  annotations:
    kubernetes.io/service-account.name: "serverboi-role"
\`\`\`

Once these resources are created in your cluster, you can access the token running the following command:

\`\`\`shell
kubectl get secret serverboi-role -o jsonpath='{.data.token}' | base64 -d
\`\`\`

One you have the token, you can enter it by hitting the button below.
`,
        // content: "You'll need to provide a token from a ServiceAccount that can describe deployments in the cluster.",
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
