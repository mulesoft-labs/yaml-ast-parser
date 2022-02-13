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
});
