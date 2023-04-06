import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { ChannelSelectMenu } from "../menus/channel-select-menu";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../persistence/create-provider-request-repo";

const NAME_INPUT = "provider-name-input";

export interface CreateProviderNameInputModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
}

export class CreateProviderNameInputModal extends ModalComponent {
  private readonly requestRepo: CreateProviderRequestRepo;
  public static readonly identifier = "provider-name-info";
  protected static readonly title = "Provider Name";
  protected static readonly textInputs = [
    {
      customId: NAME_INPUT,
      placeholder: "Enter your a name for your provider",
      label: "Name",
      style: 1,
      minLength: 3,
      maxLength: 24,
      required: true,
    }
  ]

  constructor(options: CreateProviderNameInputModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let name: string | undefined = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case NAME_INPUT:
            name = c.value
            break;
        }
      })
    })
    
    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerName: name
    })

    await context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Done, your provider has been added!!",
        components: [],
      },
      flags: MessageFlags.Ephemeral
    })
  }
}
