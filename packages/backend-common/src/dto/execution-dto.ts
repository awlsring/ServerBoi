export interface ExecutionDto {
  readonly id: string;
  readonly scope: string;
  readonly user: string;
  readonly workflowType: string;
  readonly input: any;
  readonly runnerType: string;
  readonly status?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly endedAt?: Date;
  readonly currentStep?: string;
  readonly output?: any;
  readonly error?: ExecutionErrorDto;
}

export interface ExecutionErrorDto {
  readonly name: string;
  readonly message?: string;
}

export interface CreateServerExecutionDto {
  readonly user: string;
  readonly scope: string;
  readonly name: string;
  readonly application: string;
  readonly provider: CreateServerProviderOptionsDto;
  readonly template: CreateServerTemplateOptionsDto;
  readonly capabilities: string[];
}

export interface CreateServerProviderOptionsDto {
  readonly provider: string;
  readonly location?: string;
  readonly data?: any;
}

export interface CreateServerTemplateOptionsDto {
  readonly variables: CreateServerApplicationVariableDto[]
  readonly ports: CreateServerApplicationPortDto[]
}

export interface CreateServerApplicationVariableDto {
  readonly name: string;
  readonly value: string;
}

export interface CreateServerApplicationPortDto {
  readonly host: number;
  readonly container: number;
  readonly protocol: string;
  readonly name: string;
}