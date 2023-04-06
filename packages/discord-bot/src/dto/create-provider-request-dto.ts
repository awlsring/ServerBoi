export interface CreateProviderRequestDto {
  readonly id: string;
  readonly startedAt: Date;
  readonly providerType: string;
  readonly endedAt?: Date;
  readonly providerData?: any;
  readonly providerAuthKey?: string;
  readonly providerAuthSecret?: string;
  readonly providerName?: string;
}

export interface NewCreateProviderRequestDto {
  readonly id: string;
  readonly providerType: string;
}
