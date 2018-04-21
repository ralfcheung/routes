const mongoose = require('mongoose');
const configDB = require('./database.js');

const options = {
  native_parser: true,
  poolSize: 5,
  user: process.env.dbUser,
  pass: process.env.dbPassword,
  // mongos: true     <- enable it for scaling
};

mongoose.connect(configDB.dbURL, options);

module.exports = connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.on('connected', console.log.bind(console, 'Connected to MongoDB'));
