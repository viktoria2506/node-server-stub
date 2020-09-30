import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

import config from './config.js';

export default class Server {
    constructor (conf = config) {
        this.config = {
            port: conf.port || config.port,
            host: conf.host || config.host
        };

        this.app = express();
        this.app.use(express.static('./resources/pages'));
        this.server = null;
        this.connections = new Set([]);
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

            this.server.on('connection', connection => {
                this.connections.add(connection);
                connection.on('close', () => {
                    this.connections.delete(connection);
                });
            });

            this.app.get('/download', (req, res) => {
                res.download('./resources/files/picture.jpg');
            });

            this.app.post('/upload', (req, res) => {
                const imagefile = req.files.image;

                imagefile.mv( './resources/upload/' + imagefile.name, () => {
                    console.log('File uploaded');
                    res.sendFile(path.join(__dirname, '../resources/pages/SuccessUpload.html'));
                });
            });
        });
    }

    async finish () {
        return new Promise((resolve, reject) => {
            try {
                this.connections.forEach(connection => connection.destroy());
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
