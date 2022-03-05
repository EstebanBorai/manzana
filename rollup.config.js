import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.module, format: 'es' },
    { file: pkg.main, format: 'umd', name: 'manzana' },
  ],
  plugins: [typescript(), svelte(), resolve()],
};
