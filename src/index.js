import express from 'express';
import config from './config.js';
import fileUpload from 'express-fileupload';


export default class Server {
    constructor (port) {
        this.port = port || config.port;
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
            this.server = this.app.listen(this.port, () => {
                console.log(`Listening at http://localhost:${this.port}`);
                resolve();
            });

            this.app.get('/download', (req, res) => {
                res.download('./resources/files/picture.jpg');
                console.log('123');
            });


            this.app.post('/upload', (req, res) => {
                console.log('456');
                const f = req.files.image;

                f.mv( './resources/upload/' + f.name, () => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    console.log('uploaded');
                    res.write('Upload of file ' + f.name);
                    res.end();
                });
            });
            this.server.on('error', () => {
                this.server = null;
                reject(new Error('already in use'));
            });
        });
    }

    async finish () {
        return new Promise((resolve, reject) => {
            try {
                this.server.close(() => {
                    this.server = null;
                    console.log(`Process terminated ${this.port}`);
                    resolve();
                });
            }
            catch (error) {
                reject(new Error('cannot finish because it is not running'));
            }
        });
    }
}
