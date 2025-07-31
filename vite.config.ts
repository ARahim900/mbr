import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // Allow external connections for mobile testing
    https: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@components': resolve(__dirname, './components'),
      '@hooks': resolve(__dirname, './hooks'),
      '@services': resolve(__dirname, './services'),
      '@utils': resolve(__dirname, './utils'),
      '@store': resolve(__dirname, './store'),
      '@types': resolve(__dirname, './types.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
          data: ['@supabase/supabase-js', '@tanstack/react-query', 'zustand'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['date-fns', 'clsx', 'papaparse']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts']
  }
})