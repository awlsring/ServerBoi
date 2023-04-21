import { InteractionResponseType } from "discord-interactions";
import { InteractionContext } from "@serverboi/discord-common";
import { ButtonComponent } from "@serverboi/discord-common";
import { CreateProviderNameInputModal } from "./provider-name-input";
import { logger } from "@serverboi/common";

export class CreateProviderNameInputPromptButton extends ButtonComponent {
  private readonly logger = logger.child({ name: "CreateProviderNameInputPromptButton"});
  public static readonly identifier = "provider-name-prompt-button";
  protected static readonly style = 1;
  protected static readonly label = "Enter Name";
  protected static readonly emojii = {
    name: "📡",
    id: "89379871234567890",
    animated: false,
  };

  public async enact(context: InteractionContext, _: any) {
    this.logger.info("Enacting provider name input prompt button");
    context.response.send({
      type: InteractionResponseType.MODAL,
      data: CreateProviderNameInputModal.toApiData(),
    })
  }
}
