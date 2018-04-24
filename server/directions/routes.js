const express = require('express');
const router = express.Router();

module.exports = function(cache, db) {
  let logger = require('../../config/logger');
  DirectionsController = require('./controller');

  let controller = new DirectionsController(cache, logger, db);

  router.get('/:token', controller.get.bind(controller));

  router.post('/', controller.requestDirections.bind(controller));

  return router;
};
