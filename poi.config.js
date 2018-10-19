require('dotenv').config();
const config = require('./server/config');
const path = require('path');

const aliases = {
  '@': path.resolve(__dirname, './client')
};

const devServer = {
  headers: {
    'X-Powered-By': 'Webpack DevSever'
  },
  proxy: {
    '/api': {
      target: `http://${config.ip}:${config.port}`
    }
  }
};

module.exports = (options, req) => ({
  plugins: [
    require('@poi/plugin-eslint')({ command: '*' }),
    require('@poi/plugin-bundle-report')()
  ],
  entry: {
    admin: 'client/admin/main.js',
    student: 'client/student/main.js'
  },
  outDir: 'dist',
  html: [{
    filename: 'admin/index.html',
    excludeChunks: ['student']
  }, {
    filename: 'index.html',
    excludeChunks: ['admin']
  }],
  chainWebpack(config) {
    configureModuleResolution(config);
    config.resolve.alias.merge(aliases);
  },
  sourceMap: options.mode === 'development',
  hotEntry: ['student', 'admin'],
  generateStats: true,
  // Override using: `npm run dev:server -- --port <number>`
  port: 8081,
  devServer
});

// NOTE: Remove absolute path to local `node_modules` from configuration
// https://github.com/webpack/webpack/issues/6538#issuecomment-367324775
function configureModuleResolution(config) {
  const localModules = path.join(__dirname, 'node_modules');
  config.resolve.modules.delete(localModules);
  config.resolveLoader.modules.delete(localModules);
}
