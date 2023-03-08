import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from "rollup-plugin-styles";
import ejs from 'rollup-plugin-ejs';
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: 'src/themes/pinkFlag/index.ts',
    output: [
      {
        file: 'lib/umd/YuanPlayerThemePinkFlag.js',
        format: 'umd',
        name: 'YuanPlayerThemePinkFlag'
      },
      {
        file: 'lib/mjs/YuanPlayerThemePinkFlag.js',
        format: 'es',
      },
      {
        file: 'lib/cjs/YuanPlayerThemePinkFlag.js',
        format: 'cjs',
      },
      {
        file: 'lib/umd/YuanPlayerThemePinkFlag.min.js',
        format: 'umd',
        name: 'YuanPlayerThemePinkFlag',
        plugins: [terser()]
      },
      {
        file: 'lib/mjs/YuanPlayerThemePinkFlag.min.js',
        format: 'es',
        plugins: [terser()]
      },
      {
        file: 'lib/cjs/YuanPlayerThemePinkFlag.min.js',
        format: 'cjs',
        plugins: [terser()]
      },
    ],
    plugins: [styles(),   nodeResolve({browser:true}), ejs({
      include: ['**/*.ejs', '**/*.html'],
      inlineStyles: false
    }), typescript()]
  },
];