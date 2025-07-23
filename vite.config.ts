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
        // Explicitly exclude platform-specific packages
        external: [
          /^@rollup\/rollup-darwin-/,
          /^@rollup\/rollup-win32-/,
          /^@esbuild\/darwin-/,
          /^@esbuild\/win32-/,
        ],
        onwarn(warning, warn) {
          // Suppress warnings about missing optional dependencies
          if (warning.code === 'MODULE_NOT_FOUND' && 
              warning.message.includes('@rollup/rollup-linux-x64-gnu')) {
            return;
          }
          warn(warning);
        },
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'chart-vendor': ['recharts'],
            'animation-vendor': ['aos', 'framer-motion', 'react-intersection-observer'],
            'ui-vendor': ['lucide-react', 'react-hot-toast', 'clsx'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'date-vendor': ['date-fns'],
            'supabase-vendor': ['@supabase/supabase-js'],
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