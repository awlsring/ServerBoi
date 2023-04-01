import { server } from "./server/server";
import { loadConfig } from './config';

const cfg = loadConfig();

const port = cfg.server.port ?? 8032;
server.listen(port);
console.error(`Listening on port ${port}!`);
