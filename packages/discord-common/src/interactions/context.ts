import { FastifyReply } from "fastify";
import { DiscordHttpClient } from "../http/client";

export interface InteractionContext {
  readonly http: DiscordHttpClient;
  readonly response: FastifyReply;
  readonly user: string;
}

export class BaseInteractionContext implements InteractionContext {
  constructor(
    readonly http: DiscordHttpClient,
    readonly response: FastifyReply,
    readonly user: string,
  ) {}
}