'use strict';

const execa = require('execa');

const isUrl = str => /https?:\/\//.test(str);
const parse = str => str.split(/\s*:\s+/);
const split = str => str.split(/\r?\n/g);

module.exports = class NetworkSetup {
  constructor() {
    this._services = this._getServices();
  }

  _run(args, options) {
    return execa.sync('networksetup', args, options).stdout;
  }

  _getServices() {
    const stdout = this._run(['-listallnetworkservices']);
    return split(stdout).slice(1);
  }

  get services() {
    return this._services;
  }

  get info() {
    return this.services.reduce((acc, service) => {
      const stdout = this._run(['-getautoproxyurl', service]);
      const lines = split(stdout);
      const [, url] = parse(lines[0]);
      const [, status] = parse(lines[1]);
      const data = { enabled: status === 'Yes' };
      if (isUrl(url)) data.url = url;
      return Object.assign(acc, { [service]: data });
    }, {});
  }

  set autoProxyUrl(proxyUrl) {
    if (proxyUrl && !isUrl(proxyUrl)) {
      throw new TypeError(`Invalid url provided: ${proxyUrl}`);
    }
    this.services.forEach(service => {
      this._run(['-setautoproxyurl', service, proxyUrl]);
      this._run(['-setautoproxystate', service, proxyUrl ? 'on' : 'off']);
    });
  }
};
