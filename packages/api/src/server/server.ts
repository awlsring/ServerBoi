import { createServer, IncomingMessage, ServerResponse } from "http";
import {
  ServerBoiService as __ServerBoiService,
  getServerBoiServiceHandler,
} from "@serverboi/ssdk";
import { ServiceHandler } from "./handler/service";
import { convertRequest, writeResponse } from "@aws-smithy/server-node";
import { ServiceContext } from "./handler/context";
import { loadConfig } from "../config";
import { ServerController } from "@serverboi/services";

const serviceHandler = getServerBoiServiceHandler(new ServiceHandler());
const cfg = loadConfig();
ServerController.getInstance(cfg.database)

export const server = createServer(async function (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {
  const authHeader = req.headers.authorization;
  const context: ServiceContext = {
    user: "user",
    key: authHeader,
    config: cfg,
  };
  const httpRequest = convertRequest(req);
  const httpResponse = await serviceHandler.handle(httpRequest, context);

  return writeResponse(httpResponse, res);
});
