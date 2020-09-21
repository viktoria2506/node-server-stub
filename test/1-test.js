process.env.NODE_ENV = 'test';

import {} from '../index.js';

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
                responses.should.have.status(200);
                responses.text.should.be.include('hello');
            })
            .then(
                () => requester.close()
            )
        ;
    });
});
