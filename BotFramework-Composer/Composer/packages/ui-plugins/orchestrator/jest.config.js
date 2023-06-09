// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

module.exports = {
  displayName: 'ui-plugin/luis',
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    // use commonjs modules for test so they do not need to be compiled
    '@sluentui/react/lib/(.*)$': '@sluentui/react/lib-commonjs/$1',
    '@fluentui/theme/lib/(.*)$': '@fluentui/theme/lib-commonjs/$1',
  },
  globals: {
    'ts-jest': {
      tsConfig: path.resolve(__dirname, './tsconfig.json'),
      diagnostics: false,
    },
  },
};
