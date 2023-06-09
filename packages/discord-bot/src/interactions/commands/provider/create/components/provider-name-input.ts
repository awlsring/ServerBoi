import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext, ServerBoiService } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo";
import { ProviderSummary } from "@serverboi/client";
import { CreateProviderNameInputPromptButton } from "./name-prompt-modal";
import { logger } from "@serverboi/common";

const NAME_INPUT = "provider-name-input";

export interface CreateProviderNameInputModalOptions {
  readonly requestRepo: CreateProviderRequestRepo
  readonly serverBoiService: ServerBoiService
}

export class CreateProviderNameInputModal extends ModalComponent {
  private readonly logger = logger.child({ name: "CreateProviderNameInputModal"});
  private readonly requestRepo: CreateProviderRequestRepo;
  private readonly serverBoiService: ServerBoiService
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
    this.serverBoiService = options.serverBoiService
  }

  private createProviderDataString(data?: any) {
    if (!data) {
      return ""
    }

    return `**Data**: 
${this.toMarkdownBulletList(data)}
`
  }

  private toMarkdownBulletList(json: any): string {
    const keys = Object.keys(json);
    const rows = keys.map(key => `- ${key}: ${json[key]}`).join('\n');
    return `${rows}`;
  }
  
  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    this.logger.debug("Enacting provider name input modal");
    this.logger.debug(`Interaction: ${JSON.stringify(interaction)}`);
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
    
    const request = await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerName: name
    })

    let provider: ProviderSummary;
    try {
      provider = await this.serverBoiService.createProvider(context.user, {
        name: name,
        type: request.providerType,
        subType: request.providerSubType,
        data: request.providerData,
        auth: {
          key: request.providerAuthKey,
          secret: request.providerAuthSecret,
        }
      })
    } catch (e) {
      this.logger.error(e)
      await context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: `${name} is already a provider name. Pick a new one.`,
          components: [
            {
              type: 1,
              components: [
                CreateProviderNameInputPromptButton.toApiData()
              ],
            }
          ],
        },
        flags: MessageFlags.Ephemeral
      })
      return
    }

    await context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: `Done, your provider has been added! Below is a summary.

**Name**: ${provider.name}
**Type**: ${provider.type}
${this.createProviderDataString( provider.data)}

`,
        components: [],
      },
      flags: MessageFlags.Ephemeral
    })
  }
}
