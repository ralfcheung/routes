require('dotenv').config();
let assert = require('assert');
MockCache = require('./MockCache'); // for mocking cache library
logger = require('../config/logger');
expect = require('chai').expect;
env = require('../config/env');
sinon = require('sinon');
DirectionsController = require('../server/directions/controller');
request = require('supertest');
sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
sandbox = sinon.sandbox.create();
db = require('../config/connection');
uuid = require('uuid');
app = require('../api/app');

describe('Integration Tests', function() {
  let server;

  beforeEach(function() {
    server = app.listen(3000);
  });

  it('Request Direction', function(done) {
    const body = {
      'route': [[22.400584, 114.202878],
        [22.386989, 114.191629], [22.386989, 114.191629]],
    };

    request(app)
      .post('/route')
      .send(body)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        assert(res.body.hasOwnProperty('token'));
        assert(res.body.token !== null);
        done();
      });
  });

  it('Request Direction Incorrect Body', function(done) {
    const body = {
      'roue': [[22.400584, 114.202878],
        [22.386989, 114.191629], [22.386989, 114.191629]],
    };

    request(app)
      .post('/route')
      .send(body)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(412);
        done();
      });
  });

  it('Request Direction and Get \'In Progress\'Info', function(done) {
    const body = {
      'route': [[22.400584, 114.202878],
        [22.386989, 114.191629], [22.386989, 114.191629]],
    };

    let promise = new Promise(function(resolve, reject) {
      request(app)
        .post('/route')
        .send(body)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          assert(res.body.hasOwnProperty('token')); // has a property token
          assert(res.body.token !== null); // token is not null
          assert(err === null); // no error
          resolve(res.body.token); // forward the token to the next promise
        });
    });

    promise.then(function(token) {
      // immediately call GET /route/:token
      request(app)
        .get('/route/' + token)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200); // should not get any errors back
          assert(res.body.status === 'in progress');
          // the route info should be in progress, since it's still being processed
          done();
        });
    });
  });

  it('Request Direction and Get Success Info', function(done) {
    const body = {
      'route': [[22.400584, 114.202878],
        [22.386989, 114.191629], [22.386989, 114.191629]],
    };

    let promise = new Promise(function(resolve, reject) {
      request(app)
        .post('/route')
        .send(body)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          assert(res.body.hasOwnProperty('token'));
          assert(res.body.token !== null);
          assert(err === null);
          resolve(res.body.token);
        });
    });

    promise.then(function(token) {
      // need to wait for a bit to process the route info to 'success'
      setTimeout(function() {
        request(app)
          .get('/route/' + token)
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            assert(res.body.status === 'success');
            done();
          });
      }, 1700);
    }, function(err) {
      done(err);
    });
  });

  afterEach(function() {
    server.close();
  });
});
