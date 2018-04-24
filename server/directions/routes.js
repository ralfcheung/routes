module.exports = function (app, cache, db) {
  let logger = require('../../config/logger');
  DirectionsController = require('./controller');
  let controller = new DirectionsController(cache, logger, db);

  app.get('/route/:token', controller.get.bind(controller));
  app.post('/route', controller.requestDirections.bind(controller));

};
