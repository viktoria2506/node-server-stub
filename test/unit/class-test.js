import Server from '../../src';
import got from 'got';
import assert from 'assert';
import { promises as fs } from 'fs';
import request from 'supertest';

let servers = [];

async function startServer ({ conf, needInclude = true, needRun = true } = {}) {
    const server = new Server(conf);

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

describe('static server', () => {
    afterEach(async () => {
        await finishAll();
    });

    it('return correct content and status', async () => {
        const result = await fs.readFile('./resources/pages/index.html', 'utf8');

        await startServer();
        const url      = 'http://localhost:1337/';
        const response = await got(url);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.body, result);
    });

    it('еггог: port is already in use', async () => {
        await startServer({ conf: { port: 1348 } });
        const server2 = await startServer({ conf: { port: 1348 }, needInclude: false, needRun: false });

        await assert.rejects(
            async () => await server2.start(),
            { message: 'already in use' }
        );
    });
    it('error: close not running server', async () => {
        const server = await startServer({ needInclude: false, needRun: false });

        await assert.rejects(
            async () => await server.finish(),
            { message: 'cannot finish because it is not running' }
        );
    });

    it('error: close again', async () => {
        const server = await startServer({ needInclude: false });

        await server.finish();
        await assert.rejects(
            async () => await server.finish(),
            { message: 'cannot finish because it is not running' }
        );
    });
});

describe('Download and upload', () => {
    const fileName = 'imagetest.jpg';
    const filePath = './test/data/' + fileName;
    const newPath  = './resources/upload/' + fileName;

    afterEach(async () => {
        await finishAll();
    });

    after(async () => {
        await fs.unlink(newPath);
    });

    it('The file should upload successfully', async () => {
        const server = await startServer();

        await request(server.app)
            .post('/upload')
            .attach('image', filePath)
            .expect(200);

        const res = await fs.stat(newPath);

        assert(res.isFile());
    });

    it('The file should download successfully', async () => {
        const server = await startServer();
        const buf    = await fs.readFile('./resources/files/picture.jpg');

        await request(server.app)
            .get('/download')
            .expect(200)
            .then(response => {
                assert(response.body, buf);
            });
    });
});
