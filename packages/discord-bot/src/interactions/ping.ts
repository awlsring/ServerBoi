import { APIInteraction, APIInteractionResponse, InteractionResponseType } from "discord-api-types/v10";
import { FastifyReply } from "fastify";

export async function PingInteraction(interaction: APIInteraction, response: FastifyReply) {
  console.log(`Received Ping interaction`);
  console.log(`Interaction: ${JSON.stringify(interaction)}`);
  response.send({
    type: InteractionResponseType.Pong,
  });
}