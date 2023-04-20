export interface ServerActionResponse {
  action: Action;
}

export interface Resource {
  id: number;
  type: string;
}

export interface Error {
  code: string;
  message: string;
}

export interface Action {
  command: string;
  error: Error;
  finished: string | null;
  id: number;
  progress: number;
  resources: Resource[];
  started: string;
  status: string;
}