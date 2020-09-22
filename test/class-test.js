import Server from '../index.js';
import { config } from '../config.js';
import got from 'got';
import assert from 'assert';
import { promises as fs } from 'fs';

describe('static server', () => {
    let server = null;

    before(async () => {
        server = new Server(config.port);
        await server.start();
    });

    after(async () => {
        await server.finish();
    });

    it('server should return correct content and status', async () => {
        const result = await fs.readFile('./resources/pages/index.html', 'utf8');
        const url      = 'http://localhost:1337/';
        const response = await got(url);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, result);
    });
});
