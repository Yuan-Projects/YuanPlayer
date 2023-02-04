import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.ts',
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
  {
    input: 'src/lyric.ts',
    output: [
      {
        file: 'lib/umd/YuanPlayerLyric.js',
        format: 'umd',
        name: 'YuanPlayerLyric'
      },
      {
        file: 'lib/mjs/YuanPlayerLyric.js',
        format: 'es',
      },
      {
        file: 'lib/cjs/YuanPlayerLyric.js',
        format: 'cjs',
      },
    ],
    plugins: [nodeResolve({browser:true}), typescript()]
  },
];