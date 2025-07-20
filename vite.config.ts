import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        host: '0.0.0.0',
        port: 5173
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
        'process.env.CLERK_SECRET_KEY': JSON.stringify(env.CLERK_SECRET_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Ensure proper handling of static assets
      publicDir: 'public',
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Copy static files to dist
        copyPublicDir: true,
        // Rollup options for better Netlify compatibility
        rollupOptions: {
          output: {
            manualChunks: undefined,
          }
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1600,
        // Enable source maps for debugging
        sourcemap: false
      }
    };
});