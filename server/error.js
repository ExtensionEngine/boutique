const { INTERNAL_SERVER_ERROR } = require('http-status');

class HttpError extends Error {
  constructor({ status = INTERNAL_SERVER_ERROR, message } = {}) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
