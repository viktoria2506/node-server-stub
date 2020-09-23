import { config } from './config.js';
import Server from './index.js';

const server = new Server(config.port);

server.start();
server.finish();
