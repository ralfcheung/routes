const winston = require('winston');
require('winston-daily-rotate-file');

var rotateTransport = new (winston.transports.DailyRotateFile)({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    rotateTransport
  ]
});


// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple()
//   }));
// }

module.exports = logger;