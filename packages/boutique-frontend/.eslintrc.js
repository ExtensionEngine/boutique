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
    'vuetify/no-deprecated-classes': 'warn',
    'vue/component-definition-name-casing': ['warn', 'kebab-case'],
    'vue/valid-v-slot': ['error', {
      allowModifiers: true
    }]
  }
};
