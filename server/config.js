const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  ip: process.env.IP || '127.0.0.1',
  staticFolder: path.resolve(__dirname, '../dist'),
  uploadLimit: '10mb',
  cors: {
    allowedOrigins: [],
    allowedHeaders: []
  }
};
