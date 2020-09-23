import express from 'express';

export default class Server {
    constructor (port) {
        this.port = port;
        this.app  = express();
        this.app.use(express.static('./resources/pages'));
        this.server = null;
    }

    async start () {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, () => {
                console.log(`Listening at http://localhost:${this.port}`);
                resolve();
            });

            this.server.on('error', () => {
                reject(new Error('already in use'));
            });
        });
    }

    async finish () {
        return new Promise((resolve, reject) => {
            try {
                this.server.close(() => {
                    console.log(`Process terminated ${this.port}`);
                    resolve();
                });
            } catch {
                reject(new Error('cannot finish because it is not running'));
            }
        });
    }
}
