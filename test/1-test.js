process.env.NODE_ENV = 'test';

import chai from 'chai';

import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const should = chai.should();

describe('server', () => {
    it('get', done => {
        chai
            .request('http://localhost:1337')
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.include('hello');
                done();
            });
    });
});
