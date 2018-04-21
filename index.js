require('dotenv').config();
var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var Memcached = require('memcached');
var bodyParser = require('body-parser');
var memcached = new Memcached('127.0.0.1:11211', {poolSize: 20, idle: 400, timeout: 300});
var db = require('./config/connection');

app.use(bodyParser.json());

require('./server/directions/routes')(app, memcached);

http.createServer(app).listen(port, function () {
  console.log("HTTP listening on port", port);
});
