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
