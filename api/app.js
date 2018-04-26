require('dotenv').config();
const express = require('express');
const app = express();
const db = require('../config/connection');
const bodyParser = require('body-parser');
const Memcached = require('memcached');
const env = require('../config/env');
const memcached = new Memcached(process.env.MEMCACHED_HOST || env[process.env.NODE_ENV].memcacheURL,
  {idle: 1, timeout: 300, reconnect: 2, failures: 2, retries: 4});
const Raven = require('raven');

Raven.config(env[process.env.NODE_ENV].sentryKey,
  {sendTimeout: 5, autoBreadcrumbs: true})
  .install();

const directionsRoutes = require('../server/directions/routes')(memcached, db);

app.use(Raven.requestHandler());

// Record memcached server issues and report it to Sentry
memcached.on('issue', function(err) {
  Raven.captureMessage('Memcache server '+err.server+' issue: '
    + err.messages[0]);
});

memcached.on('failure', function(details) {
  Raven.captureMessage('Server ' + details.server + 'went down due to: '
    + details.messages.join(''));
});

memcached.on('reconnecting', function(details) {
  Raven.captureMessage('Total downtime caused by memcached server '
    + details.server + ' :' + details.totalDownTime + 'ms');
});

app.use(bodyParser.json());
app.use('/route', directionsRoutes); // Route API routes

app.use(Raven.errorHandler());

if (process.env.NODE_ENV === 'production') {
// API error handler
  app.use(function(req, res) {
    res.status(404);
    res.send({message: req.originalUrl+ ' not found'});
  });

  app.use(function(err, req, res, next) {
    const status = err.status || 500;
    res.status(status);
    res.json({
      status: status,
      message: err.message,
    });
  });
}

module.exports = app;
