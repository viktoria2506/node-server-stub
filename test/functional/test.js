import { Selector } from 'testcafe';
import { promises as fs } from 'fs';
import Server from '../../src';
import os from 'os';
import path from 'path';

let server = null;
let files  = [];

fixture`Download and Upload`
    .page`http://localhost:1337`
    .before(async () => {
        server = new Server();

        await server.start();
    })
    .after(async () => {
        for (let i = 0; i < files.length; i++)
            await fs.unlink(files[i]);
        files = [];
        server.finish();
    });


test('Download file', async t => {
    const pict = Selector('a[href="/download"]');
    const downloadPath = path.join(os.homedir(), 'Downloads', 'picture.jpg');

    files.push(downloadPath);

    await t
        .click(pict);
    await t
        .expect((await fs.stat(downloadPath)).isFile()).eql(true);
});

test('Upload file', async t => {
    const sub = Selector('[type="submit"]');
    const uploadPath = path.join(os.homedir(), 'node-server-stub', 'resources', 'upload', 'imagetest.jpg');

    files.push(uploadPath);
    await t
        .setFilesToUpload(Selector('input').withAttribute('type', 'file'), '../data/imagetest.jpg')
        .click(sub);
    await t
        .expect((await fs.stat(uploadPath)).isFile()).eql(true);
});


