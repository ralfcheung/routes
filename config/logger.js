const winston = require('winston');
require('winston-daily-rotate-file');

let logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(winston.transports.DailyRotateFile, {
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });
}

module.exports = logger;
