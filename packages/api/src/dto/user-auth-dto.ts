export interface UserAuthDto {
  readonly key: string;
  readonly scope: string;
  readonly valid: boolean;
}