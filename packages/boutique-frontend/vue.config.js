'use strict';

require('dotenv').config();
const path = require('path');

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
      target: `http://${process.env.IP}:${process.env.SERVER_PORT}`
    }
  },
  // Override using: `npm run start -- --port <number>`
  port: 8081
};

module.exports = {
  pluginOptions: {
    cleanOutDir: {
      cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep']
    },
    envs: {
      API_PATH: process.env.API_PATH,
      AUTH_JWT_SCHEME: process.env.AUTH_JWT_SCHEME
    }
  },
  pages: {
    admin: {
      filename: 'admin/index.html',
      title: 'Administration',
      entry: './src/admin/main.js'
    },
    main: {
      filename: 'index.html',
      title: 'Boutique',
      entry: './src/main/main.js'
    }
  },
  chainWebpack(config) {
    config.resolve.alias.merge(aliases);
    config.resolve.extensions.merge(extensions);
  },
  devServer
};
