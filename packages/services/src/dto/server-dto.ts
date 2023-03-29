
export interface ServerPlatformDto {
  type: string;
  data?: string;
}

export interface ServerQueryDto {
  type: string;
  address?: string;
  port?: number;
}

export interface ServerLocationDto {
  readonly city: string;
  readonly country: string;
  readonly region: string;
  readonly emoji: string;
}

export interface ServerDto {
  scopeId: string;
  serverId: string;
  name: string;
  application: string;
  address: string;
  capabilities: string[];
  platform: ServerPlatformDto;
  owner: string;
  added: Date;
  location: ServerLocationDto;
  query: ServerQueryDto;
  lastUpdated?: Date;
}

export interface NewServerDto {
  scopeId: string;
  serverId: string;
  name: string;
  application: string;
  address: string;
  capabilities: string[];
  platform?: ServerPlatformDto;
  query: ServerQueryDto;
  location: ServerLocationDto;
  owner: string;
}
