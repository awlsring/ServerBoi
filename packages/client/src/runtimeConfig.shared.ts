import { Logger as __Logger } from "@aws-sdk/types";
import { parseUrl } from "@aws-sdk/url-parser";
import { ServerBoiClientConfig } from "./ServerBoiClient";

/**
 * @internal
 */
export const getRuntimeConfig = (config: ServerBoiClientConfig) => ({
  apiVersion: "2023-03-19",
  disableHostPrefix: config?.disableHostPrefix ?? false,
  logger: config?.logger ?? {} as __Logger,
  urlParser: config?.urlParser ?? parseUrl,
});
