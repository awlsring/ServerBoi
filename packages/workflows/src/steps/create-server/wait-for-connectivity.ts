import { ApplicationTemplateHealthCheckProtocol, Connectivity, CreateServerTemplateOptionsDto, HttpQuerent, Provider, ProviderAuthDto, ProviderDto, ProviderServerDataDto, Querent, SteamQuerent } from "@serverboi/backend-common";
import { loadProvider } from "@serverboi/backend-common";
import { ProviderServerStatus } from "@serverboi/ssdk";

export interface ProvisionServerProviderOptions {
  readonly provider: ProviderDto;
  readonly auth: ProviderAuthDto;
}

export interface ServerOptions {
  readonly serverType: string;
  readonly location: string;
  readonly diskSize: number;
}

export interface WaitForConnectivityInput {
  readonly identifier: string;
  readonly location: string;
  readonly applicationHealthCheck: ApplicationTemplateHealthCheckProtocol;
  readonly templateOptions: CreateServerTemplateOptionsDto;
  readonly providerData: ProvisionServerProviderOptions;
}

export interface WaitForConnectivityOutput {
  readonly serverConnectivity: boolean;
  readonly applicationConnectivity: boolean;
  readonly connectivity: boolean;
  readonly ipAddress?: string;
  readonly port?: number;
}

export async function WaitForConnectivity(input: WaitForConnectivityInput): Promise<WaitForConnectivityOutput> {
  const provider = await loadProvider(input.providerData.provider, input.providerData.auth);

  const queryPortName = input.applicationHealthCheck.portName
  const queryPort = input.templateOptions.ports.find(p => p.name === queryPortName)
  if (!queryPort) {
    const msg = `Port with name ${queryPortName} not found`
    throw new Error(msg)
  }

  const serverDto = {
    identifier: input.identifier,
    location: input.location,
  }

  const serverIsRunning = await isServerRunning(provider, serverDto);
  if (!serverIsRunning) {
    return {
      serverConnectivity: false,
      applicationConnectivity: false,
      connectivity: false,
    };
  }
  
  const server = await provider.describeServer({
    identifier: input.identifier,
    location: input.location,
  });
  if (!server.publicIpAddressV4) {
    return {
      serverConnectivity: false,
      applicationConnectivity: false,
      connectivity: false,
    };
  }

  const applicationIsRunning = await isApplicationRunning(input.applicationHealthCheck.protocol, server.publicIpAddressV4, queryPort.host);

  return {
    serverConnectivity: serverIsRunning,
    applicationConnectivity: applicationIsRunning,
    ipAddress: server.publicIpAddressV4,
    port: queryPort.host,
    connectivity: serverIsRunning && applicationIsRunning,
  };
}

async function isServerRunning(provider: Provider, server: ProviderServerDataDto): Promise<boolean> {
  const status = await provider.getServerStatus(server);
  return status === ProviderServerStatus.RUNNING;
}

async function isApplicationRunning(applicationQueryType: string, address: string, queryPort: number): Promise<boolean> {
  const querent = loadQuerent(applicationQueryType, { address, port: queryPort });

  try {
    const result = await querent.Query();
    if (result.status === "RUNNING") {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false
}

function loadQuerent(type: string, connectivity: Connectivity): Querent {
  switch (type) {
    case "HTTP":
      return new HttpQuerent(connectivity);
    case "STEAM":
      return new SteamQuerent(connectivity);
    default:
      throw new Error(`Unknown query type: ${type}`);
  }
}