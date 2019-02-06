'use strict';

const { readFileSync, writeFileSync } = require('fs');
const execa = require('execa');
const exitHook = require('exit-hook');
const NetworkSetup = require('./network-setup');
const os = require('os');
const path = require('path');

const confFile = path.join(os.homedir(), '.hotel/conf.json');
const isSupported = () => process.platform === 'darwin' && has('hotel');

exports.name = 'hotel';

exports.apply = api => {
  if (!api.cli.options.serve && !isSupported()) return;
  let port;
  api.hook('createServer', config => ({ port } = config));
  api.hook('createWebpackChain', config => {
    config.plugin('hotel-proxy').use({
      apply(compiler) {
        let isFirstBuild = true;
        compiler.hooks.done.tap('hotel-proxy', stats => {
          if (!isFirstBuild || stats.hasErrors() || stats.hasWarnings()) return;
          setupProxy(port, api.pkg.data.name);
          isFirstBuild = false;
        });
      }
    });
  });
};

async function setupProxy(port, hostname, tld = '.test') {
  tld = tld.replace(/^\./, '');
  updateJsonFile(confFile, { tld });
  execa.sync('hotel', ['add', `http://localhost:${port}`, '--name', hostname]);
  execa.sync('hotel', ['start']);
  const networksetup = new NetworkSetup();
  networksetup.autoProxyUrl = 'http://localhost:2000/proxy.pac';
  exitHook(() => {
    execa.sync('hotel', ['stop']);
    networksetup.autoProxyUrl = null;
  });
}

function updateJsonFile(path, data) {
  const config = JSON.parse(readFileSync(path));
  Object.assign(config, data);
  writeFileSync(path, JSON.stringify(config, null, 2));
  return config;
}

function has(cmd) {
  try {
    return Boolean(execa.sync('command', ['-v', cmd]).stdout);
  } catch (err) {
    return false;
  }
}
