import { promises as fs } from 'fs';
import got from 'got';
import assert from 'assert';
import {} from '../index.js';

describe('server', () => {
    it('get', async () => {
        const result = await fs.readFile('./resources/pages/index.html', 'utf8');
        const url      = 'http://localhost:1337/';
        const response = await got(url);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, result);
        setTimeout(process.exit, 400);
    });
});
