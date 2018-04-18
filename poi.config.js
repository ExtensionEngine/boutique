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
    admin: 'client/admin/main.js',
    student: 'client/student/main.js'
  },
  dist: 'dist',
  html: [{
    filename: 'admin/index.html',
    excludeChunks: ['student'],
    title: 'NTC SL Admin',
    favicon: './client/admin/static/assets/favicon.png'
  }, {
    filename: 'index.html',
    excludeChunks: ['admin']
  }],
  extendWebpack(config) {
    configureModuleResolution(config);
    config.resolve.alias.merge(aliases);
  },
  sourceMap: options.mode === 'development',
  hotEntry: ['student', 'admin'],
  generateStats: true,
  // Override using: `npm run dev:server -- --port <number>`
  port: 8081,
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
