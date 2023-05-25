import { ApplicationTemplate, CreateServerTemplateOptionsDto, PrismaRepoOptions, ProviderAuthDto, ProviderDto, ProviderServerDataDto, RegisterServerInput, ServerController, ServerQueryDto } from "@serverboi/backend-common";
import { Capabilities } from "@serverboi/ssdk";

export interface ProvisionServerProviderOptions {
  readonly provider: ProviderDto;
  readonly auth: ProviderAuthDto;
}

export interface ServerOptions {
  readonly serverType: string;
  readonly location: string;
  readonly diskSize: number;
}

export interface PostProvisionInput {
  readonly serverId: string;
  readonly identifier: string;
  readonly location: string;
  readonly name: string;
  readonly address: string;
  readonly queryPort: number;
  readonly user: string;
  readonly providerData: ProvisionServerProviderOptions;
  readonly applicationTemplate: ApplicationTemplate;
  readonly templateOptions: CreateServerTemplateOptionsDto;
  readonly persistenceCfg: PrismaRepoOptions
}

export interface PostProvisionOutput {
  readonly id: string;
}

export async function PostProvision(input: PostProvisionInput, context: any) {
  const controller = new ServerController(input.persistenceCfg);
  const [scopeId, serverId] = input.serverId.split("-");

  const connectivityPortName = input.applicationTemplate.connectivity.portName
  const connectivityPort = input.templateOptions.ports.find(p => p.name === connectivityPortName)
  if (!connectivityPort) {
    const msg = `Port with name ${connectivityPortName} not found`
    throw new Error(msg)
  }

  const registerInput: RegisterServerInput = {
    scopeId: scopeId,
    serverId: serverId,
    name: input.name,
    application: input.applicationTemplate.name,
    address: input.address,
    port: connectivityPort.host,
    capabilities: [Capabilities.QUERY, Capabilities.START, Capabilities.STOP, Capabilities.REBOOT, Capabilities.READ, Capabilities.QUERY],
    owner: input.user,
    providerName: input.providerData.provider.name,
    providerServerData: {
      identifier: input.identifier,
      location: input.location,
    },
    query: {
      type: input.applicationTemplate.healthCheck.protocol,
      address: input.address,
      port: input.queryPort,
    },
  }
  await controller.registerServer(registerInput)
}