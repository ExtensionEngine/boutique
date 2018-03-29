module.exports = {
  processors: [['@mapbox/stylelint-processor-arbitrary-tags', {
    fileFilterRegex: [/\.vue$/]
  }]],
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order'],
  rules: {
    // NOTE: Required due to:
    // https://github.com/mapbox/stylelint-processor-arbitrary-tags/tree/5e302529f447f4d18dc16d2a9e5a16ca98d3b378#caveats
    'no-empty-source': null,
    'selector-list-comma-newline-after': 'never-multi-line',
    'function-comma-space-after': null,
    'order/properties-order': [
      'content',
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'transform',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'color',
      'font-size',
      'font-weight',
      'line-height',
      'background',
      'background-color',
      'border',
      'cursor'
    ]
  }
};
