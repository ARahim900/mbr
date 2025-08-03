import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false
  },
  optimizeDeps: {
    include: [
      '@rollup/rollup-linux-x64-gnu',
      '@rollup/rollup-darwin-x64',
      '@rollup/rollup-win32-x64-msvc'
    ]
  },
  server: {
    host: true,
    port: 3000
  }
})
