import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../../../persistence/track-server-request-repo";
import { InteractionContext } from "@serverboi/discord-common";
import { QuerySelectMenu } from "./query-select";
import { ModalComponent } from "@serverboi/discord-common";
import { ResubmitBaseInfoButton } from "./resubmit-base-info";

export interface ServerTrackInitialModalOptions {
  readonly trackServerDao: TrackServerRequestRepo
}

export class ServerTrackInitialModal extends ModalComponent {
  public static readonly identifier = "track-server-init";
  protected static readonly title = "Track Server";
  protected static readonly textInputs = [
    {
      customId: "application",
      placeholder: "Application name",
      label: "Application Name",
      style: 1,
      minLength: 1,
      maxLength: 64,
      required: true,
    },
    {
      customId: "name",
      placeholder: "server name",
      label: "Server Name",
      style: 1,
      minLength: 1,
      maxLength: 24,
      required: true,
    },
    {
      customId: "address",
      placeholder: "DNS or IP address of application",
      label: "Address",
      style: 1,
      minLength: 1,
      maxLength: 64,
      required: true,
    },
    {
      customId: "port",
      placeholder: "The port used to reach the application",
      label: "Port",
      style: 1,
      minLength: 1,
      maxLength: 5,
      required: true,
    },
  ]

  private readonly requestDao: TrackServerRequestRepo;

  constructor(options: ServerTrackInitialModalOptions) {
    super()
    this.requestDao = options.trackServerDao
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {

    let application: string | undefined = undefined
    let name: string | undefined = undefined
    let address: string | undefined = undefined
    let port: string | undefined = undefined
    let errorMessage = undefined

    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        switch (c.custom_id) {
          case "application":
            application = c.value
            break;
          case "name":
            name = c.value
            break;
          case "address":
            address = c.value
            break;
          case "port":
            port = c.value
            if  (!isNaN(Number(port))) {
              if (Number(port) < 1 || Number(port) > 65535) {
                errorMessage = "The port must be between 1 and 65535"
              }
            } else {
              errorMessage = `The port must be a number, you gave \`${port}\``
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
                ResubmitBaseInfoButton.toApiData()
              ],
            }
          ],
          flags: MessageFlags.Ephemeral,
        }
      });
      return
    }

    if (!application || !name || !address || !interaction.member) {
      context.logger.error("All required fields not provided.")
      return
    }

    context.logger.info(`Creating track server request: ${interaction.message?.interaction?.id} ${application}, ${name}, ${address}, ${interaction.member.user.id}`)
    await this.requestDao.create({
      id: interaction.message!.interaction!.id,
      application: application,
      name: name,
      address: address,
      port: Number(port),
      ownerId: interaction.member.user.id,
    })

    context.response.send({
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Select the query type to use for the server.",
        components: [
          QuerySelectMenu.toApiData()
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
}