import * as YAML from '../src';
import * as chai from 'chai';

const assert = chai.assert;
const path = require('path');
const oldAST = require(path.join(__dirname, '..', '..', 'ast.json'));

const payload = {
  schemaBody:
    "openapi: 3.0.0\ninfo:\n  version: 1.0.0\n  title: yaml schema\nservers:\n  - url: 'http://petstore.swagger.io/v1'\npaths:\n  /user:\n    get:\n      summary: 'Sample endpoint: Returns details about a particular user'\n      operationId: listUser\n      tags:\n        - user\n      servers:\n        - url: 'http://petstore.swagger.io/v1'\n      parameters:\n        - name: id\n          in: query\n          description: ID of the user\n          required: true\n          schema:\n            type: integer\n            format: int32\n      responses:\n        '200':\n          description: 'Sample response: Details about a user by ID'\n          headers:\n            x-next:\n              description: A link to the next page of responses\n              schema:\n                type: string\n          content:\n            application/json:\n              schema:\n                $ref: '#/components/schemas/User'\n        default:\n          description: Unexpected error\n          content:\n            application/json:\n              schema:\n                $ref: '#/components/schemas/Error'\ncomponents:\n  schemas:\n    User:\n      type: object\n      required:\n        - id\n        - name\n      properties:\n        id:\n          type: integer\n          format: int64\n        name:\n          type: string\n        tag:\n          type: string\n    Error:\n      type: object\n      required:\n        - code\n        - message\n      properties:\n        code:\n          type: integer\n          format: int32\n        message:\n          type: string\n  securitySchemes:\n    BasicAuth:\n      type: http\n      scheme: basic\n",
  schemaFormat: 'yaml',
  schemaType: 'openapi3',
};

suite('Line and Column', () => {
  test('should return same locations', function () {
    const ast = YAML.load(payload.schemaBody);
    const newMapping = traverseNewAST(ast, {});
    const oldMapping = traverseOldAST(oldAST, {});
    assert.strictEqual(
      Object.keys(newMapping).length,
      Object.keys(oldMapping).length
    );
    assert.isTrue(compareLocations(oldMapping, newMapping));
  });
});

function traverseOldAST(node, mapping) {
  if (!node) {
    return mapping;
  }
  if (Array.isArray(node.value) && node.value.length > 0) {
    for (var i = 0; i < node.value.length; i++) {
      traverseOldAST(node.value[i], mapping);
    }
  } else if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      traverseOldAST(node[i], mapping);
    }
  } else {
    mapping[
      `${node.value}:${node.start_mark.pointer}:${node.end_mark.pointer}`
    ] = {
      startLineNumber: node.start_mark.line,
      endLineNumber: node.end_mark.line,
      startColumnNumber: node.start_mark.column,
      endColumnNumber: node.end_mark.column,
    };
  }
  return mapping;
}

function traverseNewAST(node, mapping) {
  if (!node) {
    return mapping;
  }

  if (Array.isArray(node.mappings) && node.mappings.length > 0) {
    for (var i = 0; i < node.mappings.length; i++) {
      traverseNewAST(node.mappings[i], mapping);
    }
  } else if (Array.isArray(node.items) && node.items.length > 0) {
    for (var i = 0; i < node.items.length; i++) {
      traverseNewAST(node.items[i], mapping);
    }
  } else {
    if (node.key && (node.key.plainScalar || node.key.singleQuoted)) {
      mapping[
        `${node.key.value}:${node.key.startPosition}:${node.key.endPosition}`
      ] = node.key.location;
      if (node.value.value) {
        mapping[
          `${node.value.value}:${node.value.startPosition}:${node.value.endPosition}`
        ] = node.value.location;
      }
    }
    if (typeof node.value === 'string' && node.plainScalar) {
      mapping[`${node.value}:${node.startPosition}:${node.endPosition}`] =
        node.location;
    } else if (Array.isArray(node.items) && node.items.length === 0) {
      mapping[`${node.items}:${node.startPosition}:${node.endPosition}`] =
        node.location;
    } else if (Array.isArray(node.mappings) && node.mappings.length === 0) {
      mapping[`${node.mappings}:${node.startPosition}:${node.endPosition}`] =
        node.location;
    } else if (node.value) {
      traverseNewAST(node.value, mapping);
    }
  }
  return mapping;
}

function compareLocations(oldMapping, newMapping) {
  let isMatching = true;
  Object.keys(oldMapping).forEach((key) => {
    const oldLocation = oldMapping[key];
    const newLocation = newMapping[key];

    if (
      newLocation.line.start === oldLocation.startLineNumber &&
      newLocation.line.end === oldLocation.endLineNumber &&
      newLocation.column.start === oldLocation.startColumnNumber &&
      newLocation.column.end === oldLocation.endColumnNumber
    ) {
    } else {
      isMatching = false;
    }
  });

  return isMatching;
}
