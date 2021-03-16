'use strict';

const { format } = require('util');
const { prettify } = require('sql-log-prettifier');

module.exports = {
  level: 'debug',
  customPrettifiers: {
    query(input) {
      const index = input.indexOf(': ') + 1;
      const sql = input.substring(index);
      return format('\n%s\n', prettify(sql, {
        format: true,
        settings: {
          functions: {
            color: '#5c6bc0',
            modifiers: ['bold']
          },
          keywords: {
            color: '#ff5555',
            modifiers: ['bold']
          },
          operators: {
            color: '#91b859',
            modifiers: ['bold']
          },
          strings: {
            color: '#ffffff'
          },
          numbers: {
            color: '#50fa7b'
          }
        }
      }));
    }
  }
};
