require('dotenv').config();
const app = require('express')();
const api = require('./api/app');

// register API routes
app.use('/api', api);

module.exports = app;
