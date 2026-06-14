import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import { mdsvex } from 'mdsvex';
import alias from '@rollup/plugin-alias';
import path from 'path';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);
const dedupe = (importee) =>
  importee === 'svelte' || importee.startsWith('svelte/');

// Rehype plugin: wrap every U+02BB (ʻokina) in <span class="okina"> so that
// the CSS can give it the correct font and layout, avoiding the overlap caused
// by Gelasio's near-zero advance width for this character.
function wrapOkina() {
  const OKINA = 'ʻ'; // U+02BB modifier letter turned comma

  function processNode(node) {
    if (!node.children) return;
    const newChildren = [];
    for (const child of node.children) {
      if (child.type === 'text' && child.value.includes(OKINA)) {
        const parts = child.value.split(OKINA);
        parts.forEach((part, i) => {
          if (i > 0) {
            newChildren.push({
              type: 'element',
              tagName: 'span',
              properties: { className: ['okina'] },
              children: [{ type: 'text', value: OKINA }],
            });
          }
          if (part) newChildren.push({ type: 'text', value: part });
        });
      } else {
        processNode(child);
        newChildren.push(child);
      }
    }
    node.children = newChildren;
  }

  return (tree) => processNode(tree);
}

const mdsvexOptions = {
  extension: '.md',
  rehypePlugins: [wrapOkina],
};

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      alias({
        entries: [
          {
            find: 'LinksList.json',
            replacement: path.resolve(
              __dirname,
              'src/helpers/LinksList.json.js'
            ),
          },
          {
            find: 'LinksList.svelte',
            replacement: path.resolve(
              __dirname,
              'src/components/LinksList.svelte'
            ),
          },
          {
            find: 'helpers',
            replacement: path.resolve(__dirname, 'src/helpers'),
          },
        ],
      }),
      svelte({
        extensions: ['.svelte', '.md'],
        dev,
        hydratable: true,
        emitCss: true,
        preprocess: mdsvex(mdsvexOptions),
      }),
      resolve({
        browser: true,
        dedupe,
      }),
      commonjs(),

      legacy &&
      babel({
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        runtimeHelpers: true,
        exclude: ['node_modules/@babel/**', '*.json'],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: '> 0.25%, not dead',
            },
          ],
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          [
            '@babel/plugin-transform-runtime',
            {
              useESModules: true,
            },
          ],
        ],
      }),

      !dev &&
      terser({
        module: true,
      }),
    ],

    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      alias({
        entries: [
          {
            find: 'LinksList.json',
            replacement: path.resolve(
              __dirname,
              'src/helpers/LinksList.json.js'
            ),
          },
          {
            find: 'LinksList.svelte',
            replacement: path.resolve(
              __dirname,
              'src/components/LinksList.svelte'
            ),
          },
          {
            find: 'helpers',
            replacement: path.resolve(__dirname, 'src/helpers'),
          },
        ],
      }),
      svelte({
        extensions: ['.svelte', '.md'],
        preprocess: mdsvex(mdsvexOptions),
        generate: 'ssr',
        dev,
      }),
      resolve({
        dedupe,
      }),
      commonjs(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
      Object.keys(process.binding('natives'))
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    onwarn,
  },
};
