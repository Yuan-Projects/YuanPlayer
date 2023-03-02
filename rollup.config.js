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
      {
        file: 'lib/umd/YuanPlayerThemeYuan.min.js',
        format: 'umd',
        name: 'YuanPlayerThemeYuan',
        plugins: [terser()]
      },
      {
        file: 'lib/mjs/YuanPlayerThemeYuan.min.js',
        format: 'es',
        plugins: [terser()]
      },
      {
        file: 'lib/cjs/YuanPlayerThemeYuan.min.js',
        format: 'cjs',
        plugins: [terser()]
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
  },
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