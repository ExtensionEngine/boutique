require('dotenv').config();
const config = require('./server/config');
const path = require('path');
const yn = require('yn');

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
  hotEntries: ['admin', 'student'],
  historyApiFallback: config.histroyApiFallbackOptions
};

module.exports = {
  plugins: [
    '@poi/eslint',
    '@poi/bundle-report',
    {
      resolve: require.resolve('./build/plugins/clean-out-dir'),
      options: { exclude: '.gitkeep' }
    },
    require.resolve('./build/plugins/html-version-spec')
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
  envs: {
    API_PATH: process.env.API_PATH,
    HISTORY_API_FALLBACK: yn(process.env.HISTORY_API_FALLBACK)
  },
  chainWebpack(config) {
    config.resolve.alias.merge(aliases);
    config.resolve.extensions.merge(extensions);
  },
  devServer
};
