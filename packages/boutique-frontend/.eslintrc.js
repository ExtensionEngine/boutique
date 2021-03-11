'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine',
  plugins: ['vuetify'],
  overrides: [{
    files: ['src/**'],
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    }
  }],
  rules: {
    'vuetify/no-deprecated-classes': 'error'
  }
};
