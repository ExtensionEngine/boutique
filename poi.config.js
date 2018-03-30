require('dotenv').load();
const config = require('./server/config');
const path = require('path');

const aliases = {
  '@': path.resolve(__dirname, './client')
};

module.exports = (options, req) => ({
  presets: [
    require('poi-preset-eslint')({ mode: '*' }),
    require('poi-preset-bundle-report')()
  ],
  entry: {
    app: 'client/main.js'
  },
  dist: 'dist',
  staticFolder: 'client/static',
  extendWebpack(config) {
    configureModuleResolution(config);
    config.resolve.alias.merge(aliases);
  },
  sourceMap: options.mode === 'development',
  hotEntry: 'app',
  generateStats: true,
  // Override using: `npm run dev:server -- --port <number>`
  port: 8080,
  devServer: {
    proxy: {
      '/api': {
        target: `http://${config.ip}:${config.port}`
      }
    }
  }
});

// NOTE: Remove absolute path to local `node_modules` from configuration
// https://github.com/webpack/webpack/issues/6538#issuecomment-367324775
function configureModuleResolution(config) {
  const localModules = path.join(__dirname, 'node_modules');
  config.resolve.modules.delete(localModules);
  config.resolveLoader.modules.delete(localModules);
}
