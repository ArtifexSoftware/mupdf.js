import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function copyMupdfFiles() {
  return {
    name: 'copy-mupdf-files',
    writeBundle() {
      const srcDir = resolve(__dirname, 'node_modules/mupdf/dist')
      const destDir = resolve(__dirname, 'dist/assets')
      const filesToCopy = [
        'mupdf-wasm.js',
        'mupdf-wasm.wasm',
        'mupdf.js',
        'tasks.js'
      ]

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }

      filesToCopy.forEach(file => {
        const src = path.join(srcDir, file)
        const dest = path.join(destDir, file)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
          console.log(`Copied ${file} to ${destDir}`)
        } else {
          console.warn(`Warning: ${file} not found in ${srcDir}`)
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyMupdfFiles()],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        worker: resolve(__dirname, 'src/workers/mupdf.worker.ts')
      }
    }
  },
  worker: {
    format: 'es'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})