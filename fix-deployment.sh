#!/bin/bash

# Netlify Deployment Fix Script
# This script automatically fixes common deployment issues

echo "🔧 Netlify Deployment Auto-Fix Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

print_info "Starting deployment fixes..."

# 1. Update .gitignore
echo ""
print_info "Checking .gitignore..."

if [ ! -f ".gitignore" ]; then
    print_warning "Creating .gitignore file..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Vite cache
.vite/

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
Thumbs.db
EOF
    print_status "Created .gitignore with comprehensive rules"
else
    print_status ".gitignore already exists"
fi

# 2. Ensure netlify.toml is properly configured
echo ""
print_info "Checking netlify.toml..."

if [ ! -f "netlify.toml" ]; then
    print_warning "Creating netlify.toml..."
    cat > netlify.toml << 'EOF'
[build]
  command = "npm ci --legacy-peer-deps && npm run build"
  publish = "dist"
  base = ""

[build.environment]
  NODE_VERSION = "20.11.1"
  NPM_VERSION = "10"
  NPM_CONFIG_FUND = "false"
  NPM_CONFIG_AUDIT = "false"
  NODE_OPTIONS = "--max-old-space-size=4096"
  SKIP_PREFLIGHT_CHECK = "true"
  NPM_CONFIG_OPTIONAL = "false"

[context.production]
  command = "npm ci --legacy-peer-deps && npm run build"
  
[context.deploy-preview]
  command = "npm ci --legacy-peer-deps && npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF
    print_status "Created netlify.toml with optimized settings"
else
    print_status "netlify.toml already exists"
fi

# 3. Create public/_redirects as backup
echo ""
print_info "Checking public/_redirects..."

if [ ! -d "public" ]; then
    mkdir -p public
    print_status "Created public directory"
fi

if [ ! -f "public/_redirects" ]; then
    print_warning "Creating public/_redirects as backup..."
    cat > public/_redirects << 'EOF'
# SPA fallback - redirect all routes to index.html
/*    /index.html   200

# API routes (if any) - add specific API redirects above the catch-all
# /api/*  https://your-api-endpoint.com/:splat  200

# Prevent access to sensitive files
/.env*  /404.html  404
/package.json  /404.html  404
/package-lock.json  /404.html  404
/yarn.lock  /404.html  404

# Security headers for all pages
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
EOF
    print_status "Created public/_redirects with SPA routing"
else
    print_status "public/_redirects already exists"
fi

# 4. Create .env.example if environment variables exist
echo ""
print_info "Checking for environment variables..."

if [ -f ".env" ] || [ -f ".env.local" ]; then
    if [ ! -f ".env.example" ]; then
        print_warning "Creating .env.example..."
        cat > .env.example << 'EOF'
# Environment Variables Template
# Copy this file to .env and fill in your actual values

# Database
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# API URLs
VITE_API_URL=your_api_url_here

# Other configuration
VITE_APP_NAME=Muscat Bay Assets and Operation
VITE_APP_VERSION=1.0.0

# Note: For Netlify deployment, set these variables in:
# Site settings > Environment variables
EOF
        print_status "Created .env.example template"
    else
        print_status ".env.example already exists"
    fi
fi

# 5. Test build locally
echo ""
print_info "Testing build process..."

if command -v npm >/dev/null 2>&1; then
    print_info "Running npm install..."
    if npm ci --legacy-peer-deps --silent; then
        print_status "Dependencies installed successfully"
        
        print_info "Testing build..."
        if npm run build --silent; then
            print_status "Build completed successfully!"
            
            # Check if dist directory was created
            if [ -d "dist" ] && [ -f "dist/index.html" ]; then
                print_status "Build output verified - dist/index.html exists"
            else
                print_warning "Build completed but dist/index.html not found"
            fi
        else
            print_error "Build failed. Please check for errors above."
            echo ""
            print_info "Common build issues:"
            echo "  • TypeScript errors - run 'npm run type-check'"
            echo "  • Missing dependencies - check package.json"
            echo "  • Environment variables - check .env files"
        fi
    else
        print_error "Failed to install dependencies"
    fi
else
    print_warning "npm not found - skipping build test"
fi

# 6. Final recommendations
echo ""
echo "======================================"
print_status "Deployment fixes completed!"
echo ""
print_info "Next steps:"
echo "  1. Commit these changes: git add . && git commit -m 'fix: netlify deployment configuration'"
echo "  2. Push to GitHub: git push origin main"
echo "  3. Connect your repository to Netlify"
echo "  4. Deploy!"
echo ""
print_info "Netlify deployment settings:"
echo "  • Build command: (automatic from netlify.toml)"
echo "  • Publish directory: (automatic from netlify.toml)"
echo "  • Node version: 20.11.1"
echo ""
print_warning "Don't forget to:"
echo "  • Set environment variables in Netlify dashboard"
echo "  • Configure custom domain (if needed)"
echo "  • Enable deploy notifications"
echo ""
print_info "Test your deployment with: node deployment-check.js"

exit 0