export interface ServerAlertsDto {
  users: string[];
  channels: string[];
}

export interface ServerCardDto {
  id: string;
  messageId: string;
  serverId: string;
  addedAt: Date;
  channelId: string;
  ownerId: string;
  admins?: string[];
  alerts?: ServerAlertsDto;
}

export type NewServerCardDto = Omit<ServerCardDto, 'addedAt' | 'id'>;