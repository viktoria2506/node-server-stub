import { config } from './config.js';
import express from 'express';

const app = express();

module.exports.app = app;

app.use(express.static('./resources/pages'));

app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`);
});

