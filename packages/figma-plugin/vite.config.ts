import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Figma plugin UI iframes do not support ES modules (<script type="module">).
// This plugin inlines all external scripts and stylesheets into index.html as
// plain <script>/<style> tags so the output is a single self-contained file.
function figmaInlinePlugin(): Plugin {
  let resolvedOutDir: string
  return {
    name: 'figma-inline',
    apply: 'build',
    configResolved(config) {
      resolvedOutDir = config.build.outDir
    },
    closeBundle() {
      const htmlPath = path.join(resolvedOutDir, 'index.html')
      if (!fs.existsSync(htmlPath)) return

      let html = fs.readFileSync(htmlPath, 'utf-8')

      // Inline <script ... src="..."> → <script>CODE</script> (drops type="module")
      html = html.replace(
        /<script\b[^>]*\s+src="([^"]+)"[^>]*><\/script>/g,
        (_match, src: string) => {
          const filePath = path.join(resolvedOutDir, src.replace(/^\.\//, ''))
          if (!fs.existsSync(filePath)) return _match
          const code = fs.readFileSync(filePath, 'utf-8')
          fs.unlinkSync(filePath)
          return `<script>${code}</script>`
        },
      )

      // Inline <link rel="stylesheet" href="..."> → <style>CSS</style>
      html = html.replace(
        /<link\b[^>]*\s+rel="stylesheet"[^>]*\s+href="([^"]+)"[^>]*\/?>/g,
        (_match, href: string) => {
          const filePath = path.join(resolvedOutDir, href.replace(/^\.\//, ''))
          if (!fs.existsSync(filePath)) return _match
          const css = fs.readFileSync(filePath, 'utf-8')
          fs.unlinkSync(filePath)
          return `<style>${css}</style>`
        },
      )

      fs.writeFileSync(htmlPath, html)

      // Remove empty assets dir
      const assetsDir = path.join(resolvedOutDir, 'assets')
      if (fs.existsSync(assetsDir) && fs.readdirSync(assetsDir).length === 0) {
        fs.rmdirSync(assetsDir)
      }
    },
  }
}

// Builds the Plugin UI iframe (React app) → dist/index.html (fully inlined, no modules)
export default defineConfig({
  root: path.resolve(__dirname, 'src/ui'),
  base: './',
  plugins: [react(), figmaInlinePlugin()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: 'es2018',
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
})
