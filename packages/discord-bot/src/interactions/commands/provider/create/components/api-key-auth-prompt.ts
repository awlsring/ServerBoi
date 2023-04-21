import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "@serverboi/discord-common";
import { ButtonComponent } from "@serverboi/discord-common";
import { APIKeyAuthInformationModal } from "./api-key-info-modal";
import { logger } from "@serverboi/common";

export class APIKeyAuthPromptButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "APIKeyAuthPromptButton"});
  public static readonly identifier = "api-key-auth-prompt-button";
  protected static readonly style = 1;
  protected static readonly label = "Enter Key";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.info("Enacting API key auth prompt button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: APIKeyAuthInformationModal.toApiData(),
    })
  }
}
