require('dotenv').config();
let assert = require('assert');
MockCache = require('./MockCache');
logger = require('../config/logger');
expect = require('chai').expect;
env = require('../config/env');
sinon = require('sinon');
mockRequest = require('./MockRequest');
DirectionsController = require('../server/directions/controller');
request = require('request');
sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
sandbox = sinon.sandbox.create();
db = require('../config/connection');
uuid = require('uuid');

describe('Testing Directions Controller', function () {

  afterEach(function () {
    sandbox.restore();
  });

  describe('Test Cache Promise', function () {
    it('Test Cache Exists', function (done) {
      const data = {
        test: {
          'status': 'success',
          'total_distance': 4449,
          'total_time': 578,
          'path': [
            [
              22.4005755,
              114.2028937,
            ],
            [
              22.4034028,
              114.204583,
            ],
            [
              22.4034028,
              114.204583,
            ],
            [
              22.4050364,
              114.2057815,
            ],
            [
              22.4050364,
              114.2057815,
            ],
            [
              22.4060879,
              114.2080527,
            ],
            [
              22.4060879,
              114.2080527,
            ],
            [
              22.405415,
              114.2071463,
            ],
            [
              22.405415,
              114.2071463,
            ],
            [
              22.4045753,
              114.2075479,
            ],
            [
              22.4045753,
              114.2075479,
            ],
            [
              22.4041946,
              114.2065859,
            ],
            [
              22.4041946,
              114.2065859,
            ],
            [
              22.3937979,
              114.1992293,
            ],
            [
              22.3937979,
              114.1992293,
            ],
            [
              22.3920281,
              114.1988071,
            ],
            [
              22.3920281,
              114.1988071,
            ],
            [
              22.3896817,
              114.1993775,
            ],
            [
              22.3896817,
              114.1993775,
            ],
            [
              22.3851952,
              114.194089,
            ],
            [
              22.3851952,
              114.194089,
            ],
            [
              22.38683,
              114.192068,
            ],
            [
              22.38683,
              114.192068,
            ],
            [
              22.38688,
              114.1916348,
            ],
          ],
        }
      };
      cache = new MockCache(data, null);
      controller = new DirectionsController(cache, logger);
      controller.getDirectionFromCache('test')
        .then(function (result) {
          expect(JSON.stringify(result)).to.equal(JSON.stringify(data['test']));
          done();
        })
        .catch(function (err) {
          console.log(err);
          done();
        });
    });

    it('Test Cache Doesn\'t Exist', function (done) {
      cache = new MockCache({});
      controller = new DirectionsController(cache, logger);

      controller.getDirectionFromCache('test')
        .then(function (result) {
          expect(result).to.equal(null);
          done();
        })
        .catch(function (err) {
          console.log(err);
          done();
        });
    });

    it('Test Save Route to Cache', function (done) {
      const data = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38688,
            114.1916348,
          ],
        ],
      };
      cache = new MockCache({}, null);
      controller = new DirectionsController(cache, logger);
      controller.saveRouteInfoToCache('test', data);
      controller.getDirectionFromCache('test')
        .then(function (result) {
          expect(JSON.stringify(result)).to.equal(JSON.stringify(data));
          done();
        })
        .catch(done);
    });

    it('Test Save Route Info with null Token', function (done) {
      const data = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38688,
            114.1916348,
          ],
        ],
      };
      cache = new MockCache({});
      controller = new DirectionsController(cache, logger);
      controller.saveRouteInfoToCache(null, data);
      controller.getDirectionFromCache('test')
        .then(function (result) {
          expect(result).to.equal(null);
          done();
        })
        .catch(done);
    });

    it('Test Save Route Info with null info', function (done) {
      cache = new MockCache({});
      controller = new DirectionsController(cache, logger);
      controller.saveRouteInfoToCache('test', null);
      controller.getDirectionFromCache('test')
        .then(function (result) {
          expect(result).to.equal(null);
          done();
        })
        .catch(done);
    });

    it('Test Save Route Info with error', function (done) {
      const data = {test: {'key': 'value'}};

      cache = new MockCache(data);
      controller = new DirectionsController(cache, logger);

      let error = 'some error'
      sinon.stub(cache, 'set').yields(error);

      controller.saveRouteInfoToCache('test', data, 1800, function (err) {
        assert(error === err);
        done();
      })
    });

  });

  describe('Test Database', function () {

    it('Test Save Route Info To Database', function (done) {

      const data = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38688,
            114.1916348,
          ],
        ],
      };
      let token = uuid.v1();
      data.token = token; // generate a new token every time

      const expectedData = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38688,
            114.1916348,
          ],
        ],
      };

      controller = new DirectionsController({}, logger, db);
      controller.saveDirectionsToDatabase(data)
        .then(function (result) {
          return controller.getDirectionsFromDatabase(token);
        })
        .then(function (result) {
          controller.sanitizeRouteResponse(result, ['_id', 'token']);
          assert(JSON.stringify(result) === JSON.stringify(expectedData));
          done();
        })
        .catch(function (err) {
          assert.fail(err);
          done()
        });

    });

    it('Test Save Empty Route Info To Database', function (done) {
      const data = {};

      controller = new DirectionsController({}, logger, db);
      controller.saveDirectionsToDatabase(data)
        .catch(function (err) {
          assert(err.message === 'Route Info Empty or has no \'token\' key');
          done()
        });
    });

    it('Test Missing Token Info To Database', function (done) {
      const data = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38688,
            114.1916348,
          ],
        ],
      };

      controller = new DirectionsController({}, logger, db);
      controller.saveDirectionsToDatabase(data)
        .catch(function (err) {
          assert(err.message === 'Route Info Empty or has no \'token\' key');
          done();
        })
    });

    it('Test Saving null route info To Database', function (done) {
      const data = null;
      controller = new DirectionsController({}, logger, db);
      controller.saveDirectionsToDatabase(data)
        .catch(function (err) {
          assert(err.message === 'Route Info Empty or has no \'token\' key');
          done();
        })
    });

    it('Test Saving Initial Route Info To Database', function (done) {
      cache = new MockCache({});
      controller = new DirectionsController(cache, logger, db);

      let token = uuid.v1();
      let promise = new Promise(function (resolve, reject) {
        controller.createRouteInfoInDatabase(token, function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        })
      });

      promise
        .then(function (result) {
          return controller.getDirectionsFromDatabase(token);
        }, function (err) {
          assert.fail(err);
          done();
        })
        .then(function (result) {
          assert(result.status == 'in progress');
          done();
        });

    });
  });

  describe('Test Request Directions ', function () {

    let subbed;

    beforeEach(function () {
      stubbed = sinon.stub(request, 'get');
    });

    it('Test Create Directions Request', function (done) {

      const body = {
        route:
          [[22.400584, 114.202878],
            [22.386989, 114.191629],
            [22.386989, 114.191629]]
      };

      let requestURL = 'https://maps.googleapis.com/maps/api/directions/json?origin=' +
        '22.400584,114.202878&destination=22.386989,114.191629&waypoints=22.386989,114.191629|&key='
        + env[process.env.NODE_ENV].googleMapsAPIKey;

      let request = {url: requestURL, method: 'GET', json: true};
      const controller = new DirectionsController(null, logger);
      let result = controller.createDirectionsRequest(body.route);

      expect(JSON.stringify(result)).to.equal(JSON.stringify(request));
      done();
    });

    it('Test Correct Google Directions Request', function (done) {

      let requestURL = 'https://maps.googleapis.com/maps/api/directions/json?origin=' +
        '22.400584,114.202878&destination=22.386989,114.191629&waypoints=22.386989,114.191629|&key='
        + env[process.env.NODE_ENV].googleMapsAPIKey; // deliberately wrong key

      let requestOptions = {url: requestURL, method: 'GET', json: true};
      let body = {
        "geocoded_waypoints": [
          {
            "geocoder_status": "OK",
            "place_id": "ChIJsWt8kTAGBDQRugM1GzyxFRQ",
            "types": ["premise"]
          },
          {
            "geocoder_status": "OK",
            "place_id": "ChIJNbyr40wGBDQRCn7lr9chCg8",
            "types": ["street_address"]
          },
          {
            "geocoder_status": "OK",
            "place_id": "ChIJNbyr40wGBDQRCn7lr9chCg8",
            "types": ["street_address"]
          }
        ],
        "routes": [
          {
            "bounds": {
              "northeast": {
                "lat": 22.4062759,
                "lng": 114.2082122
              },
              "southwest": {
                "lat": 22.3851952,
                "lng": 114.1916348
              }
            },
            "copyrights": "Map data ©2018 Google",
            "legs": [
              {
                "distance": {
                  "text": "4.4 km",
                  "value": 4449
                },
                "duration": {
                  "text": "10 mins",
                  "value": 578
                },
                "end_address": "7 Wo Che St, Wo Che Estate, Hong Kong",
                "end_location": {
                  "lat": 22.38688,
                  "lng": 114.1916348
                },
                "start_address": "Royal Ascot Podium, Royal Ascot, Hong Kong",
                "start_location": {
                  "lat": 22.4005755,
                  "lng": 114.2028937
                },
                "steps": [
                  {
                    "distance": {
                      "text": "0.4 km",
                      "value": 382
                    },
                    "duration": {
                      "text": "2 mins",
                      "value": 129
                    },
                    "end_location": {
                      "lat": 22.4034028,
                      "lng": 114.204583
                    },
                    "html_instructions": "Head \u003cb\u003enortheast\u003c/b\u003e on \u003cb\u003eTsun King Rd\u003c/b\u003e toward \u003cb\u003eTsun King Rd\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eRestricted usage road\u003c/div\u003e\u003cdiv style=\"font-size:0.9em\"\u003eGo through 1 roundabout\u003c/div\u003e",
                    "polyline": {
                      "points": "sbvgCag`xTuC_ByCcBKEIEKCQG?@?@?@?@A??@A??@A@A??@A?A?A?A?A?A??AA?A??AA??A?AA??A?A?A?A?A?A?A?A@??A@??A@??A@?YSc@UCAm@Ya@SUGSE"
                    },
                    "start_location": {
                      "lat": 22.4005755,
                      "lng": 114.2028937
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.3 km",
                      "value": 251
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 37
                    },
                    "end_location": {
                      "lat": 22.4050364,
                      "lng": 114.2057815
                    },
                    "html_instructions": "Turn \u003cb\u003eright\u003c/b\u003e to stay on \u003cb\u003eTsun King Rd\u003c/b\u003e",
                    "maneuver": "turn-right",
                    "polyline": {
                      "points": "gtvgCsq`xT?E?K?EAGAKEMCMAEGMCECCIGIGKOOMIGGCGCGAKEOCKCGAIAC?_@?[@O@Q?I?IACAECECIMKa@"
                    },
                    "start_location": {
                      "lat": 22.4034028,
                      "lng": 114.204583
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.3 km",
                      "value": 273
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 24
                    },
                    "end_location": {
                      "lat": 22.4060879,
                      "lng": 114.2080527
                    },
                    "html_instructions": "At the roundabout, continue straight onto \u003cb\u003eTai Po Road (Ma Liu Shui)\u003c/b\u003e",
                    "maneuver": "roundabout-left",
                    "polyline": {
                      "points": "o~vgCcy`xTA?AAA?AAA?AAAAAA?AA??A?AA??A?A?AA??A?A?A?A?C@A?A?A@??A?A@??A@AKe@GWE]Ei@CSGYGUIW_@s@EIACGIY]EGMMOUW]"
                    },
                    "start_location": {
                      "lat": 22.4050364,
                      "lng": 114.2057815
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.2 km",
                      "value": 191
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 19
                    },
                    "end_location": {
                      "lat": 22.405415,
                      "lng": 114.2071463
                    },
                    "html_instructions": "At the roundabout, take the \u003cb\u003e3rd\u003c/b\u003e exit and stay on \u003cb\u003eTai Po Road (Ma Liu Shui)\u003c/b\u003e",
                    "maneuver": "roundabout-left",
                    "polyline": {
                      "points": "aewgCigaxT?@A??@A@A??@A?A@A?A?A?A@?AA?A?A?A??AA?AAA??AA??A?AA??A?AA??A?A?A?A?A?A?A@??A?A@??A?A@??A@??ABA@?@?@A@?@?@??@@?@?@@@??@@??@@??@@??@@@?@?@?@?@?@?@?@?@?@A??@V\\NTLLDFX\\FH@BDH^r@"
                    },
                    "start_location": {
                      "lat": 22.4060879,
                      "lng": 114.2080527
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.1 km",
                      "value": 115
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 14
                    },
                    "end_location": {
                      "lat": 22.4045753,
                      "lng": 114.2075479
                    },
                    "html_instructions": "Turn \u003cb\u003eleft\u003c/b\u003e toward \u003cb\u003eNew Territories Circular Rd\u003c/b\u003e/\u003cb\u003eTai Po Road (Sha Tin)\u003c/b\u003e",
                    "maneuver": "turn-left",
                    "polyline": {
                      "points": "{`wgCuaaxTJBLBD@@@H?F@N?RAFCFEPONULU@ALS"
                    },
                    "start_location": {
                      "lat": 22.405415,
                      "lng": 114.2071463
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.3 km",
                      "value": 291
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 29
                    },
                    "end_location": {
                      "lat": 22.4041946,
                      "lng": 114.2065859
                    },
                    "html_instructions": "Take the \u003cb\u003eRoute 9\u003c/b\u003e ramp to \u003cb\u003eSha Tin\u003c/b\u003e/\u003cb\u003eKowloon\u003c/b\u003e/\u003cb\u003eTsuen Wan\u003c/b\u003e/\u003cb\u003eAirport\u003c/b\u003e/\u003cb\u003e沙田\u003c/b\u003e/\u003cb\u003e九龍\u003c/b\u003e/\u003cb\u003e荃灣\u003c/b\u003e/\u003cb\u003e機場\u003c/b\u003e",
                    "polyline": {
                      "points": "s{vgCedaxTFOHU@I@I?IAICICGCEGGGEGAICIAC?C?C@E?C@EBEDCBABCBAFAH?D?D@B?B@DLPLRLTVd@JNLPLPHHTh@Rj@"
                    },
                    "start_location": {
                      "lat": 22.4045753,
                      "lng": 114.2075479
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "1.4 km",
                      "value": 1391
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 68
                    },
                    "end_location": {
                      "lat": 22.3937979,
                      "lng": 114.1992293
                    },
                    "html_instructions": "Merge onto \u003cb\u003eNew Territories Circular Rd\u003c/b\u003e/\u003cb\u003eTai Po Road (Sha Tin)\u003c/b\u003e",
                    "maneuver": "merge",
                    "polyline": {
                      "points": "eyvgCe~`xTd@p@z@hARTp@r@l@n@nAjA|AnAnAbAbDrBfB`A|A~@vAp@vAx@rC`BFDFBLDtI|E~GvDjB|@pAd@hAZ"
                    },
                    "start_location": {
                      "lat": 22.4041946,
                      "lng": 114.2065859
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.2 km",
                      "value": 202
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 10
                    },
                    "end_location": {
                      "lat": 22.3920281,
                      "lng": 114.1988071
                    },
                    "html_instructions": "Keep \u003cb\u003eleft\u003c/b\u003e to continue on \u003cb\u003eSha Tin Rd\u003c/b\u003e/\u003cb\u003eRoute 1\u003c/b\u003e, follow signs for \u003cb\u003eSha Tin Central\u003c/b\u003e/\u003cb\u003e沙田市中心\u003c/b\u003e",
                    "maneuver": "keep-left",
                    "polyline": {
                      "points": "gxtgCep_xTV?PBdAZzBZb@FpAN"
                    },
                    "start_location": {
                      "lat": 22.3937979,
                      "lng": 114.1992293
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.3 km",
                      "value": 271
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 29
                    },
                    "end_location": {
                      "lat": 22.3896817,
                      "lng": 114.1993775
                    },
                    "html_instructions": "Take exit \u003cb\u003e12B\u003c/b\u003e toward \u003cb\u003eSha Tin Central\u003c/b\u003e/\u003cb\u003e沙田市中心\u003c/b\u003e",
                    "maneuver": "ramp-left",
                    "polyline": {
                      "points": "emtgCqm_xTr@@lAATAj@Cv@MrA_@VIf@SZM@?DCBABADABADABADA"
                    },
                    "start_location": {
                      "lat": 22.3920281,
                      "lng": 114.1988071
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.8 km",
                      "value": 761
                    },
                    "duration": {
                      "text": "3 mins",
                      "value": 153
                    },
                    "end_location": {
                      "lat": 22.3851952,
                      "lng": 114.194089
                    },
                    "html_instructions": "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eYuen Wo Rd\u003c/b\u003e",
                    "maneuver": "turn-right",
                    "polyline": {
                      "points": "o~sgCcq_xT@?B?BAB?@?B?BA@?H@F?BJ?B@BJt@Nt@BHXz@Vd@JXZr@R`@N\\Xb@RXh@j@j@j@dA`AlAjAdAfA|FjFJJ\\Zh@h@"
                    },
                    "start_location": {
                      "lat": 22.3896817,
                      "lng": 114.1993775
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "0.3 km",
                      "value": 276
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 55
                    },
                    "end_location": {
                      "lat": 22.38683,
                      "lng": 114.192068
                    },
                    "html_instructions": "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eWo Che St\u003c/b\u003e",
                    "maneuver": "turn-right",
                    "polyline": {
                      "points": "obsgCap~wTGHMP_@d@W^]b@SX}@fAMPEDc@j@_@h@a@j@MP"
                    },
                    "start_location": {
                      "lat": 22.3851952,
                      "lng": 114.194089
                    },
                    "travel_mode": "DRIVING"
                  },
                  {
                    "distance": {
                      "text": "45 m",
                      "value": 45
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 11
                    },
                    "end_location": {
                      "lat": 22.38688,
                      "lng": 114.1916348
                    },
                    "html_instructions": "Slight \u003cb\u003eleft\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the right\u003c/div\u003e",
                    "maneuver": "turn-slight-left",
                    "polyline": {
                      "points": "ulsgCmc~wTEXCb@?V?@"
                    },
                    "start_location": {
                      "lat": 22.38683,
                      "lng": 114.192068
                    },
                    "travel_mode": "DRIVING"
                  }
                ],
                "traffic_speed_entry": [],
                "via_waypoint": []
              },
              {
                "distance": {
                  "text": "1 m",
                  "value": 0
                },
                "duration": {
                  "text": "1 min",
                  "value": 0
                },
                "end_address": "7 Wo Che St, Wo Che Estate, Hong Kong",
                "end_location": {
                  "lat": 22.38688,
                  "lng": 114.1916348
                },
                "start_address": "7 Wo Che St, Wo Che Estate, Hong Kong",
                "start_location": {
                  "lat": 22.38688,
                  "lng": 114.1916348
                },
                "steps": [
                  {
                    "distance": {
                      "text": "1 m",
                      "value": 0
                    },
                    "duration": {
                      "text": "1 min",
                      "value": 0
                    },
                    "end_location": {
                      "lat": 22.38688,
                      "lng": 114.1916348
                    },
                    "html_instructions": "Head",
                    "polyline": {
                      "points": "_msgCu`~wT"
                    },
                    "start_location": {
                      "lat": 22.38688,
                      "lng": 114.1916348
                    },
                    "travel_mode": "DRIVING"
                  }
                ],
                "traffic_speed_entry": [],
                "via_waypoint": []
              }
            ],
            "overview_polyline": {
              "points": "sbvgCag`xTeIoE]I?BCDMBIKBM@CWSwBeAi@M?QIg@Qg@c@c@YUOGo@Ou@CgABMCKGIMKa@A?ECCAGIAKBMBES}@KgAKm@Qm@o@kAwAeBKFMAIK@OJKN@HH?NT`@|@hAn@jA`@JP@b@ANI`@e@NWTc@J_@@SESGMOMQEU?UJKR?X\\n@~@|AVZh@tA`BzBdAhA|BzBlDrCbDrBfB`A|A~@vAp@jFzCNHbJbF~GvDjB|@pAd@hAZh@BdAZzBZtBV`C?`AEv@MrA_@~@]f@SRG\\EV?PhAR~@p@`BjAlCl@|@tAvArClCbIrHh@f@h@h@GHm@v@u@bAeBxBsBrCI|@?X"
            },
            "summary": "New Territories Circular Rd/Tai Po Road (Sha Tin)",
            "warnings": [],
            "waypoint_order": [0]
          }
        ],
        "status": "OK"
      };
      let data = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4034028,
            114.204583,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4050364,
            114.2057815,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.4060879,
            114.2080527,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.405415,
            114.2071463,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4045753,
            114.2075479,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.4041946,
            114.2065859,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3937979,
            114.1992293,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3920281,
            114.1988071,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3896817,
            114.1993775,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.3851952,
            114.194089,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38683,
            114.192068,
          ],
          [
            22.38688,
            114.1916348,
          ],
        ],
      };

      stubbed = sinon.stub(request, 'get').yields(null, null, body);
      cache = new MockCache({});
      const controller = new DirectionsController(cache, logger);

      controller.directionsFromGoogle(requestOptions, 'test')
        .then(function (result) {
          controller.sanitizeRouteResponse(result, ['token']);
          assert(JSON.stringify(result) === JSON.stringify(data));
          done();
        }, function (err) {
          assert.fail(err);
          done();
        });
    });

    it('Test Incorrect API Key', function (done) {

      let requestURL = 'https://maps.googleapis.com/maps/api/directions/json?origin=' +
        '22.400584,114.202878&destination=22.386989,114.191629&waypoints=22.386989,114.191629|&key='
        + env[process.env.NODE_ENV].KEYDOESNTEXIST; // deliberately wrong key

      let requestOptions = {url: requestURL, method: 'GET', json: true};
      let errorBody = {
        error_message: 'The provided API key is invalid.',
        routes: [],
        status: 'REQUEST_DENIED'
      };

      let error = new Error('some error');
      stubbed = sinon.stub(request, 'get').yields(error, null, errorBody);
      const controller = new DirectionsController(null, logger);

      controller.directionsFromGoogle(requestOptions, 'test')
        .catch(function (err) {
          assert(err === error);
          done();
        })
    });

    afterEach(function () {
      if (stubbed !== null) {
        console.log('test');
        // console.log(stubbed);
        request.get.restore();
        stubbed.restore();
      }
    });
  });

  describe('Test Result Sanitation', function () {
    it('Test js object sanitation', function (done) {
      const data = {
        '_id': 'should not appear',
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
        ],
      };
      const expectedData = {
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
        ],
      };
      const controller = new DirectionsController(null);
      controller.sanitizeRouteResponse(data, ['_id']);
      expect(JSON.stringify(expectedData)).to.equal(JSON.stringify(data));
      done();
    });
    it('Test js object sanitation without any keys', function (done) {
      const data = {
        '_id': 'should not appear',
        'status': 'success',
        'total_distance': 4449,
        'total_time': 578,
        'path': [
          [
            22.4005755,
            114.2028937,
          ],
          [
            22.4034028,
            114.204583,
          ],
        ],
      };
      const controller = new DirectionsController(null);
      controller.sanitizeRouteResponse(data, []);
      expect(JSON.stringify(data)).to.equal(JSON.stringify(data));
      done();
    });

    it('Test js object sanitation with null', function (done) {
      let data = null;
      const controller = new DirectionsController(null);
      controller.sanitizeRouteResponse(data, []);
      expect(data).to.equal(null);
      done();
    });

    it('Test js object sanitation with empty object', function (done) {
      let data = {};
      const controller = new DirectionsController(null);
      controller.sanitizeRouteResponse(data, []);
      expect(JSON.stringify(data)).to.equal(JSON.stringify({}));
      done();
    });

    it('Test js object sanitation with null keys to be filterd', function (done) {
      let data = {'key': 'value'};
      const controller = new DirectionsController(null);
      controller.sanitizeRouteResponse(data, null);
      expect(JSON.stringify(data)).to.equal(JSON.stringify(data));
      done();
    });
  });
});
