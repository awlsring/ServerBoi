import { ServerBoiServiceException as __BaseException } from "./ServerBoiServiceException";
import { ExceptionOptionType as __ExceptionOptionType } from "@aws-sdk/smithy-client";
import { MetadataBearer as $MetadataBearer } from "@aws-sdk/types";

export enum Capabilities {
  QUERY = "QUERY",
  READ = "READ",
  REBOOT = "REBOOT",
  START = "START",
  STOP = "STOP",
}

export interface GetServerInput {
  id: string | undefined;
}

export namespace GetServerInput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: GetServerInput): any => ({
    ...obj,
  })
}

export enum ServerPlatform {
  AWS_EC2 = "AWS_EC2",
  DOCKER = "DOCKER",
  KUBERNETES = "KUBERNETES",
  UNDEFINED = "UNDEFINED",
}

export interface ServerPlatformSummary {
  type: ServerPlatform | string | undefined;
  data?: string;
}

export namespace ServerPlatformSummary {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: ServerPlatformSummary): any => ({
    ...obj,
  })
}

export enum ServerQueryType {
  HTTP = "HTTP",
  NONE = "NONE",
  STEAM = "STEAM",
}

export interface ServerQuerySummary {
  type: ServerQueryType | string | undefined;
  address?: string;
  port?: number;
}

export namespace ServerQuerySummary {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: ServerQuerySummary): any => ({
    ...obj,
  })
}

export enum ServerStatus {
  REBOOTING = "REBOOTING",
  RUNNING = "RUNNING",
  STARTING = "STARTING",
  STOPPED = "STOPPED",
  STOPPING = "STOPPING",
}

export interface ServerStatusSummary {
  status: ServerStatus | string | undefined;
  data?: string;
}

export namespace ServerStatusSummary {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: ServerStatusSummary): any => ({
    ...obj,
  })
}

export interface ServerSummary {
  id: string | undefined;
  name: string | undefined;
  application: string | undefined;
  address: string | undefined;
  status: ServerStatusSummary | undefined;
  capabilities: (Capabilities | string)[] | undefined;
  platform: ServerPlatformSummary | undefined;
  query: ServerQuerySummary | undefined;
  location?: string;
  added: number | undefined;
  lastUpdated?: number;
  owner: string | undefined;
}

export namespace ServerSummary {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: ServerSummary): any => ({
    ...obj,
  })
}

export interface GetServerOutput {
  summary: ServerSummary | undefined;
}

export namespace GetServerOutput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: GetServerOutput): any => ({
    ...obj,
  })
}

/**
 * Describes one specific validation failure for an input member.
 */
export interface ValidationExceptionField {
  /**
   * A JSONPointer expression to the structure member whose value failed to satisfy the modeled constraints.
   */
  path: string | undefined;

  /**
   * A detailed description of the validation failure.
   */
  message: string | undefined;
}

export namespace ValidationExceptionField {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: ValidationExceptionField): any => ({
    ...obj,
  })
}

/**
 * A standard error for input validation failures.
 * This should be thrown by services when a member of the input structure
 * falls outside of the modeled or documented constraints.
 */
export class ValidationException extends __BaseException {
  readonly name: "ValidationException" = "ValidationException";
  readonly $fault: "client" = "client";
  /**
   * A list of specific failures encountered while validating the input.
   * A member can appear in this list more than once if it failed to satisfy multiple constraints.
   */
  fieldList?: (ValidationExceptionField)[];

  /**
   * @internal
   */
  constructor(opts: __ExceptionOptionType<ValidationException, __BaseException>) {
    super({
      name: "ValidationException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ValidationException.prototype);
    this.fieldList = opts.fieldList;
  }
}

export interface HealthOutput {
  success: boolean | undefined;
}

export namespace HealthOutput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: HealthOutput): any => ({
    ...obj,
  })
}

export interface ListServersOutput {
  summaries: (ServerSummary)[] | undefined;
}

export namespace ListServersOutput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: ListServersOutput): any => ({
    ...obj,
  })
}

export interface TrackServerPlatformInput {
  type: ServerPlatform | string | undefined;
  data?: string;
}

export namespace TrackServerPlatformInput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: TrackServerPlatformInput): any => ({
    ...obj,
  })
}

export interface TrackServerQueryInput {
  type: ServerQueryType | string | undefined;
  address?: string;
  port?: number;
}

export namespace TrackServerQueryInput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: TrackServerQueryInput): any => ({
    ...obj,
  })
}

export interface TrackServerInput {
  application: string | undefined;
  name: string | undefined;
  address: string | undefined;
  owner: string | undefined;
  platform?: TrackServerPlatformInput;
  capabilities?: (Capabilities | string)[];
  query?: TrackServerQueryInput;
}

export namespace TrackServerInput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: TrackServerInput): any => ({
    ...obj,
  })
}

export interface TrackServerOutput {
  summary: ServerSummary | undefined;
}

export namespace TrackServerOutput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: TrackServerOutput): any => ({
    ...obj,
  })
}

export interface UntrackServerInput {
  id: string | undefined;
}

export namespace UntrackServerInput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: UntrackServerInput): any => ({
    ...obj,
  })
}

export interface UntrackServerOutput {
  success: boolean | undefined;
}

export namespace UntrackServerOutput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: UntrackServerOutput): any => ({
    ...obj,
  })
}

export interface UpdateServerInput {
  id: string | undefined;
  name?: string;
  application?: string;
  address?: string;
}

export namespace UpdateServerInput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: UpdateServerInput): any => ({
    ...obj,
  })
}

export interface UpdateServerOutput {
  summary: ServerSummary | undefined;
}

export namespace UpdateServerOutput {
  /**
   * @internal
   */
  export const filterSensitiveLog = (obj: UpdateServerOutput): any => ({
    ...obj,
  })
}
