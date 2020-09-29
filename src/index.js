import config from './config.js';
import express from 'express';
import fileUpload from 'express-fileupload';


export default class Server {
    constructor (conf = config) {
        this.config = {
            port: conf.port || config.port,
            host: conf.host || config.host
        };

        this.app = express();
        this.app.use(express.static('./resources/pages'));
        this.server = null;
        this.app.use(fileUpload({
            safeFileNames:     true,
            preserveExtension: true
        }));
    }

    async start () {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.config.port, this.config.host, () => {
                console.log(`Listening at http://${this.config.host}:${this.config.port}`);
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
                    console.log('File uploaded');
                    //document.location.href = 'http://localhost:63342/node-server-stub/resources/pages/SuccessUpload.html?_ijt=hmes24dvnn6207b999t9q4mlgb';
                    //res.write('Upload of file ' + imagefile.name);
                    res.end();
                });
            });
        });
    }

    async finish () {
        return new Promise((resolve, reject) => {
            try {
                this.server.close(() => {
                    console.log(`Process terminated (port = ${this.config.port}, host = ${this.config.host})`);
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
