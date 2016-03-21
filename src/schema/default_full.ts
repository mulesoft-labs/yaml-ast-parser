/// <reference path="../../typings/main.d.ts" />

// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.


'use strict';


import Schema = require('../schema');

var schema=new Schema({
  include: [
    require('./default_safe')
  ],
  explicit: [
    require('./js/undefined'),
    require('./js/regexp'),
    require('./js/function')
  ]
})
Schema.DEFAULT = schema;
export =schema;
