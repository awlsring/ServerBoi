import { APIModalSubmitInteraction, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionContext } from "../../context";
import { QuerySelectMenu } from "../menus/query-select";
import { ModalComponent } from "./modals";

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

  async enact(context: InteractionContext, interaction: APIModalSubmitInteraction) {

    let application = undefined
    let name = undefined
    let address = undefined
    
    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        console.log(`Type: ${c.type}, Custom ID: ${c.custom_id}, Value: ${c.value}`)
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
      console.log("error")
      return
    }

    console.log(`Creating track server request: ${interaction.message?.interaction?.id} ${application}, ${name}, ${address}, ${interaction.member.user.id}`)
    await context.trackServerDao.create({
      id: interaction.message!.interaction!.id,
      application: application,
      name: name,
      address: address,
      ownerId: interaction.member.user.id,
    })

    console.log("returning response")
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