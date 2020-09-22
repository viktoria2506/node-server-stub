import assert from 'assert';
import got from 'got';
import {} from '../index.js';
import fs from 'fs';

describe('server', () => {
    it('get', async () => {
        const url      = 'http://localhost:1337/';
        const response = await got(url);

        assert.strictEqual(response.statusCode, 200);
        fs.readFile('./resources/pages/index.html', fileContent => {
            console.log(fileContent.toString());
            assert.strictEqual(response.text, fileContent.toString());
        });
        setTimeout(process.exit, 400);
    });
});


