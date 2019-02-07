'use strict';

const execa = require('execa');

const flag = str => `-${str.toLowerCase()}`;
const isUrl = str => /https?:\/\//.test(str);
const parse = str => str.split(/\s*:\s+/);
const split = str => str.split(/\r?\n/g);

module.exports = ({ logger } = {}) => {
  const api = {};

  api.getServices = () => {
    const stdout = networkSetup('listAllNetworkServices');
    return split(stdout).slice(1);
  };

  api.getAutoProxyUrl = service => {
    const stdout = networkSetup('getAutoProxyUrl', [service]);
    const lines = split(stdout);
    const [, url] = parse(lines[0]);
    const [, status] = parse(lines[1]);
    const result = { enabled: status === 'Yes' };
    if (isUrl(url)) result.url = url;
    return result;
  };

  api.setAutoProxyUrl = (service, proxyUrl, state = Boolean(proxyUrl)) => {
    if (proxyUrl && !isUrl(proxyUrl)) {
      throw new TypeError(`Invalid url provided: ${proxyUrl}`);
    }
    networkSetup('setAutoProxyUrl', [service, proxyUrl || ' ']);
    networkSetup('setAutoProxyState', [service, state ? 'on' : 'off']);
  };

  return api;

  function networkSetup(cmd, args = [], options = {}) {
    args = [flag(cmd), ...args];
    if (logger && logger.debug) logger.debug('execa:', 'networksetup', args);
    return execa.sync('networksetup', args, options).stdout;
  }
};
