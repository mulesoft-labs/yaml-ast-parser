/// <reference path="../../typings/main.d.ts" />

'use strict';

import Type = require('../type');

export = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return null !== data ? data : ''; }
});
