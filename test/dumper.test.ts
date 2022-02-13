import * as chai from 'chai';
import { safeDump } from '../src';
const expect = chai.expect;

suite('Dumper', () => {
  suite('lineWidth dump option', () => {
    test('should respect lineWidth for multi-line strings', () => {
      const description = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et.`;

      expect(safeDump({ description }, { lineWidth: 100 })).to.equal(`description: >-
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
  totam rem aperiam, eaque ipsa quae

  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
  quia non numquam eius modi tempora incidunt ut labore et.
`);
    });

    test('should use literal block-scalar style if lineWidth is Infinity (or very lengthy)', () => {
      const description = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et.`;

      expect(safeDump({ description }, { lineWidth: Infinity })).to.equal(`description: |-
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et.
`);
    });
  });

  suite('noRefs dump option', () => {
    test('should use anchors for same objects by default', () => {
      const obj = { foo: 'bar' };

      expect(safeDump({ a: obj, b: obj })).to.equal(`a: &ref_0
  foo: bar
b: *ref_0
`);
    });

    test('should not use anchors for same objects if truthy', () => {
      const obj = { foo: 'bar' };

      expect(safeDump({ a: obj, b: obj }, { noRefs: true })).to.equal(`a:
  foo: bar
b:
  foo: bar
`)
    });
  });
});
