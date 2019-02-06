'use strict';

const { unlinkSync } = require('fs');
const execa = require('execa');
const exitHook = require('exit-hook');
const NetworkSetup = require('./network-setup');
const tempWrite = require('temp-write');

const isSupported = () => process.platform === 'darwin' && has('ergo');

exports.name = 'ergo';

exports.apply = api => {
  if (!api.cli.options.serve || !isSupported()) return;
  let port;
  api.hook('createServer', config => ({ port } = config));
  api.hook('createWebpackChain', config => {
    config.plugin('ergo-proxy').use({
      apply(compiler) {
        let isFirstBuild = true;
        compiler.hooks.done.tap('ergo-proxy', stats => {
          if (!isFirstBuild || stats.hasErrors() || stats.hasWarnings()) return;
          setupProxy(port, api.pkg.data.name);
          isFirstBuild = false;
        });
      }
    });
  });
};

async function setupProxy(port, hostname, domain = '.test') {
  const networksetup = new NetworkSetup();
  networksetup.autoProxyUrl = 'http://localhost:2000/proxy.pac';
  const proxyUrl = `http://${hostname}${domain}`;
  const temp = await tempWrite(`${hostname}  http://localhost:${port}`, '.ergorc');
  exitHook(() => {
    unlinkSync(temp);
    networksetup.autoProxyUrl = null;
  });
  const args = [`-domain=${domain}`, `-config=${temp}`];
  execa('ergo', ['run', ...args]);
  console.log('Proxy url: %s', proxyUrl);
}

function has(cmd) {
  try {
    return Boolean(execa.sync('command', ['-v', cmd]).stdout);
  } catch (err) {
    return false;
  }
}
