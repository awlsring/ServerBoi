import { createServer, IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import {
  ServerBoiService as __ServerBoiService,
  getServerBoiServiceHandler,
} from "@serverboi/ssdk";
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
    controller: controllerContext,
  }
}

export const server = createServer(async function (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {

  let context: ServiceContext;
  try {
    context = await buildContext(req.headers);
  } catch (e) {
    console.log(e)
    return writeResponse(new HttpResponse({
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Unauthorized",
      }),

    }), res)
  }
  const httpRequest = convertRequest(req);
  const httpResponse = await serviceHandler.handle(httpRequest, context);

  return writeResponse(httpResponse, res);
});
