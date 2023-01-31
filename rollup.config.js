import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/YuanPlayer.ts',
    output: [
      {
        file: 'lib/umd/YuanPlayer.js',
        format: 'umd',
        name: 'YuanPlayer'
      },
      {
        file: 'lib/mjs/YuanPlayer.js',
        format: 'es',
      },
      {
        file: 'lib/cjs/YuanPlayer.js',
        format: 'cjs',
      },
    ],
    plugins: [nodeResolve({browser:true}), typescript()]
  },
];