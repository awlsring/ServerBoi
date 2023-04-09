import { InteractionResponseType } from "discord-api-types/v10";

export interface MessageComponentToResponseOptions {
  readonly identifier?: string;
  readonly type?: InteractionResponseType,
  readonly content?: string,
  readonly components?: [],
  readonly ephemeral?: boolean
}