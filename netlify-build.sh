#!/bin/bash

# Netlify Build Script - Robust build with fallbacks
echo "🚀 Starting Netlify build with enhanced error handling..."

# Clean environment
echo "🧹 Cleaning environment..."
rm -rf node_modules .vite dist
npm cache clean --force

# Install dependencies with retries
echo "📦 Installing dependencies..."
for i in {1..3}; do
    if npm install --legacy-peer-deps; then
        echo "✅ Dependencies installed successfully"
        break
    else
        echo "⚠️  Install attempt $i failed, retrying..."
        rm -rf node_modules
        sleep 5
    fi
done

# Verify critical dependencies
echo "🔍 Verifying critical dependencies..."
if ! npm list vite >/dev/null 2>&1; then
    echo "❌ Vite not found, installing explicitly..."
    npm install vite@latest --legacy-peer-deps
fi

if ! npm list typescript >/dev/null 2>&1; then
    echo "❌ TypeScript not found, installing explicitly..."  
    npm install typescript@latest --legacy-peer-deps
fi

# Build with error handling
echo "🏗️  Building application..."
if npm run build; then
    echo "✅ Build successful!"
    
    # Verify build output
    if [ -f "dist/index.html" ]; then
        echo "✅ Build output verified"
        echo "📊 Build size: $(du -sh dist | cut -f1)"
        ls -la dist/
    else
        echo "❌ Build output missing"
        exit 1
    fi
else
    echo "❌ Build failed, attempting fallback..."
    
    # Fallback: try with different Node options
    NODE_OPTIONS="--max-old-space-size=4096" npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Fallback build successful"
    else
        echo "❌ All build attempts failed"
        exit 1
    fi
fi

echo "🎉 Netlify build completed successfully!"