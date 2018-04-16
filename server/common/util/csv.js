const fs = require('fs');
const parse = require('csv-parse');
const Promise = require('bluebird');

const defaultOptions = {
  from: 1,
  to: 20,
  trim: true,
  delimiter: ',',
  columns: true // TODO: collect only the columns we need
};

/**
 * Accepts filePath string, reads file and returns error and parsed CSV data.
 * @param {string} filePath
 */
module.exports = function parseCsv(filePath, options = defaultOptions) {
  if (!filePath) {
    return Promise.reject(new Error('File path is required parameter.'));
  }

  return new Promise((resolve, reject) => {
    const callback = (err, data) => (err ? reject(err) : resolve(data));
    const parser = parse(options, callback);
    // CSV parser takes care of stream close, we just need to pipe stream
    fs.createReadStream(filePath).pipe(parser);
  });
};
