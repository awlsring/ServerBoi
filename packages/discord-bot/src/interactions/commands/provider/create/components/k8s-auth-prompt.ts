import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "@serverboi/discord-common";
import { ButtonComponent } from "@serverboi/discord-common";
import { KubernetesProviderAuthInformationModal } from "./k8s-auth-modal";
import { logger } from "@serverboi/common";

export class KubernetesProviderAuthPromptButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "KubernetesProviderAuthPromptButton"});
  public static readonly identifier = "k8s-provider-auth-prompt-button";
  protected static readonly style = 1;
  protected static readonly label = "Enter Token";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.info("Enacting Kubernetes provider auth prompt button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: KubernetesProviderAuthInformationModal.toApiData(),
    })
  }
}
