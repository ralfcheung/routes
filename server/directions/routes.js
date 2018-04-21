module.exports = function (app, cache) {
  const logger = require('../../config/logger');
  const controller = require('./controller')(cache, logger);

  app.get('/route/:token', controller.get);
  app.post('/route', controller.request);
};
