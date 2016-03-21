/// <reference path="../../typings/main.d.ts" />

'use strict';

import Type = require('../type');

function resolveYamlMerge(data) {
  return '<<' === data || null === data;
}

export = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});
