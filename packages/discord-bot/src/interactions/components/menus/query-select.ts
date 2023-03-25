import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { SteamQueryInformationModal } from "../modals/steam-query-info"
import { SelectMenuComponent } from "./menu"

export const QuerySelectMenu = new SelectMenuComponent({
  selectType: ComponentType.StringSelect,
  customId: "query-select",
  options: [
    {
      label: "Steam",
      value: "STEAM",
      description: "Steam source query",
    },
    {
      label: "HTTP",
      value: "HTTP",
      description: "HTTP query",
    },
    {
      label: "None",
      value: "NONE",
      description: "Do not query the server",
    },
  ],
  placeholder: "Select server query type",
  minSelectableValues: 1,
  maxSelectableValues: 1,
  enact: async (context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction) => {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    console.log(`Selected values: ${selectedValue}`)

    console.log(`Updating request ID ${interaction.message!.interaction!.id}`)
    await context.trackServerDao.update(interaction.message!.interaction!.id, {
      queryType: selectedValue
    })
    
    if (selectedValue == "STEAM") {
      let response = {
        type: InteractionResponseType.Modal,
        data: SteamQueryInformationModal.toApiData()
      }
      await context.response.send(response)
    }
  }
}
)