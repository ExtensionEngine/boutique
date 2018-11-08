'use strict';

function bulkEnrollmentMessage(
  userEmail = null, type = 'info', text = 'An error has ocurred') {
  const message = {
    type: type,
    text: `${text} for ${userEmail}`
  };
  return message;
}

module.exports = {
  bulkEnrollmentMessage
};
