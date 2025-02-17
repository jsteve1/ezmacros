import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    mkcert()
  ],
  base: process.env.DEPLOY === 'gh-pages' ? '/ezmacros/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    host: '0.0.0.0',  // Listen on all addresses
    port: 5173
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
});
