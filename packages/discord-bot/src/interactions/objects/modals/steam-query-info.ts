import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { ChannelSelectMenu } from "../menus/channel-select-menu";
import { ModalComponent } from "./modals";

export const SteamQueryInformationModal = new ModalComponent({
  title: "Steam Query Information",
  customId: "steam-query-info",
  textInputs: [
    {
      customId: "steam-query-address",
      placeholder: "Steam Query Address. Leave blank if this should be the same as the previous address",
      label: "Steam Query Address",
      style: 1,
      minLength: 1,
      maxLength: 64,
      required: false,
    },
    {
      customId: "steam-query-port",
      placeholder: "The port to query server information on.",
      label: "Query Port",
      style: 1,
      minLength: 1,
      maxLength: 5,
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
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Select the channel to send the server information to.",
        components: [
          ChannelSelectMenu.toApiData()
        ],
        flags: MessageFlags.Ephemeral,
      }
    });
  }
})
