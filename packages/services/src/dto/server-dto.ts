import { ProviderDto } from "./provider-dto";

export interface ServerDto {
  readonly scopeId: string;
  readonly serverId: string;
  readonly name: string;
  readonly application: string;
  readonly address: string;
  readonly port?: number;
  readonly capabilities: string[];
  readonly status?: ServerStatusDto;
  readonly provider?: ProviderDto;
  readonly providerServerData?: ProviderServerDataDto;
  readonly owner: string;
  readonly added: Date;
  readonly location: ServerLocationDto;
  readonly query: ServerQueryDto;
  readonly lastUpdated?: Date;
}

export interface ServerStatusDto {
  readonly type: string;
  readonly status: string;
  readonly data?: any;
}

export interface ProviderServerDataDto {
  readonly identifier: string;
  readonly location?: string;
  readonly data?: any;
}

export interface ServerQueryDto {
  readonly type: string;
  readonly address?: string;
  readonly port?: number;
}

export interface ServerLocationDto {
  readonly city: string;
  readonly country: string;
  readonly region: string;
  readonly emoji: string;
}


export interface NewServerDto {
  readonly scopeId: string;
  readonly serverId: string;
  readonly name: string;
  readonly application: string;
  readonly address: string;
  readonly port?: number;
  readonly capabilities: string[];
  readonly provider?: ProviderDto;
  readonly providerServerData?: ProviderServerDataDto;
  readonly query: ServerQueryDto;
  readonly location: ServerLocationDto;
  readonly owner: string;
}
