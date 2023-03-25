import {
  GetServerCommandInput,
  GetServerCommandOutput,
} from "../commands/GetServerCommand";
import {
  HealthCommandInput,
  HealthCommandOutput,
} from "../commands/HealthCommand";
import {
  ListServersCommandInput,
  ListServersCommandOutput,
} from "../commands/ListServersCommand";
import {
  TrackServerCommandInput,
  TrackServerCommandOutput,
} from "../commands/TrackServerCommand";
import {
  UntrackServerCommandInput,
  UntrackServerCommandOutput,
} from "../commands/UntrackServerCommand";
import {
  UpdateServerCommandInput,
  UpdateServerCommandOutput,
} from "../commands/UpdateServerCommand";
import { ServerBoiServiceException as __BaseException } from "../models/ServerBoiServiceException";
import {
  Capabilities,
  ServerPlatformSummary,
  ServerQuerySummary,
  ServerStatusSummary,
  ServerSummary,
  TrackServerPlatformInput,
  TrackServerQueryInput,
  ValidationException,
  ValidationExceptionField,
} from "../models/models_0";
import {
  HttpRequest as __HttpRequest,
  HttpResponse as __HttpResponse,
} from "@aws-sdk/protocol-http";
import {
  decorateServiceException as __decorateServiceException,
  expectBoolean as __expectBoolean,
  expectInt32 as __expectInt32,
  expectLong as __expectLong,
  expectNonNull as __expectNonNull,
  expectObject as __expectObject,
  expectString as __expectString,
  extendedEncodeURIComponent as __extendedEncodeURIComponent,
} from "@aws-sdk/smithy-client";
import {
  Endpoint as __Endpoint,
  ResponseMetadata as __ResponseMetadata,
  SerdeContext as __SerdeContext,
} from "@aws-sdk/types";

export const serializeAws_restJson1GetServerCommand = async(
  input: GetServerCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const {hostname, protocol = "https", port, path: basePath} = await context.endpoint();
  const headers: any = {
  };
  let resolvedPath = `${basePath?.endsWith('/') ? basePath.slice(0, -1) : (basePath || '')}` + "/server/{id}";
  if (input.id !== undefined) {
    const labelValue: string = input.id;
    if (labelValue.length <= 0) {
      throw new Error('Empty value provided for input HTTP label: id.');
    }
    resolvedPath = resolvedPath.replace("{id}", __extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error('No value provided for input HTTP label: id.');
  }
  let body: any;
  return new __HttpRequest({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath,
    body,
  });
}

export const serializeAws_restJson1HealthCommand = async(
  input: HealthCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const {hostname, protocol = "https", port, path: basePath} = await context.endpoint();
  const headers: any = {
    'content-type': "application/json",
  };
  let resolvedPath = `${basePath?.endsWith('/') ? basePath.slice(0, -1) : (basePath || '')}` + "/health";
  let body: any;
  body = "";
  return new __HttpRequest({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath,
    body,
  });
}

export const serializeAws_restJson1ListServersCommand = async(
  input: ListServersCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const {hostname, protocol = "https", port, path: basePath} = await context.endpoint();
  const headers: any = {
    'content-type': "application/json",
  };
  let resolvedPath = `${basePath?.endsWith('/') ? basePath.slice(0, -1) : (basePath || '')}` + "/server";
  let body: any;
  body = "";
  return new __HttpRequest({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath,
    body,
  });
}

export const serializeAws_restJson1TrackServerCommand = async(
  input: TrackServerCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const {hostname, protocol = "https", port, path: basePath} = await context.endpoint();
  const headers: any = {
    'content-type': "application/json",
  };
  let resolvedPath = `${basePath?.endsWith('/') ? basePath.slice(0, -1) : (basePath || '')}` + "/server/track";
  let body: any;
  body = JSON.stringify({
    ...(input.address !== undefined && input.address !== null &&{ "address": input.address }),
    ...(input.application !== undefined && input.application !== null &&{ "application": input.application }),
    ...(input.capabilities !== undefined && input.capabilities !== null &&{ "capabilities": serializeAws_restJson1ServerCapabilities(input.capabilities, context) }),
    ...(input.name !== undefined && input.name !== null &&{ "name": input.name }),
    ...(input.owner !== undefined && input.owner !== null &&{ "owner": input.owner }),
    ...(input.platform !== undefined && input.platform !== null &&{ "platform": serializeAws_restJson1TrackServerPlatformInput(input.platform, context) }),
    ...(input.query !== undefined && input.query !== null &&{ "query": serializeAws_restJson1TrackServerQueryInput(input.query, context) }),
  });
  return new __HttpRequest({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath,
    body,
  });
}

export const serializeAws_restJson1UntrackServerCommand = async(
  input: UntrackServerCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const {hostname, protocol = "https", port, path: basePath} = await context.endpoint();
  const headers: any = {
  };
  let resolvedPath = `${basePath?.endsWith('/') ? basePath.slice(0, -1) : (basePath || '')}` + "/server/{id}";
  if (input.id !== undefined) {
    const labelValue: string = input.id;
    if (labelValue.length <= 0) {
      throw new Error('Empty value provided for input HTTP label: id.');
    }
    resolvedPath = resolvedPath.replace("{id}", __extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error('No value provided for input HTTP label: id.');
  }
  let body: any;
  return new __HttpRequest({
    protocol,
    hostname,
    port,
    method: "DELETE",
    headers,
    path: resolvedPath,
    body,
  });
}

export const serializeAws_restJson1UpdateServerCommand = async(
  input: UpdateServerCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const {hostname, protocol = "https", port, path: basePath} = await context.endpoint();
  const headers: any = {
    'content-type': "application/json",
  };
  let resolvedPath = `${basePath?.endsWith('/') ? basePath.slice(0, -1) : (basePath || '')}` + "/server/{id}";
  if (input.id !== undefined) {
    const labelValue: string = input.id;
    if (labelValue.length <= 0) {
      throw new Error('Empty value provided for input HTTP label: id.');
    }
    resolvedPath = resolvedPath.replace("{id}", __extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error('No value provided for input HTTP label: id.');
  }
  let body: any;
  body = JSON.stringify({
    ...(input.address !== undefined && input.address !== null &&{ "address": input.address }),
    ...(input.application !== undefined && input.application !== null &&{ "application": input.application }),
    ...(input.name !== undefined && input.name !== null &&{ "name": input.name }),
  });
  return new __HttpRequest({
    protocol,
    hostname,
    port,
    method: "PUT",
    headers,
    path: resolvedPath,
    body,
  });
}

export const deserializeAws_restJson1GetServerCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<GetServerCommandOutput> => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return deserializeAws_restJson1GetServerCommandError(output, context);
  }
  const contents: GetServerCommandOutput = {
    $metadata: deserializeMetadata(output),
    summary: undefined,
  };
  const data: { [key: string] : any } = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
  if (data.summary !== undefined && data.summary !== null) {
    contents.summary = deserializeAws_restJson1ServerSummary(data.summary, context);
  }
  return Promise.resolve(contents);
}

const deserializeAws_restJson1GetServerCommandError = async(
  output: __HttpResponse,
  context: __SerdeContext,
): Promise<GetServerCommandOutput> => {
  const parsedOutput: any = {
    ...output,
    body: await parseBody(output.body, context)
  };
  let response: __BaseException;
  let errorCode: string = "UnknownError";
  errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ValidationException":
    case "smithy.framework#ValidationException":
      throw await deserializeAws_restJson1ValidationExceptionResponse(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      response = new __BaseException({
        name: parsedBody.code || parsedBody.Code || errorCode,
        $fault: "client",
        $metadata: deserializeMetadata(output)
      });
      throw __decorateServiceException(response, parsedBody);
    }
  }

  export const deserializeAws_restJson1HealthCommand = async(
    output: __HttpResponse,
    context: __SerdeContext
  ): Promise<HealthCommandOutput> => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
      return deserializeAws_restJson1HealthCommandError(output, context);
    }
    const contents: HealthCommandOutput = {
      $metadata: deserializeMetadata(output),
      success: undefined,
    };
    const data: { [key: string] : any } = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
    if (data.success !== undefined && data.success !== null) {
      contents.success = __expectBoolean(data.success);
    }
    return Promise.resolve(contents);
  }

  const deserializeAws_restJson1HealthCommandError = async(
    output: __HttpResponse,
    context: __SerdeContext,
  ): Promise<HealthCommandOutput> => {
    const parsedOutput: any = {
      ...output,
      body: await parseBody(output.body, context)
    };
    let response: __BaseException;
    let errorCode: string = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
      case "ValidationException":
      case "smithy.framework#ValidationException":
        throw await deserializeAws_restJson1ValidationExceptionResponse(parsedOutput, context);
      default:
        const parsedBody = parsedOutput.body;
        response = new __BaseException({
          name: parsedBody.code || parsedBody.Code || errorCode,
          $fault: "client",
          $metadata: deserializeMetadata(output)
        });
        throw __decorateServiceException(response, parsedBody);
      }
    }

    export const deserializeAws_restJson1ListServersCommand = async(
      output: __HttpResponse,
      context: __SerdeContext
    ): Promise<ListServersCommandOutput> => {
      if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1ListServersCommandError(output, context);
      }
      const contents: ListServersCommandOutput = {
        $metadata: deserializeMetadata(output),
        summaries: undefined,
      };
      const data: { [key: string] : any } = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
      if (data.summaries !== undefined && data.summaries !== null) {
        contents.summaries = deserializeAws_restJson1ServerSummaries(data.summaries, context);
      }
      return Promise.resolve(contents);
    }

    const deserializeAws_restJson1ListServersCommandError = async(
      output: __HttpResponse,
      context: __SerdeContext,
    ): Promise<ListServersCommandOutput> => {
      const parsedOutput: any = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response: __BaseException;
      let errorCode: string = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "ValidationException":
        case "smithy.framework#ValidationException":
          throw await deserializeAws_restJson1ValidationExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new __BaseException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw __decorateServiceException(response, parsedBody);
        }
      }

      export const deserializeAws_restJson1TrackServerCommand = async(
        output: __HttpResponse,
        context: __SerdeContext
      ): Promise<TrackServerCommandOutput> => {
        if (output.statusCode !== 200 && output.statusCode >= 300) {
          return deserializeAws_restJson1TrackServerCommandError(output, context);
        }
        const contents: TrackServerCommandOutput = {
          $metadata: deserializeMetadata(output),
          summary: undefined,
        };
        const data: { [key: string] : any } = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
        if (data.summary !== undefined && data.summary !== null) {
          contents.summary = deserializeAws_restJson1ServerSummary(data.summary, context);
        }
        return Promise.resolve(contents);
      }

      const deserializeAws_restJson1TrackServerCommandError = async(
        output: __HttpResponse,
        context: __SerdeContext,
      ): Promise<TrackServerCommandOutput> => {
        const parsedOutput: any = {
          ...output,
          body: await parseBody(output.body, context)
        };
        let response: __BaseException;
        let errorCode: string = "UnknownError";
        errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
        switch (errorCode) {
          case "ValidationException":
          case "smithy.framework#ValidationException":
            throw await deserializeAws_restJson1ValidationExceptionResponse(parsedOutput, context);
          default:
            const parsedBody = parsedOutput.body;
            response = new __BaseException({
              name: parsedBody.code || parsedBody.Code || errorCode,
              $fault: "client",
              $metadata: deserializeMetadata(output)
            });
            throw __decorateServiceException(response, parsedBody);
          }
        }

        export const deserializeAws_restJson1UntrackServerCommand = async(
          output: __HttpResponse,
          context: __SerdeContext
        ): Promise<UntrackServerCommandOutput> => {
          if (output.statusCode !== 200 && output.statusCode >= 300) {
            return deserializeAws_restJson1UntrackServerCommandError(output, context);
          }
          const contents: UntrackServerCommandOutput = {
            $metadata: deserializeMetadata(output),
            success: undefined,
          };
          const data: { [key: string] : any } = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
          if (data.success !== undefined && data.success !== null) {
            contents.success = __expectBoolean(data.success);
          }
          return Promise.resolve(contents);
        }

        const deserializeAws_restJson1UntrackServerCommandError = async(
          output: __HttpResponse,
          context: __SerdeContext,
        ): Promise<UntrackServerCommandOutput> => {
          const parsedOutput: any = {
            ...output,
            body: await parseBody(output.body, context)
          };
          let response: __BaseException;
          let errorCode: string = "UnknownError";
          errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
          switch (errorCode) {
            case "ValidationException":
            case "smithy.framework#ValidationException":
              throw await deserializeAws_restJson1ValidationExceptionResponse(parsedOutput, context);
            default:
              const parsedBody = parsedOutput.body;
              response = new __BaseException({
                name: parsedBody.code || parsedBody.Code || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output)
              });
              throw __decorateServiceException(response, parsedBody);
            }
          }

          export const deserializeAws_restJson1UpdateServerCommand = async(
            output: __HttpResponse,
            context: __SerdeContext
          ): Promise<UpdateServerCommandOutput> => {
            if (output.statusCode !== 200 && output.statusCode >= 300) {
              return deserializeAws_restJson1UpdateServerCommandError(output, context);
            }
            const contents: UpdateServerCommandOutput = {
              $metadata: deserializeMetadata(output),
              summary: undefined,
            };
            const data: { [key: string] : any } = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
            if (data.summary !== undefined && data.summary !== null) {
              contents.summary = deserializeAws_restJson1ServerSummary(data.summary, context);
            }
            return Promise.resolve(contents);
          }

          const deserializeAws_restJson1UpdateServerCommandError = async(
            output: __HttpResponse,
            context: __SerdeContext,
          ): Promise<UpdateServerCommandOutput> => {
            const parsedOutput: any = {
              ...output,
              body: await parseBody(output.body, context)
            };
            let response: __BaseException;
            let errorCode: string = "UnknownError";
            errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
            switch (errorCode) {
              case "ValidationException":
              case "smithy.framework#ValidationException":
                throw await deserializeAws_restJson1ValidationExceptionResponse(parsedOutput, context);
              default:
                const parsedBody = parsedOutput.body;
                response = new __BaseException({
                  name: parsedBody.code || parsedBody.Code || errorCode,
                  $fault: "client",
                  $metadata: deserializeMetadata(output)
                });
                throw __decorateServiceException(response, parsedBody);
              }
            }

            const deserializeAws_restJson1ValidationExceptionResponse = async (
              parsedOutput: any,
              context: __SerdeContext
            ): Promise<ValidationException> => {
              const contents: any = {};
              const data: any = parsedOutput.body;
              if (data.fieldList !== undefined && data.fieldList !== null) {
                contents.fieldList = deserializeAws_restJson1ValidationExceptionFieldList(data.fieldList, context);
              }
              if (data.message !== undefined && data.message !== null) {
                contents.message = __expectString(data.message);
              }
              const exception = new ValidationException({
                $metadata: deserializeMetadata(parsedOutput),
                ...contents
              });
              return __decorateServiceException(exception, parsedOutput.body);
            };

            const serializeAws_restJson1ServerCapabilities = (
              input: (Capabilities | string)[],
              context: __SerdeContext
            ): any => {
              return input.filter((e: any) => e != null).map(entry => {
                if (entry === null) { return null as any; }
                return entry;
              });
            }

            const serializeAws_restJson1TrackServerPlatformInput = (
              input: TrackServerPlatformInput,
              context: __SerdeContext
            ): any => {
              return {
                ...(input.data !== undefined && input.data !== null && { "data": input.data }),
                ...(input.type !== undefined && input.type !== null && { "type": input.type }),
              };
            }

            const serializeAws_restJson1TrackServerQueryInput = (
              input: TrackServerQueryInput,
              context: __SerdeContext
            ): any => {
              return {
                ...(input.address !== undefined && input.address !== null && { "address": input.address }),
                ...(input.port !== undefined && input.port !== null && { "port": input.port }),
                ...(input.type !== undefined && input.type !== null && { "type": input.type }),
              };
            }

            const deserializeAws_restJson1ServerCapabilities = (
              output: any,
              context: __SerdeContext
            ): (Capabilities | string)[] => {
              const retVal = (output || []).filter((e: any) => e != null).map((entry: any) => {
                if (entry === null) {
                  return null as any;
                }
                return __expectString(entry) as any;
              });
              return retVal;
            }

            const deserializeAws_restJson1ServerPlatformSummary = (
              output: any,
              context: __SerdeContext
            ): ServerPlatformSummary => {
              return {
                data: __expectString(output.data),
                type: __expectString(output.type),
              } as any;
            }

            const deserializeAws_restJson1ServerQuerySummary = (
              output: any,
              context: __SerdeContext
            ): ServerQuerySummary => {
              return {
                address: __expectString(output.address),
                port: __expectInt32(output.port),
                type: __expectString(output.type),
              } as any;
            }

            const deserializeAws_restJson1ServerStatusSummary = (
              output: any,
              context: __SerdeContext
            ): ServerStatusSummary => {
              return {
                data: __expectString(output.data),
                status: __expectString(output.status),
              } as any;
            }

            const deserializeAws_restJson1ServerSummaries = (
              output: any,
              context: __SerdeContext
            ): (ServerSummary)[] => {
              const retVal = (output || []).filter((e: any) => e != null).map((entry: any) => {
                if (entry === null) {
                  return null as any;
                }
                return deserializeAws_restJson1ServerSummary(entry, context);
              });
              return retVal;
            }

            const deserializeAws_restJson1ServerSummary = (
              output: any,
              context: __SerdeContext
            ): ServerSummary => {
              return {
                added: __expectLong(output.added),
                address: __expectString(output.address),
                application: __expectString(output.application),
                capabilities: (output.capabilities !== undefined && output.capabilities !== null) ? deserializeAws_restJson1ServerCapabilities(output.capabilities, context): undefined,
                id: __expectString(output.id),
                lastUpdated: __expectLong(output.lastUpdated),
                location: __expectString(output.location),
                name: __expectString(output.name),
                owner: __expectString(output.owner),
                platform: (output.platform !== undefined && output.platform !== null) ? deserializeAws_restJson1ServerPlatformSummary(output.platform, context): undefined,
                query: (output.query !== undefined && output.query !== null) ? deserializeAws_restJson1ServerQuerySummary(output.query, context): undefined,
                status: (output.status !== undefined && output.status !== null) ? deserializeAws_restJson1ServerStatusSummary(output.status, context): undefined,
              } as any;
            }

            const deserializeAws_restJson1ValidationExceptionField = (
              output: any,
              context: __SerdeContext
            ): ValidationExceptionField => {
              return {
                message: __expectString(output.message),
                path: __expectString(output.path),
              } as any;
            }

            const deserializeAws_restJson1ValidationExceptionFieldList = (
              output: any,
              context: __SerdeContext
            ): (ValidationExceptionField)[] => {
              const retVal = (output || []).filter((e: any) => e != null).map((entry: any) => {
                if (entry === null) {
                  return null as any;
                }
                return deserializeAws_restJson1ValidationExceptionField(entry, context);
              });
              return retVal;
            }

            const deserializeMetadata = (output: __HttpResponse): __ResponseMetadata => ({
              httpStatusCode: output.statusCode,
              requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"],
              extendedRequestId: output.headers["x-amz-id-2"],
              cfId: output.headers["x-amz-cf-id"],
            });

            // Collect low-level response body stream to Uint8Array.
            const collectBody = (streamBody: any = new Uint8Array(), context: __SerdeContext): Promise<Uint8Array> => {
              if (streamBody instanceof Uint8Array) {
                return Promise.resolve(streamBody);
              }
              return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
            };

            // Encode Uint8Array data into string with utf-8.
            const collectBodyString = (streamBody: any, context: __SerdeContext): Promise<string> => collectBody(streamBody, context).then(body => context.utf8Encoder(body))

            const isSerializableHeaderValue = (value: any): boolean =>
              value !== undefined &&
              value !== null &&
              value !== "" &&
              (!Object.getOwnPropertyNames(value).includes("length") ||
                value.length != 0) &&
              (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);

            const parseBody = (streamBody: any, context: __SerdeContext): any => collectBodyString(streamBody, context).then(encoded => {
              if (encoded.length) {
                return JSON.parse(encoded);
              }
              return {};
            });

            /**
             * Load an error code for the aws.rest-json-1.1 protocol.
             */
            const loadRestJsonErrorCode = (output: __HttpResponse, data: any): string => {
              const findKey = (object: any, key: string) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());

              const sanitizeErrorCode = (rawValue: string): string => {
                let cleanValue = rawValue;
                if (cleanValue.indexOf(":") >= 0) {
                  cleanValue = cleanValue.split(":")[0];
                }
                if (cleanValue.indexOf("#") >= 0) {
                  cleanValue = cleanValue.split("#")[1];
                }
                return cleanValue;
              };

              const headerKey = findKey(output.headers, "x-amzn-errortype");
              if (headerKey !== undefined) {
                return sanitizeErrorCode(output.headers[headerKey]);
              }

              if (data.code !== undefined) {
                return sanitizeErrorCode(data.code);
              }

              if (data["__type"] !== undefined) {
                return sanitizeErrorCode(data["__type"]);
              }

              return "";
            };
