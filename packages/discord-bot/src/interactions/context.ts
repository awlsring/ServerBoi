import { FastifyReply } from "fastify";
import { Logger } from "../logger/logger";
import { InteractionHttpClient } from "./http/client";

export interface InteractionContext {
  readonly http: InteractionHttpClient;
  readonly response: FastifyReply;
  readonly logger: Logger;
}

export class BaseInteractionContext implements InteractionContext {
  logger: Logger;

  constructor(
    readonly http: InteractionHttpClient,
    readonly response: FastifyReply,
    logger: Logger
  ) {
    this.http = http;
    this.response = response;
    this.logger = logger;
  }
}