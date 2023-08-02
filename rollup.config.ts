import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'index.ts',
  output: {
    file: 'index.cjs',
    format: 'cjs',
    exports: 'default',
    preferConst: true,
    interop: 'default',
  },
})
