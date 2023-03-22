import { FastifyReply } from "fastify";
import { InteractionHttpClient } from "./http/client";

export interface InteractionContext {
  readonly http: InteractionHttpClient;
  readonly response: FastifyReply;
}