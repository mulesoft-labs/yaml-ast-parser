# yaml-ast-parser

[![Build Status](https://travis-ci.org/mulesoft-labs/yaml-ast-parser.svg?branch=master)](https://travis-ci.org/mulesoft-labs/yaml-ast-parser)

This is a fork of JS-YAML which supports parsing of YAML into AST.

In additional to parsing YAML to AST, it has following features:

* restoration after the errors and reporting errors as a part of AST nodes.
* built-in support for `!include` tag used in RAML
