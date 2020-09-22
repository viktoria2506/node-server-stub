import express from 'express';

export default class Server {
    constructor (port, app) {
        this.port = port;
        this.app  = app;
        this.app.use(express.static('./resources/pages'));
        this.server = null;
    }

    async start () {
        return new Promise(resolve => {
            this.server = this.app.listen(this.port, resolve);
            console.log(`Listening at http://localhost:${this.port}`);
        });
    }

    async finish () {
        return new Promise(resolve => {
            this.server.close(resolve);
            console.log('Process terminated');
        });
    }
}

