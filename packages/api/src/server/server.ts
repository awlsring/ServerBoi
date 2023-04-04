import { createServer, IncomingMessage, ServerResponse } from "http";
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

async function determineUserScope(auth?: string): Promise<string> {
  if (!auth) {
    throw new Error("No authorization header");
  }
  
  const authFields = auth.split(" ");
  if (authFields.length < 3) {
    throw new Error("Invalid authorization header");
  }
  const key = authFields[2];
  const userAuth = await userController.getUserAuth(key);

  switch (authFields[1]) {
    case "Bot":
      if (userAuth.scope === "Bot") {
        if (authFields.length < 5) {
          throw new Error("Invalid Bot authorization header");
        }
        return authFields[4];
      }
    case "User":
      return userAuth.scope;
    default:
      throw new Error(`Invalid authorization header. No field ${authFields[1]}`);
  }
}

export const server = createServer(async function (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {

  let user: string;
  try {
    user = await determineUserScope(req.headers.authorization);
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
  const context: ServiceContext = {
    user: user,
    controller: controllerContext,
  };
  const httpRequest = convertRequest(req);
  const httpResponse = await serviceHandler.handle(httpRequest, context);

  return writeResponse(httpResponse, res);
});
