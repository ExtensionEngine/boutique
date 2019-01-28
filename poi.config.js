require('dotenv').config();
const argv = require('minimist')(process.argv.slice(2));
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./server/config');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const extensions = ['.vue'];
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
  },
  // Override using: `npm run dev:client -- --port <number>`
  port: 8081,
  hot: true,
  hotEntries: ['admin', 'student']
};

const optimization = {
  splitChunks: {
    chunks: 'all'
  },
  runtimeChunk: true
};

module.exports = {
  plugins: [
    '@poi/eslint'
  ],
  pages: {
    admin: {
      filename: 'admin/index.html',
      entry: './client/admin/main.js'
    },
    student: {
      filename: 'index.html',
      entry: './client/student/main.js'
    }
  },
  output: {
    dir: 'dist',
    sourceMap: !isProduction
  },
  chainWebpack(config) {
    configureModuleResolution(config);
    config.resolve.alias.merge(aliases);
    config.resolve.extensions.merge(extensions);
  },
  configureWebpack(config) {
    config.optimization = optimization;
    if (!argv._.includes('--bundle-report')) return;
    config.plugins.push(new BundleAnalyzerPlugin());
  },
  devServer
};

// NOTE: Remove absolute path to local `node_modules` from configuration
// https://github.com/webpack/webpack/issues/6538#issuecomment-367324775
function configureModuleResolution(config) {
  const localModules = path.join(__dirname, 'node_modules');
  config.resolve.modules.delete(localModules);
  config.resolveLoader.modules.delete(localModules);
}
