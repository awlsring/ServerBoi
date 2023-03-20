import {
  ServerBoiService,
  HealthServerInput,
  GetServerServerInput,
  TrackServerServerInput,
  ListServersServerInput,
} from "@serverboi/ssdk";
import { ServiceContext } from "./context";
import { HealthOperation } from "../operations/health";
import { GetServerOperation } from "../operations/server/get-server";
import { TrackServerOperation } from "../operations/server/track-server";
import { ListServersOperation } from "../operations/server/list-servers";

export class ServiceHandler implements ServerBoiService<ServiceContext> {
  Health = (input: HealthServerInput, context: ServiceContext) => HealthOperation(input, context);
  GetServer = (input: GetServerServerInput, context: ServiceContext) => GetServerOperation(input, context);
  TrackServer = (input: TrackServerServerInput, context: ServiceContext) => TrackServerOperation(input, context);
  ListServers = (input: ListServersServerInput, context: ServiceContext) => ListServersOperation(input, context);
  
  async UntrackServer<UntrackServerServerInput, UntrackServerServerOutput>(
    input: UntrackServerServerInput
  ): Promise<UntrackServerServerOutput> {
    return Promise.resolve({
      success: true,
    } as UntrackServerServerOutput);
  }
  async UpdateServer<UpdateServerServerInput, UpdateServerServerOutput>(
    input: UpdateServerServerInput
  ): Promise<UpdateServerServerOutput> {
    return Promise.resolve({
      success: true,
    } as UpdateServerServerOutput);
  }
}