'use strict';

const execa = require('execa');
const exitHook = require('exit-hook');
const fs = require('fs');
const os = require('os');
const path = require('path');

exports.name = 'hotel';

const isMacOS = process.platform === 'darwin';
const hotelDir = path.join(os.homedir(), '.hotel');
const confFile = path.join(hotelDir, 'conf.json');
const prefix = `${exports.name}-plugin:`;

const isRunning = () => fs.existsSync(path.join(hotelDir, 'daemon.pid'));
const readConf = () => JSON.parse(fs.readFileSync(confFile));

exports.apply = api => {
  if (!api.cli.options.serve || !isMacOS) return;
  if (!has('hotel')) {
    api.logger.tip(prefix, 'Install `hotel` to enable dev proxy:\n$ npm i -g hotel\n');
    return;
  }
  let port;
  api.hook('createServer', config => ({ port } = config));
  api.hook('createWebpackChain', config => {
    config.plugin('hotel-proxy').use({
      apply(compiler) {
        let isFirstBuild = true;
        compiler.hooks.done.tap('hotel-proxy', stats => {
          if (!isFirstBuild || stats.hasErrors() || stats.hasWarnings()) return;
          setupProxy(port, api.pkg.data.name, api);
          isFirstBuild = false;
        });
      }
    });
  });
};

async function setupProxy(port, hostname, { logger }) {
  const serverUrl = `http://localhost:${port}`;
  // Register application.
  logger.debug(prefix, hotel('add', [serverUrl, '--name', hostname]));
  let isStarted = !isRunning();
  // Re-start proxy server.
  const stdout = hotel('start');
  logger.success(prefix, stdout);
  const [, proxyServerUrl] = stdout.split(/\s+/g);
  // Set system wide proxy.
  const debug = (...args) => logger.debug(prefix, ...args);
  const network = require('./network')({ logger: { debug } });
  const services = network.getServices();
  logger.debug('services:', services);
  const oldStates = services.map(it => ({
    service: it,
    ...network.getAutoProxyUrl(it)
  }));
  logger.debug('old states:', oldStates);
  services.forEach(it => network.setAutoProxyUrl(it, `${proxyServerUrl}/proxy.pac`));
  const tld = readConf().tld || 'localhost';
  const devUrl = `http://${hostname}.${tld}`;
  logger.success(prefix, `Proxy ${devUrl} -> ${serverUrl}`);
  exitHook(() => {
    // Stop proxy server if allowed.
    if (isStarted) logger.success(prefix, hotel('stop'));
    // Reset system proxy.
    oldStates.forEach(({ service, url, state }) => {
      return network.setAutoProxyUrl(service, url, state);
    });
  });
}

function hotel(cmd, args = [], options = {}) {
  return execa.sync('hotel', [cmd, ...args], options).stdout;
}

function has(cmd) {
  try {
    return Boolean(execa.sync('command', ['-v', cmd]).stdout);
  } catch (err) {
    return false;
  }
}
