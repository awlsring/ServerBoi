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
import { ProviderController, ServerController } from "@serverboi/backend-common";
import { UserAuthController } from "../controller/user-auth-controller";
import { HttpResponse } from "@aws-sdk/protocol-http";

const serviceHandler = getServerBoiServiceHandler(new ServiceHandler());
const cfg = loadConfig();

const controllerContext: ControllerContext = {
  server: new ServerController(cfg.database),
  provider: new ProviderController(cfg.database),
}

const userController = new UserAuthController(cfg.database);

const metrics = new ApiServicePrometheusMetrics({
  app: "serverboi-api",
  prefix: "api",
})

async function getUserFromHeaders(headers: IncomingHttpHeaders): Promise<string> {
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
    user = await getUserFromHeaders(headers);
  }
  console.log("User: ", user)
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
  
  if (req.url === "/metrics") {
    const metricsDump = await metrics.dump();
    res.writeHead(200, {
      "Content-Type": metrics.contentType,
    }).end(metricsDump);
    return;
  }

  const recievedAt = Date.now();
  let context: ServiceContext | undefined = undefined;
  let httpResponse: HttpResponse | undefined = undefined
  try {
    context = await buildContext(req.headers);
  } catch (e) {
    console.log(e)
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

  const httpRequest = convertRequest(req);

  if (!httpResponse && context) {
    httpResponse = await serviceHandler.handle(httpRequest, context);
  }

  const responseTime = Date.now() - recievedAt;
  metrics.observeRequest(httpRequest.method, httpRequest.path, httpResponse!.statusCode, responseTime)
  
  return writeResponse(httpResponse!, res);
});
