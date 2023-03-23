import { APIMessageComponentSelectMenuInteraction, APIMessageSelectMenuInteractionData, ChannelType, ComponentType, InteractionResponseType, MessageFlags } from "discord-api-types/v10"
import { InteractionContext } from "../../context"
import { SelectMenuComponent } from "./menu"

export const ChannelSelectMenu = new SelectMenuComponent({
  selectType: ComponentType.ChannelSelect,
  customId: "channel-select",
  channelTypes: [ChannelType.GuildText],
  placeholder: "Select channel",
  minSelectableValues: 1,
  maxSelectableValues: 1,
  enact: async (context: InteractionContext, interaction: APIMessageComponentSelectMenuInteraction) => {
    const selectedValue = (interaction.data as APIMessageSelectMenuInteractionData).values[0]
    console.log(`Selected value: ${selectedValue}`)

    const response = {
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "Done, thanks!",
        components: [],
      },
      flags: MessageFlags.Ephemeral
    }
    await context.response.send(response)
  }
})