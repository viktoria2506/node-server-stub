import Server from '../index.js';
import { config } from '../config.js';
import got from 'got';
import assert from 'assert';
import { promises as fs } from 'fs';

let servers = [];

async function startServer (port) {
    const server = new Server(port);

    await server.start();
    servers.push(server);
    return server;
}


describe('static server', () => {
    afterEach(async () => {
        const closeServers = [];

        servers.forEach(server => {
            closeServers.push(server.finish());
        });
        await Promise.all(closeServers);
        servers = [];
    });

    it('return correct content and status', async () => {
        const result = await fs.readFile('./resources/pages/index.html', 'utf8');

        await startServer(config.port);
        const url      = 'http://localhost:1337/';
        const response = await got(url);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, result);
    });

    it('еггог: port is already in use', async () => {
        await startServer(1348);
        const server2 = new Server(1348);

        servers.push(server2);
        await assert.rejects(
            async () => await server2.start(),
            { message: 'already in use' }
        );
    });
    it('error: close not running server', async () => {
        const server = new Server(1348);

        await assert.rejects(
            async () => await server.finish(),
            { message: 'not start' }
        );
    });

});

