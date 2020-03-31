// rollup.config.js
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/tosource.ts',
  plugins: [typescript({ exclude: '**/*.test.ts' })],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
};
