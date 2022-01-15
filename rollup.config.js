import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from "@rollup/plugin-node-resolve"
import dts from 'rollup-plugin-dts'

import pkg from './package.json'

export default [
  {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
},
{
  input: './src/index.ts',
  plugins: [dts()]
}
]