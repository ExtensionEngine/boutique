const fs = require('fs');
const Promise = require('bluebird');
const parse = require('csv-parse');

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
  if (!filePath) return Promise.reject(new Error('File path is required parameter.'));

  return new Promise((resolve, reject) => {
    const callback = (err, data) => (err ? reject(err) : resolve(data));
    const parser = parse(options, callback);
    fs.createReadStream(filePath).pipe(parser); // the CSV parser takes care of stream end and close
  });
};