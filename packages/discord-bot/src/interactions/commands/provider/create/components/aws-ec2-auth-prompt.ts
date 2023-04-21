import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "@serverboi/discord-common";
import { ButtonComponent } from "@serverboi/discord-common";
import { AWSProviderAuthInformationModal } from "./aws-ec2-auth-info-modal";
import { logger } from "@serverboi/common";

export class AWSProviderAuthPromptButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "AWSProviderAuthPromptButton"});
  public static readonly identifier = "aws-provider-auth-prompt-button";
  protected static readonly style = 1;
  protected static readonly label = "Enter Keys";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.info("Enacting AWS provider auth prompt button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: AWSProviderAuthInformationModal.toApiData(),
    })
  }
}
