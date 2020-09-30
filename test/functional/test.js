import { Selector, t } from 'testcafe';
import fs from 'fs';
import os from 'os';
import path from 'path';

import Server from '../../src/index.js';

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
        await server.start();
    })
    .after(async () => {
        files.forEach(file => fs.unlinkSync(file));
        files = [];
        await server.finish();
    });


test('Download file', async () => {
    const downloadLink = Selector('a[href="/download"]');
    const downloadPath = path.join(os.homedir(), 'Downloads', 'picture.jpg');

    files.push(downloadPath);
    await t
        .click(downloadLink);
    const res = await waitForFileDownload(downloadPath);

    await t.expect(res).ok();
});


test('Upload file', async () => {
    const submitButton = Selector('[type="submit"]');
    const resultPath   = path.join('resources', 'upload', 'imagetest.jpg');
    const uploadPath = '../data/imagetest.jpg';

    files.push(resultPath);
    await t
        .setFilesToUpload(Selector('input').withAttribute('type', 'file'), uploadPath)
        .click(submitButton);
    const res = await waitForFileDownload(resultPath);

    await t.expect(res).ok();
});


