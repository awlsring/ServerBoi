export interface TrackServerRequestDto {
  id: string;
  name: string;
  application: string;
  address: string;
  ownerId: string;
  queryType?: string;
  queryPort?: number;
  queryAddress?: string;
  channelId?: string;
}

export interface NewTrackServerRequestDto {
  id: string;
  name: string;
  application: string;
  address: string;
  ownerId: string;
}
