'use strict';

const get = require('lodash/get');
const git = require('git-rev-sync');

exports.name = 'html-version-spec';

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    const { pages } = api.config;
    const { html } = api.config.output;

    if (html === false) return;
    if (pages) {
      for (const entryName of Object.keys(pages)) {
        config.plugin(`html-page-${entryName}`).tap(args => withVersion(api, args));
      }
    } else {
      config.plugin('html').tap(args => withVersion(api, args));
    }
  });
};

function withVersion(api, args) {
  const semver = get(api, 'pkg.data.version');
  let shortRev;

  try {
    shortRev = git.short();
  } catch (err) {
    console.error(err);
  }

  if (semver && shortRev) {
    args[0].meta = {
      version: `${semver}-rev-${shortRev}`
    };
  }

  return args;
}
