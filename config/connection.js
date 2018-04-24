const env = require('./env');
const mongoose = require('mongoose');
const configDB = require('./database.js')(env);
const logger = require('./logger');

const options = {
  native_parser: true,
  poolSize: 5,
  user: env.dbUser,
  pass: env.dbPassword,
  auto_reconnect: true,
  // mongos: true     <- enable it for scaling
};

mongoose.connect(configDB.dbURL, options);

module.exports = connection = mongoose.connection;

connection.on('error', function() {
  logger.error('MongoDB connection error:');
  mongoose.disconnect(); // mongoose doesn't disconnect on error
  throw new Error('Disconnected from MongoDB');
});

connection.on('connected',
  logger.info.bind(logger, 'Connected to MongoDB'));

connection.on('disconnected', function() {
  logger.error('Disconnected from MongoDB');
  throw new Error('Disconnected from MongoDB');
});

connection.on('reconnected',
  logger.info.bind(logger, 'Reconnected to MongoDB'));
