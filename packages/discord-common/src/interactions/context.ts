import { FastifyReply } from "fastify";
import { Logger } from "../logger/logger";
import { DiscordHttpClient } from "../http/client";

export interface InteractionContext {
  readonly http: DiscordHttpClient;
  readonly response: FastifyReply;
  readonly logger: Logger;
  readonly user: string;
}

export class BaseInteractionContext implements InteractionContext {
  constructor(
    readonly http: DiscordHttpClient,
    readonly response: FastifyReply,
    readonly user: string,
    readonly logger: Logger
  ) {}
}