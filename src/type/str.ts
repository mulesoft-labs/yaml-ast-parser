/// <reference path="../../typings/main.d.ts" />

'use strict';

import Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return null !== data ? data : ''; }
});
