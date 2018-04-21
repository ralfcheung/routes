module.exports = function (cache, logger) {

  var request = require('request');
  var uuid = require('uuid');
  var model = require('./model');
  var db = require('../../config/connection');

  /*
  * Get directions from cache
  *
  * @param token: Token of the route info
  *
  * @return Promise object of the route info of the token, undefined if doesn't exist
  * */
  const getDirectionFromCache = function (token) {

    return new Promise(function (resolve, reject) {
      cache.get(token, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        if (!data) {
          logger.log('Cache missed:', token);
        }
        resolve(data);
      });
    });

  };

  /*
  * Get directions from database
  *
  * @param token: Token of the route info
  *
  * @return Promise object of the result
  * */
  const getDirectionsFromDatabase = function (token) {

    return new Promise(function (resolve, reject) {
      db.collection('routes').findOne({token: token}, function (err, result) {
        if (err) {
          reject(err);
        }
        logger.log('Found route ' + token + 'in database');
        resolve(result);
      });
    })

  };

  /*
  * Request directions from google
  *
  * @param url: URL of the directions requeset
  * @param id: Token of the route info
  *
  * @return Promise object of the route info, error otherwise
  * */
  const directionsFromGoogle = function (options, id) {

    return new Promise(function (resolve, reject) {

      request(options, function (error, response, body) {

        if (error) {
          logger.log('warn', 'Request direction error', {'info': error});
          reject(error);
        }

        let routeInfo = {token: id, status: "success"};

        routeInfo.total_distance = body.routes[0].legs[0].distance.value;
        routeInfo.total_time = body.routes[0].legs[0].duration.value;

        const steps = body.routes[0].legs[0].steps;

        let locations = [];

        for (var i = 0; i < steps.length; i++) {
          const step = steps[i];
          let startLocation = [step.start_location.lat, step.start_location.lng];
          let endLocation = [step.end_location.lat, step.end_location.lng];
          locations.push(startLocation);
          locations.push(endLocation);

        }

        routeInfo.path = locations;

        // cache the route info
        saveRouteInfoToCache(routeInfo);

        resolve(routeInfo);

      });

    });

  };

  /*
  * Save route info to database and cache the route info asynchronously
  *
  * @param routeInfo: Route information document according to the Route schema
  *
  * */
  const saveDirectionsToDatabase = function (routeInfo) {

    return new Promise(function (resolve, reject) {

      // update the record with the route info, or insert if it doesn't exist
      db.collection('routes').update({token: routeInfo.token}, routeInfo,
        {upsert: true}, function (err, result) {
          if (err) {
            logger.log('warn', 'Save direction error', {'info': err});
            reject(err);
          } else {
            resolve();
          }
        });

    });

  };

  /*
  * Create document of the route info in the database and set status to pending
  *
  * @param id: Token of the route info
  *
  * */
  const createRouteInfoInDatabase = function (id) {

    const info = {token: id, 'status': 'pending'};

    db.collection('routes').insert(info,
      function (err) {
        if (err) {
          logger.error('Create Route Info Error:', err);
          return;
        }
        logger.info('Created Route Info:', id);
      });

    saveRouteInfoToCache(info);

  };

  const saveRouteInfoToCache = function (routeInfo) {

    console.log(routeInfo);
    // cache the route information for 30mins
    cache.set(routeInfo.token, routeInfo, 1800, function (err) {
      if (err) {
        logger.error(err);
        return;
      }
      logger.info('Cached route info:', routeInfo.token);
    });

  }

  const createDirectionsRequest = function (locations) {

    let origin = locations[0];
    let destination = locations[1];
    let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin[0] + "," + origin[1] + "&destination=" + destination[0] + "," + destination[1];

    // parse the waypoints
    if (locations.length > 2) {

      let waypoints = "&waypoints=";
      for (var i = 1; i < locations.length - 1; i++) {  // only get the middle elements in the array
        let location = locations[i];
        waypoints += location[0] + "," + location[1] + "|";
      }
    }

    url += "&key=" + process.env.GOOGLE_MAPS_API;

    return {
      url: url,
      method: 'GET',
      json: true
    };

  }

  return {
    get: function (req, res) {

      let token = req.params.token;

      if (typeof token === 'undefined')
        return new Error('Missing token parameter');

      getDirectionFromCache(token)
        .then(function (result) {
          if (result) {
            return res.send({token: result});
          } else {
            return getDirectionsFromDatabase(token);
            // db call to fetch directions
          }
        })
        .then(function (result) {
          return res.send(result);
        })
        .catch(function (err) {
          return
        });

    },
    request: function (req, res) {

      let route = req.body.route;

      if (typeof route === 'undefined' && route.length < 2)
        return new Error('Missing token parameter');

      const options = createDirectionsRequest(route);
      const id = uuid.v1();

      // create a route collection in database with status set to pending
      createRouteInfoInDatabase(id);

      // request directions
      directionsFromGoogle(options, id)
        .then(saveDirectionsToDatabase)

      // return the token
      return res.send({token: id});
    }

  }

};
