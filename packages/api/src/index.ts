import { server } from "./server/server";
import { loadConfig } from './config';
import { logger } from '@serverboi/common';

logger.info('Starting server');
const cfg = loadConfig();
logger.level = cfg.logLevel ?? 'info';
logger.debug(`Log level set to ${logger.level}`);

const port = cfg.server.port ?? 8032;
server.listen(port);
logger.info(`Server started on port ${port}`);