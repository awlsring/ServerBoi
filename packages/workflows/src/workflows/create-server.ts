import { ApplicationTemplate, CreateServerTemplateOptionsDto, ProviderAuthDto, ProviderDto } from "@serverboi/backend-common";

export interface CreateServerWorkflowInput {
  readonly serverId: string;
  readonly user: string;
  readonly serverOptions: ServerOptions;
  readonly applicationTemplate: ApplicationTemplate;
  readonly templateOptions: CreateServerTemplateOptionsDto;
  readonly providerData: ProvisionServerProviderOptions;
}

export interface ServerOptions {
  readonly name: string;
  readonly serverType: string;
  readonly location: string;
  readonly diskSize: number;
}

export interface ProvisionServerProviderOptions {
  readonly provider: ProviderDto;
  readonly auth: ProviderAuthDto;
}

export interface CreateServerWorkflowOutput {

}