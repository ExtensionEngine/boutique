'use strict';

exports.name = 'bundle-report';

exports.cli = api => {
  if (!api.isProd) return;
  api.command.option('--bundle-report', 'View bundle report');
};

exports.apply = (api, options = {}) => {
  api.hook('createWebpackChain', config => {
    if (!api.cli.options.bundleReport) return;
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    config
      .plugin('bundle-report')
      .use(BundleAnalyzerPlugin, [options]);
  });
};
