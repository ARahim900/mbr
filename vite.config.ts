import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Include .tsx files
        include: '**/*.{jsx,tsx}',
      }),
    ],
    
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      cors: true,
      hmr: {
        overlay: true,
      },
    },
    
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
    
    define: {
      // Properly define environment variables for Vite
      __DEV__: mode === 'development',
    },
    
    build: {
      target: 'es2015',
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: 'terser',
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress warnings about missing optional dependencies
          if (warning.code === 'MODULE_NOT_FOUND' && 
              (warning.message.includes('@rollup/rollup-') || 
               warning.message.includes('@esbuild/'))) {
            return;
          }
          warn(warning);
        },
        output: {
          manualChunks: (id) => {
            // Only create chunks for large dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@tanstack/react-query')) {
                return 'query-vendor';
              }
              if (id.includes('recharts')) {
                return 'chart-vendor';
              }
              if (id.includes('@supabase/supabase-js')) {
                return 'supabase-vendor';
              }
              // Group smaller dependencies together
              if (id.includes('lucide-react') || id.includes('react-hot-toast') || 
                  id.includes('clsx') || id.includes('date-fns')) {
                return 'utils-vendor';
              }
              return 'vendor';
            }
          },
          // Optimize chunk names
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext || '')) {
              return `css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@components': path.resolve(__dirname, './components'),
        '@hooks': path.resolve(__dirname, './hooks'),
        '@services': path.resolve(__dirname, './services'),
        '@utils': path.resolve(__dirname, './utils'),
        '@store': path.resolve(__dirname, './store'),
        '@types': path.resolve(__dirname, './types.ts'),
      },
    },
    
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'recharts',
        'lucide-react',
        'aos',
        'framer-motion',
        'react-intersection-observer',
        'react-hot-toast',
        'clsx',
        'date-fns',
        'react-hook-form',
        '@hookform/resolvers',
        'zod',
        'zustand',
        '@supabase/supabase-js',
        'papaparse',
      ],
      exclude: ['@vitejs/plugin-react'],
    },
    
    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
    
    // Environment variables
    envPrefix: 'VITE_',
    envDir: '.',
  };
});