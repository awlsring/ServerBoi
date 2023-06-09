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
  StopServerServerInput,
  RebootServerServerInput,
  StartServerServerInput,
  UpdateServerServerInput,
  GetExecution,
  GetExecutionServerInput,
  ListExecutionsServerInput,
  DeleteServer,
  DeleteServerServerInput,
  CreateServerServerInput,
  GetApplicationServerInput,
  ListApplicationsServerInput,
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
import { StopServerOperation } from "../operations/server/stop-server";
import { RebootServerOperation } from "../operations/server/reboot-server";
import { StartServerOperation } from "../operations/server/start-server";
import { UpdateServerOperation } from "../operations/server/update-server";
import { GetExecutionOperation } from "../operations/execution/get-execution";
import { ListExecutionsOperation } from "../operations/execution/list-executions";
import { DeleteServerOperation } from "../operations/server/delete-server";
import { CreateServerOperation } from "../operations/server/create-server";
import { GetApplicationOperation } from "../operations/application/get-application";
import { ListApplicationsOperation } from "../operations/application/list-applications";

export class ServiceHandler implements ServerBoiService<ServiceContext> {
  Health = (input: HealthServerInput, context: any) => HealthOperation(input, context);
  
  GetProvider = (input: GetProviderServerInput, context: ServiceContext) => GetProviderOperation(input, context);
  ListProviders = (input: ListProvidersServerInput, context: ServiceContext) => ListProvidersOperation(input, context);
  CreateProvider = (input: CreateProviderServerInput, context: ServiceContext) => CreateProviderOperation(input, context);
  DeleteProvider = (input: DeleteProviderServerInput, context: ServiceContext) => DeleteProviderOperation(input, context);
  

  GetExecution = (input: GetExecutionServerInput, context: ServiceContext) => GetExecutionOperation(input, context);
  ListExecutions = (input: ListExecutionsServerInput, context: ServiceContext) => ListExecutionsOperation(input, context);

  GetApplication = (input: GetApplicationServerInput, context: ServiceContext) => GetApplicationOperation(input, context);
  ListApplications = (input: ListApplicationsServerInput, context: ServiceContext) => ListApplicationsOperation(input, context);
  
  GetServer = (input: GetServerServerInput, context: ServiceContext) => GetServerOperation(input, context);
  TrackServer = (input: TrackServerServerInput, context: ServiceContext) => TrackServerOperation(input, context);
  CreateServer = (input: CreateServerServerInput, context: ServiceContext) => CreateServerOperation(input, context);
  UpdateServer = (input: UpdateServerServerInput, context: ServiceContext) => UpdateServerOperation(input, context);
  ListServers = (input: ListServersServerInput, context: ServiceContext) => ListServersOperation(input, context);
  UntrackServer = (input: UntrackServerServerInput, context: ServiceContext) => UntrackServerOperation(input, context);
  DeleteServer = (input: DeleteServerServerInput, context: ServiceContext) => DeleteServerOperation(input, context);
  RebootServer = (input: StopServerServerInput, context: ServiceContext) => StopServerOperation(input, context);
  StopServer = (input: RebootServerServerInput, context: ServiceContext) => RebootServerOperation(input, context);
  StartServer = (input: StartServerServerInput, context: ServiceContext) => StartServerOperation(input, context);
}