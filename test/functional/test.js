import { Selector, t } from 'testcafe';
import fs from 'fs';
import Server from '../../src';
import os from 'os';
import path from 'path';
import assert from 'assert';

let server = null;
let files  = [];


async function waitForFileDownload (pathFile) {
    for (let i = 0; i < 10; i++) {
        if (fs.existsSync(pathFile))
            return true;
        await t.wait(500);
    }
    return fs.existsSync(pathFile);
}

fixture`Download and Upload`
    .page`http://localhost:1337`
    .before(async () => {
        server = new Server();

        server.start();
    })
    .after(async () => {
        for (let i = 0; i < files.length - 1; i++)
            fs.unlinkSync(files[i]);
        files = [];
        server.finish();
    });


test('Download file', async () => {
    const pict         = Selector('a[href="/download"]');
    const downloadPath = path.join(os.homedir(), 'Downloads', 'picture.jpg');

    files.push(downloadPath);
    await t
        .click(pict);
    const res = await waitForFileDownload(downloadPath);

    assert.strictEqual(res, true);
});


test('Upload file', async () => {
    const sub        = Selector('[type="submit"]');
    const uploadPath = path.join(os.homedir(), 'node-server-stub', 'resources', 'upload', 'imagetest.jpg');

    files.push(uploadPath);
    await t
        .setFilesToUpload(Selector('input').withAttribute('type', 'file'), '../data/imagetest.jpg')
        .click(sub);
    const res = await waitForFileDownload(uploadPath);

    assert.strictEqual(res, true);
});


