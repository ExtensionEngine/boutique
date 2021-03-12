'use strict';

import ViteComponents from "vite-plugin-components";
const { createVuePlugin } = require('vite-plugin-vue2');
const { defineConfig } = require('vite');
const { resolve } = require('path');

module.exports = defineConfig({
  resolve: {
    alias: {
      '@main': `${resolve(__dirname, 'src/main')}`,
      '@admin': `${resolve(__dirname, 'src/admin')}`,
      '@': `${resolve(__dirname, 'src')}`
    }
  },

  build: {
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        admin: resolve(__dirname, 'src/admin/index.html')
      }
    }
  },

  plugins: [createVuePlugin({}), ViteComponents()],

  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: `http://localhost:3000`
      }
    },
  }
});
