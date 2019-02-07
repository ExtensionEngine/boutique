'use strict';

const execa = require('execa');

const cmd = str => `-${str.toLowerCase()}`;
const isUrl = str => /https?:\/\//.test(str);
const parse = str => str.split(/\s*:\s+/);
const split = str => str.split(/\r?\n/g);

module.exports = ({ logger } = {}) => {
  const api = {};

  api.getServices = () => {
    const stdout = networkSetup([cmd('listAllNetworkServices')]);
    return split(stdout).slice(1);
  };

  api.getAutoProxyUrl = service => {
    const stdout = networkSetup([cmd('getAutoProxyUrl'), service]);
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
    networkSetup([cmd('setAutoProxyUrl'), service, proxyUrl || ' ']);
    networkSetup([cmd('setAutoProxyState'), service, state ? 'on' : 'off']);
  };

  return api;

  function networkSetup(args = [], options = {}) {
    if (logger && logger.debug) logger.debug('execa:', 'networksetup', args);
    return execa.sync('networksetup', args, options).stdout;
  }
};
