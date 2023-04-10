export interface TrackServerRequestDto {
  id: string;
  name: string;
  application: string;
  address: string;
  port: number;
  ownerId: string;
  queryType?: string;
  queryPort?: number;
  queryAddress?: string;
  channelId?: string;
  provider?: string;
  providerServerData?: string;
  providerServerIdentifier?: string;
  providerServerLocation?: string;
  providerServerSubType?: string;
  capabilities?: string[];
}

export interface NewTrackServerRequestDto {
  id: string;
  name: string;
  application: string;
  address: string;
  port: number;
  ownerId: string;
}
