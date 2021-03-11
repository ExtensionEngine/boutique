'use strict';

require('dotenv').config();
const config = require('./config');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const extensions = ['.vue'];
const aliases = {
  '@': path.resolve(__dirname, './src')
};

const devServer = {
  headers: {
    'X-Powered-By': 'Webpack DevSever'
  },
  proxy: {
    '/api': {
      target: `http://${config.ip}:${config.port}`
    }
  },
  // Override using: `npm run dev:client -- --port <number>`
  port: 8081,
  hotEntries: ['admin', 'main']
};

module.exports = {
  plugins: [
    '@poi/eslint',
    '@poi/bundle-report',
    {
      resolve: require.resolve('./build/plugins/clean-out-dir'),
      options: {
        cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep']
      }
    },
    require.resolve('./build/plugins/html-version-spec')
  ],
  pages: {
    admin: {
      filename: 'admin/index.html',
      entry: './src/admin/main.js'
    },
    main: {
      filename: 'index.html',
      entry: './src/main/main.js'
    }
  },
  output: {
    dir: 'dist',
    sourceMap: !isProduction
  },
  envs: {
    API_PATH: process.env.API_PATH,
    AUTH_JWT_SCHEME: process.env.AUTH_JWT_SCHEME
  },
  chainWebpack(config) {
    config.resolve.alias.merge(aliases);
    config.resolve.extensions.merge(extensions);
  },
  devServer
};
