import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CapabilitySelectMenu } from "./set-capabilities";
import { ResubmitAWSEC2ProviderInfoButton } from "./resubmit-aws-ec2-info-button";
import { logger } from "@serverboi/common";

export interface AWSEC2ServerProviderInformationModalOptions {
  readonly requestRepo: TrackServerRequestRepo
}

export class AWSEC2ServerProviderInformationModal extends ModalComponent {
  private readonly logger = logger.child({ name: "AWSEC2ServerProviderInformationModal"});
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

  private async isValidAwsRegion(region: string): Promise<boolean> {
    const url = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
    const response = await fetch(url);
    const data = await response.json();
    const regionRegexes = data.prefixes
      .filter((p: any) => p.service === 'AMAZON')
      .map((p: any) => new RegExp(`^(${p.region})$`));
    return regionRegexes.some((r: RegExp) => r.test(region));
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    this.logger.debug("Enacting AWS EC2 provider information modal");
    this.logger.debug(`Interaction data: ${interaction.data}`)
    let id: string | undefined = undefined
    let region: string | undefined = undefined
    let errorMessage = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(async c => {
        switch (c.custom_id) {
          case "instance-id":
            id = c.value
            break;
          case "region":
            const valid = await this.isValidAwsRegion(c.value);
            if (valid) {
              region = c.value
            } else {
              errorMessage = `\`${c.value}\` is an invalid AWS region.`
            }
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
      this.logger.error("All required fields not provided.")
      return
    }

    this.logger.debug(`Updating request ID ${interaction.message!.interaction!.id}`)
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