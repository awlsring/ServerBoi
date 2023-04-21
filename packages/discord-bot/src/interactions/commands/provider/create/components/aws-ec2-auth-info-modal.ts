import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo";
import { CreateProviderNameInputPromptButton } from "./name-prompt-modal";
import { logger } from "@serverboi/common";

const PROVIDER_ACCESS_KEY = "aws-ec2-provider-access-key";
const PROVIDER_SECRET_KEY = "aws-ec2-provider-secret-key";

export interface AWSProviderAuthInformationModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
}

export class AWSProviderAuthInformationModal extends ModalComponent {
  private readonly logger = logger.child({ name: "AWSProviderAuthInformationModal"});
  private readonly requestRepo: CreateProviderRequestRepo;
  public static readonly identifier = "aws-ec2-provider-auth-info";
  protected static readonly title = "AWS Provider Auth Information";
  protected static readonly textInputs = [
    {
      customId: PROVIDER_ACCESS_KEY,
      placeholder: "Access Key",
      label: "Access Key",
      style: 1,
      minLength: 12,
      maxLength: 512,
      required: true,
    },
    {
      customId: PROVIDER_SECRET_KEY,
      placeholder: "Secret Key",
      label: "Secret Key",
      style: 1,
      minLength: 12,
      maxLength: 512,
      required: true,
    },
  ]

  constructor(options: AWSProviderAuthInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    this.logger.debug("Enacting AWS Provider auth information modal");
    let accessKey: string | undefined = undefined
    let secretKey: string | undefined = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case PROVIDER_ACCESS_KEY:
            accessKey = c.value
            break;
          case PROVIDER_SECRET_KEY:
            secretKey = c.value
            break;
        }
      })
    })

    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerAuthKey: accessKey,
      providerAuthSecret: secretKey
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
