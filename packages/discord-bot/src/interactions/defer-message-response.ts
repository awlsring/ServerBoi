import { APIInteraction, APIInteractionResponse, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { FastifyReply } from "fastify";

export async function DeferMessageResponse(interaction: APIInteraction, response: FastifyReply) {
  console.log(`Received Ping interaction`);
  console.log(`Interaction: ${JSON.stringify(interaction)}`);
  response.send({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: {
      flags: MessageFlags.Ephemeral,
    }
  });
}