/// <reference path="../../typings/main.d.ts" />

// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


import Schema = require('../schema');
var schema=new Schema({
  include: [
    require('./core')
  ],
  implicit: [
    require('./timestamp'),
    require('./merge')
  ],
  explicit: [
    require('./binary'),
    require('./omap'),
    require('./pairs'),
    require('./set')
  ]
})
export = schema;
