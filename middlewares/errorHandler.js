const { StatusCodes } = require('http-status-codes');

module.exports = (err, req, res, next) => {
  const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};