import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "@serverboi/discord-common"
import { SelectMenuComponent } from "@serverboi/discord-common"
import { ProviderSubtype, ProviderType } from "@serverboi/client"
import { CreateProviderRequestRepo } from "../../../../../persistence/create-provider-request-repo"
import { KubernetesProviderInformationModal } from "./k8s-info-modal"
import { AWSProviderAuthPromptButton } from "./aws-ec2-auth-prompt"
import { APIKeyAuthPromptButton } from "./api-key-auth-prompt"

export interface ProviderCreateMenuOptions {
  readonly createProviderRequestRepo: CreateProviderRequestRepo
}

export class ProviderCreateMenu extends SelectMenuComponent {
  public static readonly identifier = "provider-type-select";
  protected static readonly selectType = ComponentType.StringSelect;
  protected static readonly options = [
    {
      label: `${ProviderType.AWS}-${ProviderSubtype.EC2}`,
      value: `${ProviderType.AWS}-${ProviderSubtype.EC2}`,
      description: "Amazon Web Services",
    },
    {
      label: "Kubernetes",
      value: ProviderType.KUBERNETES,
      description: "A Kubernetes cluster",
    },
    {
      label: "Hetzner",
      value: ProviderType.HETZNER,
      description: "Hetzner Cloud",
    },
  ];
  protected static readonly placeholder = "Select provider type";
  protected static readonly minSelectableValues = 1;
  protected static readonly maxSelectableValues = 1;

  private readonly createProviderRequestRepo: CreateProviderRequestRepo

  constructor(options: ProviderCreateMenuOptions) {
    super()
    this.createProviderRequestRepo = options.createProviderRequestRepo
  }

  async enact(context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction): Promise<void> {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    context.logger.info(`Selected values: ${selectedValue}`)

    switch (selectedValue) {
      case `${ProviderType.AWS}-${ProviderSubtype.EC2}`:
        await context.response.send({
          type: InteractionResponseType.UpdateMessage,
          data: {
            content: `To access your instance, I'll need an IAM User with permission to perform various operations on your instances.
    
    Below is a sample CloudFormation template you can deploy that will create a user that provides the access that is needed.
    
    \`\`\`yaml
    Resources:
      EC2User:
        Type: "AWS::IAM::User"
        Properties:
          Path: "/"
          UserName: "ServerBoiEC2User"
          ManagedPolicyArns:
          - "arn:aws:iam::aws:policy/AmazonEC2FullAccess"
    \`\`\`
    
    Alternatively, you can use the AWS CLI to create the user.
    
    \`\`\`shell
    aws iam create-user --user-name ServerBoiEC2User
    aws iam attach-user-policy --user-name ServerBoiEC2User --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
    \`\`\`
    
    Once this user is created, you'll need to create an access key for the user.
    
    \`\`\`shell
    aws iam create-access-key --user-name ServerBoiEC2User
    \`\`\`
    
    One you have the access key and secret key, you can enter it by hitting the button below.
    `,
            components: [
              {
                type: 1,
                components: [
                  AWSProviderAuthPromptButton.toApiData()
                ],
              }
            ],
            flags: MessageFlags.Ephemeral,
          }
        })
        return
      case ProviderType.KUBERNETES:
        await context.response.send({
          type: InteractionResponseType.Modal,
          data: KubernetesProviderInformationModal.toApiData()
        })
        break;
      case ProviderType.HETZNER:
        await context.response.send({
          type: InteractionResponseType.UpdateMessage,
          data: {
            content: `To access your instance, I'll need an API Key with read and write permissions.
    
    You can follow this Hetzner documentation to create an API token https://docs.hetzner.com/cloud/api/getting-started/generating-api-token/
    
    One you have the API key, you can enter it by hitting the button below.
    `,
            components: [
              {
                type: 1,
                components: [
                  APIKeyAuthPromptButton.toApiData()
                ],
              }
            ],
            flags: MessageFlags.Ephemeral,
          }
        })
        break;
      default:
        await context.response.send({
          type: InteractionResponseType.UpdateMessage,
          data: {
            content: "Invalid option when selecting provider.",
            components: [
              ProviderCreateMenu.toApiData()
            ],
            flags: MessageFlags.Ephemeral,
          }
        })
        return
    }

    context.logger.info(`Creating request ID ${interaction.message!.interaction!.id}`)
    await this.createProviderRequestRepo.create({
      id: interaction.message!.interaction!.id,
      providerType: selectedValue
    })
  }
}