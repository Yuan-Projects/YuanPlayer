import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from "rollup-plugin-styles";
import ejs from 'rollup-plugin-ejs';
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: 'src/core/index.ts',
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
      {
        file: 'lib/umd/YuanPlayer.min.js',
        format: 'umd',
        name: 'YuanPlayer',
        plugins: [terser()]
      },
      {
        file: 'lib/mjs/YuanPlayer.min.js',
        format: 'es',
        plugins: [terser()]
      },
      {
        file: 'lib/cjs/YuanPlayer.min.js',
        format: 'cjs',
        plugins: [terser()]
      },
    ],
    plugins: [styles(), nodeResolve({browser:true}), typescript()]
  }
];