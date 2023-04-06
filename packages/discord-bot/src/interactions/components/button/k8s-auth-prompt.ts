import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "@serverboi/discord-common";
import { ButtonComponent } from "@serverboi/discord-common";
import { KubernetesProviderAuthInformationModal } from "../modals/k8s-auth-modal";

export class KubernetesProviderAuthPromptButton extends ButtonComponent {
  public static readonly identifier = "k8s-provider-auth-prompt-button";
  protected static readonly style = 1;
  protected static readonly label = "Enter Token";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    context.logger.info("Enacting start track server button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: KubernetesProviderAuthInformationModal.toApiData(),
    })
  }
}
