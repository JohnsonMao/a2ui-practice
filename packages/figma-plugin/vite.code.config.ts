import { defineConfig } from 'vite'
import path from 'path'

// Builds the Figma plugin sandbox → dist/code.js (IIFE, no external deps)
// target es2018: Figma's QuickJS sandbox does not support ES2019+ syntax:
// optional chaining (?.), nullish coalescing (??), or optional catch binding (catch {}).
export default defineConfig({
  build: {
    target: 'es2018',
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/code.ts'),
      formats: ['iife'],
      name: 'PluginCode',
      fileName: () => 'code.js',
    },
    rollupOptions: {
      external: [],
    },
  },
})
