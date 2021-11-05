/* eslint no-unused-vars: 0 */

const winston = require('winston');

module.exports.notFound = (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;

  next(error);
};

module.exports.catchAll = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something broke';

  winston.error(message);
  if(err.status > 499) {
    console.log(err.stack)
  }

  res.status(status).json({name:"Error",code:0,message:message});
};
