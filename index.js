require('dotenv').config();
const http = require('http'),
  express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  Memcached = require('memcached'),
  path = require('path'),
  memcached = new Memcached('127.0.0.1:11211', {poolSize: 20, idle: 400, timeout: 300}),
  Raven = require('raven');

Raven.config('https://e1b17b42c68a4837a4990328c1daa240@sentry.io/1193534').install();

app.use(Raven.requestHandler());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./server/directions/routes')(app, memcached);

app.get('/', function (req, res) {
  res.render('main', {title: 'Testing'});
});

app.use(Raven.errorHandler());

app.use(function onError(err, req, res, next) {
  res.send({'status': 'failure', 'error': err.message});
});

http.createServer(app).listen(port, function () {
  console.log("HTTP listening on port", port);
});
