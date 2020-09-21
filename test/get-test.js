process.env.NODE_ENV = 'test';

import {} from '../index.js';
import assert from 'assert';
import chai from 'chai';

import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const should = chai.should();

const url = 'http://localhost:1337';

describe('server', () => {
    it('get', () => {
        const requester = chai.request(url).keepOpen();

        return requester
            .get('/')
            .then(responses => {
                // eslint-disable-next-line no-undef
                assert.strictEqual(responses.statusCode, 200);
                responses.should.have.status(200);
                responses.text.should.be.include('hello');
            })
            .then(
                () => {
                    requester.close();
                    process.exit(1);
                }
            )
            ;
    });
});
