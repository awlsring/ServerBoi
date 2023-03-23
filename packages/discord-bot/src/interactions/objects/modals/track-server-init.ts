import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { QuerySelectMenu } from "../menus/query-select";
import { ModalComponent } from "./modals";

export const ServerTrackInitialModal = new ModalComponent({
  title: "Track Server",
  customId: "track-server-init",
  textInputs: [
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
      placeholder: "dns or ip address of application",
      label: "Address",
      style: 1,
      minLength: 1,
      maxLength: 64,
      required: true,
    },
  ],
  enact: async (context, interaction) => {
    interaction.data.components.forEach(component => {
      component.components.forEach(c => {
        console.log(`Type: ${c.type}, Custom ID: ${c.custom_id}, Value: ${c.value}`)
      })
    })
    context.response.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Enacting track command",
        components: [
          QuerySelectMenu.toApiData()
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
})