import { APIApplicationCommandInteraction, InteractionResponseType } from "discord-api-types/v10";
import { FastifyReply } from "fastify";
import { DeferMessageResponse } from "./defer-message-response";

export async function RouteApplicationCommand(interaction: APIApplicationCommandInteraction, response: FastifyReply) {
  console.log(`Received Application Command interaction`);
 
  await DeferMessageResponse(interaction, response);

  switch (interaction.data.name) {
    case "plz-work":
      console.log("is plz work")
      break;
    default:
      console.log("is not plz work")
  }

  response.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Pong!",
    },
  });
}