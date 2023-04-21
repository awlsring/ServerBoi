import { ButtonComponent, InteractionContext } from "@serverboi/discord-common";
import { InteractionResponseType } from "discord-api-types/v10";
import { AWSEC2ServerProviderInformationModal } from "./aws-ec2-provider-modal";
import { logger } from "@serverboi/common";

export class ResubmitAWSEC2ProviderInfoButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "ResubmitAWSEC2ProviderInfoButton"});
  public static readonly identifier = "resubmit-aws-ec2-provider-info-button";
  protected static readonly style = 1;
  protected static readonly label = "Resubmit";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.debug("Enacting resubmit AWS EC2 provider information button");
    context.response.send({
      type: InteractionResponseType.Modal,
      data: AWSEC2ServerProviderInformationModal.toApiData(),
    })
  }
}