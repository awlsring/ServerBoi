import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { TrackServerRequestRepo } from "../../../persistence/track-server-request-repo";
import { InteractionContext } from "../../context";
import { QuerySelectMenu } from "../menus/query-select";
import { ModalComponent } from "./modals";

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
      maxLength: 64,
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
  ]

  private readonly requestDao = new TrackServerRequestRepo();

  constructor(options: ServerTrackInitialModalOptions) {
    super()
    this.requestDao = options.trackServerDao
  }

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {

    let application = undefined
    let name = undefined
    let address = undefined
    
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
        }
      })
    })

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