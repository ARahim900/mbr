#!/bin/bash
echo "🔧 Implementing complete Netlify deployment fix..."

# Create .nvmrc
echo "20.0.0" > .nvmrc

# Create .npmrc  
cat > .npmrc << 'EOF'
fund=false
audit=false
optional=true
legacy-peer-deps=true
EOF

# Install rollup dependencies
npm install --save-dev @rollup/rollup-linux-x64-gnu@^4.21.0 @rollup/rollup-darwin-x64@^4.21.0 @rollup/rollup-win32-x64-msvc@^4.21.0 @rollup/rollup-linux-arm64-gnu@^4.21.0 @rollup/rollup-darwin-arm64@^4.21.0

# Create vite.config.js
cat > vite.config.js << 'EOF'
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
EOF

# Update netlify.toml
cat > netlify.toml << 'EOF'
[build]
  command = "rm -rf node_modules package-lock.json && npm install --include=optional --legacy-peer-deps && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.0.0"
  NPM_VERSION = "9.0.0"
  NPM_CONFIG_FUND = "false"
  NPM_CONFIG_AUDIT = "false"
  NPM_CONFIG_OPTIONAL = "true"
  SKIP_PREFLIGHT_CHECK = "true"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# Update engines in package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.engines = { node: '>=20.0.0', npm: '>=9.0.0' };
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo "✅ All fixes implemented!"
echo "🧪 Testing build..."

# Clean and test
rm -rf node_modules package-lock.json dist
npm install --include=optional --legacy-peer-deps
npm run build

echo "🚀 Ready to commit and deploy!"
