import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CapabilitySelectMenu } from "./set-capabilities";
import { ResubmitAWSEC2ProviderInfoButton } from "./resubmit-aws-ec2-info-button";

export interface AWSEC2ServerProviderInformationModalOptions {
  readonly requestRepo: TrackServerRequestRepo
}

export class AWSEC2ServerProviderInformationModal extends ModalComponent {
  public static readonly identifier = "track-server-aws-ec2-provider-info";
  protected static readonly title = "AWS EC2 Provider Information";
  protected static readonly textInputs = [
    {
      customId: "instance-id",
      placeholder: "The instance's ID. (i-1234567890abcdef0)",
      label: "Instance ID",
      style: 1,
      minLength: 19,
      maxLength: 19,
      required: true,
    },
    {
      customId: "region",
      placeholder: "The region the instance is in. (us-west-2)",
      label: "Region",
      style: 1,
      minLength: 1,
      maxLength: 16,
      required: true,
    },
  ]

  private readonly requestRepo: TrackServerRequestRepo;

  constructor(options: AWSEC2ServerProviderInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let id: string | undefined = undefined
    let region: string | undefined = undefined
    let errorMessage = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case "instance-id":
            id = c.value
            break;
          case "region":
            region = c.value
            break;
        }
      })
    })

    if (errorMessage) {
      context.response.send({
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: `Error validating the data: ${errorMessage}`,
          components: [
            {
              type: 1,
              components: [
                ResubmitAWSEC2ProviderInfoButton.toApiData()
              ],
            }
          ],
          flags: MessageFlags.Ephemeral,
        }
      });
      return
    }

    if (!id || !region || !interaction.member) {
      context.logger.error("All required fields not provided.")
      return
    }

    context.logger.info(`Updating request ID ${interaction.message!.interaction!.id}`)
    await this.requestRepo.update(interaction.message!.interaction!.id, {
      providerServerIdentifier: id,
      providerServerLocation: region,
    })

    context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Select the channel to send the server information to.",
        components: [
          CapabilitySelectMenu.toApiData()
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}