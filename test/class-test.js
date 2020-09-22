import express from 'express';
import Server from '../index.js';
import { config } from '../config.js';
import got from 'got';
import assert from 'assert';
import { promises as fs } from 'fs';

describe('server', () => {
    let server = null;

    before(async () => {
        server = new Server(config.port, express());
        await server.start();

    });

    after(async () => {
        await server.finish();
    });

    it('get', async () => {
        const result = await fs.readFile('./resources/pages/index.html', 'utf8');
        const url      = 'http://localhost:1337/';
        const response = await got(url);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, result);
    });
});
