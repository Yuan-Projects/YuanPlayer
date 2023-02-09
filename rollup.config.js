import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import styles from "rollup-plugin-styles";
import ejs from 'rollup-plugin-ejs';

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
    ],
    plugins: [styles(), nodeResolve({browser:true}), typescript()]
  },
  {
    input: 'src/themes/yuan/index.ts',
    output: [
      {
        file: 'lib/umd/YuanPlayerThemeYuan.js',
        format: 'umd',
        name: 'YuanPlayerThemeYuan'
      },
      {
        file: 'lib/mjs/YuanPlayerThemeYuan.js',
        format: 'es',
      },
      {
        file: 'lib/cjs/YuanPlayerThemeYuan.js',
        format: 'cjs',
      },
    ],
    plugins: [styles(), nodeResolve({browser:true}), ejs({
      include: ['**/*.ejs', '**/*.html'],
      inlineStyles: false
    }), typescript()]
  },
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
    ],
    plugins: [styles(),   nodeResolve({browser:true}), ejs({
      include: ['**/*.ejs', '**/*.html'],
      inlineStyles: false
    }), typescript()]
  },
];