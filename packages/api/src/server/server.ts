import { createServer, IncomingMessage, ServerResponse } from "http";
import {
  ServerBoiService as __ServerBoiService,
  getServerBoiServiceHandler,
} from "@serverboi/ssdk";
import { ServiceHandler } from "./handler/service";
import { convertRequest, writeResponse } from "@aws-smithy/server-node";
import { ServiceContext } from "./handler/context";

const serviceHandler = getServerBoiServiceHandler(new ServiceHandler());

export const server = createServer(async function (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {
  const authHeader = req.headers.authorization;
  const context: ServiceContext = {
    user: "user",
    key: authHeader
  };
  const httpRequest = convertRequest(req);
  const httpResponse = await serviceHandler.handle(httpRequest, context);

  return writeResponse(httpResponse, res);
});
