require('dotenv').config();
let assert = require('assert'),
  base_url = 'http://localhost:3000/',
  directionsController = require('../server/directions/controller')();

describe('Hello World Server', function () {
  describe('GET /', function () {
    it('returns status code 200', function (done) {
      // expect(response.statusCode).toBe(200);
      done();
    });

    it('returns Hello World', function (done) {
      done();
    });
  });
});

describe('Testing directions controller', function () {
  describe(' ', function () {
    it('POST directions', function (done) {
      let req = {};
      req.body = {
        'route': [
          [22.400584, 114.202878],
          [22.386989, 114.191629],
          [22.386989, 114.191629],
        ]
      };
      let res = {};

      const next = function () {
        console.log('lala');
      };

      directionsController.request(req, res, next);
      done();
    });
  });
});
