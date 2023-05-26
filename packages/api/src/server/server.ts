import { createServer, IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import {
  ServerBoiService as __ServerBoiService,
  getServerBoiServiceHandler,
} from "@serverboi/ssdk";
import { ApiServicePrometheusMetrics } from "../metrics/prometheus-metrics-controller";
import { ServiceHandler } from "./handler/service";
import { convertRequest, writeResponse } from "@aws-smithy/server-node";
import { ControllerContext, ServiceContext } from "./handler/context";
import { loadConfig } from "../config";
import { ExecutionController, ProviderController, ServerController } from "@serverboi/backend-common";
import { UserAuthController } from "../controller/user-auth-controller";
import { HttpResponse } from "@aws-sdk/protocol-http";
import { logger } from "@serverboi/common";

const serviceHandler = getServerBoiServiceHandler(new ServiceHandler());
const cfg = loadConfig();
const log = logger.child({ name: "Server" });

const controllerContext: ControllerContext = {
  server: new ServerController(cfg.database),
  provider: new ProviderController(cfg.database),
  execution: new ExecutionController(cfg.database),
}

const userController = new UserAuthController(cfg.database);

const metrics = new ApiServicePrometheusMetrics({
  app: "serverboi-api",
  prefix: "api",
  server: {
    port: cfg.metrics?.port ?? 9090,
  }
});

async function getUserFromHeaders(headers: IncomingHttpHeaders): Promise<string> {
  log.debug("Getting user from headers")
  log.debug(`Headers: ${JSON.stringify(headers)}`)
  if (!headers["x-serverboi-user"]) {
    throw new Error("No user header");
  }

  return headers["x-serverboi-user"] as string;
}

async function buildContext(headers: IncomingHttpHeaders): Promise<ServiceContext> {
  const auth = headers.authorization;
  if (!auth) {
    throw new Error("No authorization header");
  }
  
  const authFields = auth.split(" ");
  if (authFields.length != 2) {
    throw new Error("Invalid authorization header");
  }
  const key = authFields[1];
  const userAuth = await userController.getUserAuth(key);

  let user: string = userAuth.scope;
  if (userAuth.scope === "Bot") {
    log.debug("Caller is bot user, getting user from headers")
    user = await getUserFromHeaders(headers);
  }
  log.debug(`Validated user: ${user}`)
  return {
    user: user,
    metrics: metrics,
    controller: controllerContext,
  }
}

export const server = createServer(async function (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {
  if (req.url === "/health") {
    log.debug("Received health request, returning 200");
    res.writeHead(200).end(JSON.stringify({ success: true }));
    return;
  }

  const recievedAt = Date.now();
  let context: ServiceContext | undefined = undefined;
  let httpResponse: HttpResponse | undefined = undefined

  log.debug("Building context")
  try {
    context = await buildContext(req.headers);
  } catch {
    log.debug("Failed to build context, returning 401")
    httpResponse = new HttpResponse({
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Unauthorized",
      }),
      
    })
  }

  log.debug("Converting request")
  const httpRequest = convertRequest(req);

  log.debug("Handling request")
  if (!httpResponse && context) {
    httpResponse = await serviceHandler.handle(httpRequest, context);
  }

  const responseTime = Date.now() - recievedAt;
  metrics.observeRequest(httpRequest.method, httpRequest.path, httpResponse!.statusCode, responseTime)
  
  log.debug("Writing response")
  return writeResponse(httpResponse!, res);
});