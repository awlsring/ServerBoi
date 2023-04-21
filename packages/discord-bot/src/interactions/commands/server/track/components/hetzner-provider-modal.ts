import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { ModalComponent } from "@serverboi/discord-common";
import { CapabilitySelectMenu } from "./set-capabilities";
import { ResubmitAWSEC2ProviderInfoButton } from "./resubmit-aws-ec2-info-button";
import { ResubmitHetznerProviderInfoButton } from "./resubmit-hetzner-info-button";

export interface HetznerServerProviderInformationModalOptions {
  readonly requestRepo: TrackServerRequestRepo
}

export class HetznerServerProviderInformationModal extends ModalComponent {
  public static readonly identifier = "track-server-hetzner-provider-info";
  protected static readonly title = "Hetzner Provider Information";
  protected static readonly textInputs = [
    {
      customId: "server-id",
      placeholder: "The servers's ID. (00000000)",
      label: "Server ID",
      style: 1,
      minLength: 7,
      maxLength: 19,
      required: true,
    },
    {
      customId: "location",
      placeholder: "The city the server is in. (Hillsboro, Nurmeburg, etc)",
      label: "Location",
      style: 1,
      minLength: 7,
      maxLength: 25,
      required: true,
    },
  ]

  private validRegions = [
    "nuremberg",
    "hillsboro",
    "falkenstein",
    "helsinki",
    "ashburn",
  ];

  private readonly requestRepo: TrackServerRequestRepo;

  constructor(options: HetznerServerProviderInformationModalOptions) {
    super()
    this.requestRepo = options.requestRepo
  }

  private validateHetznerRegion(region: string): boolean {
    return this.validRegions.includes(region.toLocaleLowerCase());
  }


  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {
    let id: string | undefined = undefined
    let region: string | undefined = undefined
    let errorMessage = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case "server-id":
            id = c.value
            break;
          case "location":
            if (!this.validateHetznerRegion(c.value)) {
              errorMessage = `Invalid location provided. Valid locations are: ${this.validRegions.join(", ")}`
            } else {
              region = c.value.toLocaleLowerCase()
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
                ResubmitHetznerProviderInfoButton.toApiData()
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