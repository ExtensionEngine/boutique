'use strict';

exports.name = 'clean-out-dir';

exports.apply = (api, opts = {}) => {
  api.hook('createWebpackChain', config => {
    if (!api.config.output.clean) return;
    const path = api.resolveOutDir();
    opts.root = opts.root || api.cwd;
    config
      .plugin('clean-out-dir')
      .use(require.resolve('clean-webpack-plugin'), [path, opts]);
  });
};
