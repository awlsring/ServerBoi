import { ButtonComponent, InteractionContext } from "@serverboi/discord-common";
import { InteractionResponseType } from "discord-api-types/v10";
import { HetznerServerProviderInformationModal } from "./hetzner-provider-modal";
import { logger } from "@serverboi/common";

export class ResubmitHetznerProviderInfoButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "ResubmitHetznerProviderInfoButton"});
  public static readonly identifier = "resubmit-hetzner-provider-info-button";
  protected static readonly style = 1;
  protected static readonly label = "Resubmit";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.debug("Enacting resubmit Hetzner provider information button");
    context.response.send({
      type: InteractionResponseType.Modal,
      data: HetznerServerProviderInformationModal.toApiData(),
    })
  }
}