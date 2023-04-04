import {
  ServerBoiService,
  HealthServerInput,
  GetServerServerInput,
  TrackServerServerInput,
  ListServersServerInput,
  GetProviderServerInput,
  ListProvidersServerInput,
  CreateProviderServerInput,
  DeleteProviderServerInput,
  UntrackServerServerInput,
} from "@serverboi/ssdk";
import { ServiceContext } from "./context";
import { HealthOperation } from "../operations/health";
import { GetServerOperation } from "../operations/server/get-server";
import { TrackServerOperation } from "../operations/server/track-server";
import { ListServersOperation } from "../operations/server/list-servers";
import { GetProviderOperation } from "../operations/provider/get-provider";
import { ListProvidersOperation } from "../operations/provider/list-provider";
import { CreateProviderOperation } from "../operations/provider/create-provider";
import { DeleteProviderOperation } from "../operations/provider/delete-provider";
import { UntrackServerOperation } from "../operations/server/untrack-server";

export class ServiceHandler implements ServerBoiService<ServiceContext> {
  Health = (input: HealthServerInput, context: ServiceContext) => HealthOperation(input, context);
  
  GetProvider = (input: GetProviderServerInput, context: ServiceContext) => GetProviderOperation(input, context);
  ListProviders = (input: ListProvidersServerInput, context: ServiceContext) => ListProvidersOperation(input, context);
  CreateProvider = (input: CreateProviderServerInput, context: ServiceContext) => CreateProviderOperation(input, context);
  DeleteProvider = (input: DeleteProviderServerInput, context: ServiceContext) => DeleteProviderOperation(input, context);
  
  GetServer = (input: GetServerServerInput, context: ServiceContext) => GetServerOperation(input, context);
  TrackServer = (input: TrackServerServerInput, context: ServiceContext) => TrackServerOperation(input, context);
  ListServers = (input: ListServersServerInput, context: ServiceContext) => ListServersOperation(input, context);
  UntrackServer = (input: UntrackServerServerInput, context: ServiceContext) => UntrackServerOperation(input, context);

  async UpdateServer<UpdateServerServerInput, UpdateServerServerOutput>(
    input: UpdateServerServerInput
  ): Promise<UpdateServerServerOutput> {
    return Promise.resolve({
      success: false,
    } as UpdateServerServerOutput);
  }
}