import { defineConfig } from 'vite'
import path from 'path'

const nodeBuiltins = [
  'http', 'https', 'fs', 'path', 'child_process', 'url', 'os', 'crypto', 'stream',
  'events', 'util', 'buffer', 'assert', 'net', 'tls', 'dns', 'readline', 'zlib',
  'node:http', 'node:https', 'node:fs', 'node:path', 'node:child_process', 'node:url',
  'node:os', 'node:crypto', 'node:stream', 'node:events', 'node:util', 'node:buffer',
  'node:assert', 'node:net', 'node:tls', 'node:dns', 'node:readline', 'node:zlib',
  'node:process', 'node:tty', 'node:perf_hooks', 'node:vm', 'node:module',
]

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'cli',
      formats: ['cjs'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [...nodeBuiltins, '@a2ui/sdk', 'jiti'],
      output: {
        entryFileNames: 'cli.cjs',
        chunkFileNames: 'chunks/[name]-[hash].cjs',
      },
    },
    target: 'node18',
    minify: false,
  },
})
