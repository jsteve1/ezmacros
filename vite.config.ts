import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: '/ezmacrosbruh/', // Replace with your repository name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
