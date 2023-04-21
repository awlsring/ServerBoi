import { ButtonComponent, InteractionContext } from "@serverboi/discord-common";
import { InteractionResponseType } from "discord-api-types/v10";
import { KubernetesServerProviderInformationModal } from "./kubernetes-provider-modal";
import { logger } from "@serverboi/common";

export class ResubmitKubernetesProviderInfoButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "ResubmitKubernetesProviderInfoButton"});
  public static readonly identifier = "resubmit-kubernetets-provider-info-button";
  protected static readonly style = 1;
  protected static readonly label = "Resubmit";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.debug("Enacting resubmit Kubernetes provider information button");
    context.response.send({
      type: InteractionResponseType.Modal,
      data: KubernetesServerProviderInformationModal.toApiData(),
    })
  }
}