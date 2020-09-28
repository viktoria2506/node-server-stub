import Server from '../src/index.js';
import assert from 'assert';
import got from 'got';
import { promises as fs } from 'fs';


describe('Regression tests', () => {
    let server = null;

    afterEach(async () => {
        if (server) {
            await server.finish();

            server = null;
        }
    });

    it('Run server with custom host', async () => {
        server = new Server({
            port: '1337',
            host: '127.0.0.1'
        });

        await server.start();

        const result   = await fs.readFile('./resources/pages/index.html', 'utf8');
        const response = await got('http://127.0.0.1:1337/');

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, result);
    });

    it('Run server with wrong host', async () => {
        const wrongServer = new Server({
            host: 'Wrong host'
        });

        await assert.rejects(async () => wrongServer.start());
    });
});
