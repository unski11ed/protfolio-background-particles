import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/lib/index.ts', // our source file
    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'es' // the preferred format
        },
        /*
        {
            file: pkg.browser,
            format: 'iife',
            name: 'rippledParticles' // the global which can be used in a browser
        }
        */
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            tsconfig: './tsconfig.json',
        }),
        terser() // minifies generated bundles
    ]
};