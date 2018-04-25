'use strict';

let request = require('request');
let uuid = require('uuid');
let environment = require('../../config/env');
let APIError = require('../../error/AppError');

/* Controller for Directions
*
* */
class DirectionsController {
  /*
  * Constructor for DirectionsController
  *
  * @param cache {Object} Memcached object
  * @param logger {Object} Logger object
  * @param db {Object} MongoDB connection instance
  *
  * @return {Void}
  * */
  constructor(cache, logger, db) {
    this.cache = cache;
    this.logger = logger;
    this.db = db;
  }

  /*
  * Get directions from cache
  *
  * @param token {String} Token of the route info
  *
  * @return {Object} Promise object of the route info of the token,
  * undefined if doesn't exist
  * */
  getDirectionFromCache(token) {
    let that = this;

    return new Promise(function(resolve, reject) {
      that.cache.get(token, function(err, data) {
        if (err) {
          console.log('memcached error');
          that.logger.debug('Error in memcached', err);
        }

        if (data) {
          console.log('Found data in cache', token);
          that.logger.debug('Found data in cache', token);
          resolve(data);
        } else {
          console.log('Didn\'t find data in cache', token);
          resolve(null);
        }
      });
    });
  }

  /*
  * Get directions from database
  *
  * @param token {String}: Token of the route info
  *
  * @return {Object} Promise object of the result
  * */
  getDirectionsFromDatabase(token) {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.db.collection('routes').findOne({token: token},
        function(err, result) {
        if (err) {
          return reject(err);
        }

        that.logger.debug('Found route ' + token + 'in database');
        return resolve(result);
      });
    });
  }

  /*
  * Request directions from google
  *
  * @param {Object} options Requst options object for
  * requesting directions {url: String, method: String, json: Boolean}
  * @param {string} id: Token of the route info
  *
  * @return Promise object of the route info, error otherwise
  * */
  directionsFromGoogle(options, id) {
    let that = this;

    if (options === null || !options.hasOwnProperty('url')
      || !options.hasOwnProperty('method')
      || !options.hasOwnProperty('json') || options.url === null
      || options.method === null || options.json === null) {
      return;
    }

    return new Promise(function(resolve, reject) {
      request.get(options, function(error, response, body) {
        if (error || body.status !== 'OK') {
          that.logger.debug('Request direction error:', body.error_message);
          return reject(error);
        }

        let routeInfo = {token: id, status: 'success'};

        routeInfo.total_distance = body.routes[0].legs[0].distance.value;
        routeInfo.total_time = body.routes[0].legs[0].duration.value;

        const steps = body.routes[0].legs[0].steps;

        let locations = [];

        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          if (step.hasOwnProperty('start_location')) {
            let startLocation = [step.start_location.lat,
              step.start_location.lng];

            let endLocation = [step.end_location.lat, step.end_location.lng];
            locations.push(startLocation);
            locations.push(endLocation);
          }
        }

        routeInfo.path = locations;

        // cache the route info
        that.saveRouteInfoToCache(routeInfo.token, routeInfo);

        return resolve(routeInfo);
      });
    });
  }

  /*
  * Save route info to database and cache the route info asynchronously
  *
  * @param {Object} routeInfo: Route information
   * document according to the Route schema
  *
  * */
  saveDirectionsToDatabase(routeInfo) {
    let that = this;

    return new Promise(function(resolve, reject) {
      if (routeInfo === null || !routeInfo.hasOwnProperty('token')) {
        return reject(new Error('Route Info Empty or has no \'token\' key'));
      }

      // update the record with the route info, or insert if it doesn't exist
      that.db.collection('routes').update({token: routeInfo.token}, routeInfo,
        {upsert: true}, function(err, result) {
          if (err) {
            if (process.env.NODE_ENV !== 'test') {
              that.logger.warn('Save direction error', {'info': err});
            }
            reject(err);
          } else {
            resolve();
          }
        });
    });
  }

  /*
  * Create document of the route info in the database and set status to pending
  *
  * @param {String} id Token of the route info
  *
  * @returns {Void}
  * */
  createRouteInfoInDatabase(id, cb = null) {
    const info = {'token': id, 'status': 'in progress'};

    this.db.collection('routes').insert(info, (err) => {
        if (err) {
          if (process.env.NODE_ENV !== 'test') {
            this.logger.warn('Create Route Info Error:', err);
          }
          if (cb !== null) {
            cb(err);
          }
          return;
        }

        if (cb !== null) {
          cb();
        }

      if (process.env.NODE_ENV === 'test'
        || process.env.NODE_ENV === 'development') {
        this.logger.info('Created Route Info:', id);
      }
    });

    // cache it, even though it's pretty much an empty document
    this.saveRouteInfoToCache(info.token, info);
  }

  /*
  * Save route info to cache
  * @param {string} token ID of the route info in String.
  * @param {object} routeInfo Route info document to be cached.
  * @param {number} duration: How long is the routeInfo going
  * to be cached for, default 1800s (30 mins).
  * @returns {void}
  * */
  saveRouteInfoToCache(token, routeInfo, duration = 1800, cb = null) {
    // ignore null info
    if (routeInfo === null || token === null) {
      return;
    }

    // cache the route information for 30mins
    this.cache.set(token, routeInfo, duration, (err) => {
      if (err) {
        if (process.env.NODE_ENV === 'test'
          || process.env.NODE_ENV === 'development') {
          this.logger.warn(err);
        }
        if (cb) {
          cb(err);
        }
        return;
      }

      if (process.env.NODE_ENV === 'test'
        || process.env.NODE_ENV === 'development') {
        this.logger.info('Cached route info:', token);
      }

      if (cb) {
        cb(null);
      }
    });
  }

  /* Create a directions request
  *
  * @param {Array.Array} location List of Coordinates
  * [[lat, lng], [lat2, lng2]...]
  *
  * @return {Object} Request object in the format of
  * {url: String, method: String, json: Boolean}
  * */
  createDirectionsRequest(locations) {
    let origin = locations[0];
    let destination = locations[1];
    let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin[0] + ',' +
      origin[1] + '&destination=' + destination[0] + ',' + destination[1];

    // parse the waypoints
    if (locations.length > 2) {
      let waypoints = '&waypoints=';
      for (let i = 1; i < locations.length - 1; i++) {
        // only get the middle elements in the array
        if (i % 100 === 0) {
          process.nextTick(); // since this may last a long time,
          // process the next request first
        }
        let location = locations[i];
        waypoints += location[0] + ',' + location[1] + '|';
      }
      url += waypoints;
    }

    url += '&key=' + environment[process.env.NODE_ENV].googleMapsAPIKey;

    return {
      url: url,
      method: 'GET',
      json: true,
    };
  }

  /*
  * Sanitize object function with list of keys,
  * performs delete on the object itself, does not create a new object
  *
  * @param {Object} obj object to be sanitized
  * @param {Array.String} keys to be sanitized in the object.
  *
  * @return {Void} If obj or keys are null
  * */
  sanitizeRouteResponse(obj, keys = ['_id', 'token']) {
    if (keys instanceof Array && obj !== null && typeof obj === 'object') {
      keys.forEach((e) => delete obj[e]);
    } else {
      return;
    }
  }

  /*
  * Get function for GET /route
  *
  * @param {Object} req Request object from express
  * @param {Object} res Response object from express
  *
  * @return {Void}
  * */
  get(req, res) {
    let token = req.params.token;

    if (typeof token === 'undefined') {
      throw new Error('Missing token parameter');
    }

    this.getDirectionFromCache(token)
      .then((result) => {
        if (result) {
          this.sanitizeRouteResponse(result, ['_id', 'token']);
          return res.send(result);
        }
        return this.getDirectionsFromDatabase(token);
        // db call to directions document
      })
      .then((result) => {
        if (result) {
          this.sanitizeRouteResponse(result, ['_id', 'token']);
          return res.send(result);
        }
        return res.send({
          'status': 'failure',
          'error': 'Token \'' + token + '\' not found',
        });
      })
      .catch(function(err) {
        return err;
      });
  }

  /*
  * Get function for GET /route
  *
  * @param {Object} req Request object from express
  * @param {Object} res Response object from express
  * @param {Function} next Next step in the pipeline after this function,
  * used to pass Error
  *
  * @return {Void}
  * */
  requestDirections(req, res, next) {
    let route = req.body;

    if (typeof route === 'undefined' || route.length < 2) {
      return next(new APIError('Incorrect body, should be: ' +
        '{route: [["ROUTE_START_LATITUDE\", ' +
        '\"ROUTE_START_LONGITUDE\"] [\"DROPOFF_LATITUDE_#1\",' +
        ' \"DROPOFF_LONGITUDE_#1\"],' + '...]}', 412));
    }

    const id = uuid.v1();

    // create a route collection in database with status set to pending
    this.createRouteInfoInDatabase(id);

    // in actual production, the following request would be
    // sent to a MQ (Kafka, Rabbit, etc)
    // and processed by different consumers (e.g. analytics,
    // actual directions request)
    const options = this.createDirectionsRequest(route);

    // request directions
    this.directionsFromGoogle(options, id)
      .then(this.saveDirectionsToDatabase.bind(this))
      .catch(this.logger.error.bind(this.logger));

    // return the token
    return res.send({token: id});
  }
}

module.exports = DirectionsController;
