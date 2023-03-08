import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from "rollup-plugin-styles";
import ejs from 'rollup-plugin-ejs';
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: 'src/themes/blueMonday/index.ts',
    output: [
      {
        file: 'lib/umd/YuanPlayerThemeBlueMonday.js',
        format: 'umd',
        name: 'YuanPlayerThemeBlueMonday'
      },
      {
        file: 'lib/mjs/YuanPlayerThemeBlueMonday.js',
        format: 'es',
      },
      {
        file: 'lib/cjs/YuanPlayerThemeBlueMonday.js',
        format: 'cjs',
      },
      {
        file: 'lib/umd/YuanPlayerThemeBlueMonday.min.js',
        format: 'umd',
        name: 'YuanPlayerThemeBlueMonday',
        plugins: [terser()]
      },
      {
        file: 'lib/mjs/YuanPlayerThemeBlueMonday.min.js',
        format: 'es',
        plugins: [terser()]
      },
      {
        file: 'lib/cjs/YuanPlayerThemeBlueMonday.min.js',
        format: 'cjs',
        plugins: [terser()]
      },
    ],
    plugins: [styles(),   nodeResolve({browser:true}), ejs({
      include: ['**/*.ejs', '**/*.html'],
      inlineStyles: false
    }), typescript()]
  }
];