/**
 * @fileoverview Guards the published package contract: the package root is the
 * library, and importing it must never start the CLI.
 */

import { execFileSync } from 'child_process';
import { join } from 'path';
import pkg from '../package.json';

describe('package entry', () => {
  it('points main and exports at the library barrel, not the CLI', () => {
    expect(pkg.main).toBe('dist/lib/index.js');
    expect(pkg.exports['.'].default).toBe('./dist/lib/index.js');
    expect(pkg.bin['solana-vanity-ts']).toBe('./dist/index.js');
  });

  it('exposes the documented programmatic API from the library barrel', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lib = require('../src/lib');
    expect(typeof lib.VanityGenerator).toBe('function');
    expect(typeof lib.saveKeypair).toBe('function');
  });

  it('requires the built root without running the CLI', () => {
    const root = join(__dirname, '..');
    const out = execFileSync(
      process.execPath,
      ['-e', "const m=require('./');process.stdout.write(typeof m.VanityGenerator)"],
      { cwd: root, encoding: 'utf8' }
    );
    expect(out).toBe('function');
  });
});
