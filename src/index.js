const winston = require('winston');

const app = require('./app');
const config = require('./config');
const voting = require('./routes/voting/voting.controller');

const http = require('http');

/**
 * Create HTTP server.
 */

var server = http.createServer({
}, app);

server.listen(config.PORT, () => {
  Object.keys(config).forEach((key) => winston.info(`${key}: ${config[key]}`));
});

voting.init();