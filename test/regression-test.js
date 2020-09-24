import Server from '../src/index.js';
import config from '../src/config.js';
import got from 'got';
import assert from 'assert';
import { promises as fs } from 'fs';

let servers = [];

async function startServer (port, host, needInclude = true, needRun = true) {
    const server = new Server(port, host);

    if (needInclude)
        servers.push(server);

    if (needRun)
        await server.start();

    return server;
}

async function finishAll () {
    const closeServers = [];

    servers.forEach(server => {
        closeServers.push(server.finish());
    });
    await Promise.all(closeServers);
    servers = [];
}

describe('Regression tests', () => {
    it('Run server with custom host', async () => {
        /*const server = startServer('1339', '127.0.0.1', false, false);

         await assert.doesNotReject(
            async () => await server.start()
        );*/
    });
});
