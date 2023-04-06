export interface ProviderDto {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly owner: string;
  readonly data?: any;
}

export interface NewProviderDto {
  readonly name: string;
  readonly type: string;
  readonly owner: string;
  readonly auth: ProviderAuthDto;
}

export interface ProviderAuthDto {
  readonly key: string;
  readonly secret?: string;
}

