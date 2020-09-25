import express from 'express';
import config from './config.js';
import fileUpload from 'express-fileupload';


export default class Server {
    constructor (port, host) {
        this.port = port || config.port;
        this.host = host || config.host;
        this.app  = express();
        this.app.use(express.static('./resources/pages'));
        this.server = null;
        this.app.use(fileUpload({
            safeFileNames:     true,
            preserveExtension: true
        }));
    }

    async start () {
        return new Promise((resolve, reject) => {

            this.server = this.app.listen(this.port, this.host, () => {
                console.log(`Listening at http://${this.host}:${this.port}`);
                resolve();
            });

            this.server.on('error', () => {
                this.server = null;
                reject(new Error('already in use'));
            });

            this.app.get('/download', (req, res) => {
                res.download('./resources/files/picture.jpg');
            });

            this.app.post('/upload', (req, res) => {
                const imagefile = req.files.image;

                imagefile.mv( './resources/upload/' + imagefile.name, () => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    console.log('File uploaded');
                    res.write('Upload of file ' + imagefile.name);
                    res.end();
                });
            });
        });
    }

    async finish () {
        return new Promise((resolve, reject) => {
            try {
                this.server.close(() => {
                    console.log(`Process terminated (port = ${this.port}, host = ${this.host})`);
                    this.server = null;
                    resolve();
                });
            }
            catch (error) {
                reject(new Error('cannot finish because it is not running'));
            }
        });
    }
}
