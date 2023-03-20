
export interface ServerPlatformDto {
  type: string;
  data?: string;
}

export interface ServerQueryDto {
  type: string;
  address?: string;
  port?: number;
}

export interface ServerDto {
  id: string;
  name: string;
  application: string;
  address: string;
  capabilities: string[];
  platform: ServerPlatformDto;
  owner: string;
  added: Date;
  location?: string;
  query: ServerQueryDto;
  lastUpdated?: Date;
}

export interface NewServerDto {
  name: string;
  application: string;
  address: string;
  capabilities: string[];
  platform: ServerPlatformDto;
  query: ServerQueryDto;
  owner: string;
  location?: string;
}
