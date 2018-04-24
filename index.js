require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const Memcached = require('memcached');
const path = require('path');
const env = require('./config/env');
const memcached = new Memcached(env[process.env.NODE_ENV].memcacheURL,
  {poolSize: 20, idle: 400, timeout: 300, reconnect: 2000, failures: 2, retrues: 3});
const Raven = require('raven');
const db = require('./config/connection');

memcached.on('issue', function (err) {
  console.log('issue');
  console.log(err);
});

memcached.on('failure', function (details) {
  sys.error('Server ' + details.server + 'went down due to: ' + details.messages.join(''));
});

memcached.on('reconnecting', function (details) {
  sys.debug('Total downtime caused by server ' + details.server + ' :' + details.totalDownTime + 'ms');
});

Raven.config(env[process.env.NODE_ENV].sentryKey, {sendTimeout: 5}).install();

app.use(Raven.requestHandler());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./server/directions/routes')(app, memcached, db);

app.use(Raven.errorHandler());

if (process.env.NODE_ENV === 'debug') {
  app.use(function onError(err, req, res, next) {
    res.send({'status': 'failure', 'error': err.message});
  });
}

http.createServer(app).listen(port, function () {
  console.log('HTTP listening on port', port);
});
