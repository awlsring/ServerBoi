import { FastifyReply } from "fastify";
import { TrackServerRequestDao } from "../persistence/track-server-request/dao";
import { InteractionHttpClient } from "./http/client";

export interface InteractionContext {
  readonly http: InteractionHttpClient;
  readonly response: FastifyReply;
  readonly trackServerDao: TrackServerRequestDao;
}