import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'cli/index.ts'),
      name: 'cli',
      fileName: () => 'cli.cjs',
      formats: ['cjs'],
    },
    outDir: 'skills/generate-ui/scripts',
    emptyOutDir: false,
    rollupOptions: {
      external: ['http', 'fs', 'path', 'child_process'],
    },
    target: 'node18',
    minify: false,
  },
})
