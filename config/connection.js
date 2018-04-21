const mongoose = require('mongoose');
const configDB = require('./database.js');

const options = {
  db: {native_parser: true},
  server: {poolSize: 5},
  user: process.env.dbUser,
  pass: process.env.dbPassword
};

module.exports = connection = mongoose.createConnection(configDB.dbURL, options);

connection.on('connected', function () {
  console.log('Connected to Database');
});
