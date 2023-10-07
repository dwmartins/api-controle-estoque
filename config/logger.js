const winston = require('winston');
const helper = require("../src/utilities/helper");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      return `${level}: ${message} ${helper.getDateTime()}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

module.exports = logger;
