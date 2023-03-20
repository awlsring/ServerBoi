
export interface Status {
  readonly status: string;
  readonly data?: string;
}

export interface Querent {
  Query(): Promise<Status>;
}