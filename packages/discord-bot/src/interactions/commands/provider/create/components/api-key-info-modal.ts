import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo";
import { CreateProviderNameInputPromptButton } from "./name-prompt-modal";

const API_KEY = "api-key";

export interface APIKeyAuthInformationModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
}

export class APIKeyAuthInformationModal extends ModalComponent {
  private readonly requestRepo: CreateProviderRequestRepo;
  public static readonly identifier = "api-key-auth-info";
  protected static readonly title = "API Key Auth Information";
  protected static readonly textInputs = [
    {
      customId: API_KEY,
      placeholder: "API Key",
      label: "API Key",
      style: 1,
      minLength: 12,
      maxLength: 512,
      required: true,
    },
  ]

  constructor(options: APIKeyAuthInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let apiKey: string | undefined = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case API_KEY:
            apiKey = c.value
            break;
        }
      })
    })

    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerAuthKey: apiKey,
    })

    context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "All the information needed has been collected, new we can create your provider! Give it a name.",
        components: [
          {
            type: 1,
            components: [
              CreateProviderNameInputPromptButton.toApiData()
            ],
          }
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}
