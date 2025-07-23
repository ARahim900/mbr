#!/bin/bash

echo "===================================="
echo "   MBR Deployment Fix Script"
echo "===================================="
echo

echo "[1/5] Cleaning up old files..."
rm -rf node_modules dist package-lock.json

echo "[2/5] Clearing npm cache..."
npm cache clean --force

echo "[3/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    echo "Trying with --legacy-peer-deps..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "ERROR: Still failed. Check your package.json"
        exit 1
    fi
fi

echo "[4/5] Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed. Check the error messages above."
    exit 1
fi

echo "[5/5] Testing build locally..."
if [ -f "dist/index.html" ]; then
    echo "SUCCESS: Build completed successfully!"
    echo "You can now deploy to Netlify manually or trigger a new deploy."
else
    echo "ERROR: Build output missing. Something went wrong."
    exit 1
fi

echo
echo "===================================="
echo "   Fix Complete!"
echo "===================================="
echo
echo "Next steps:"
echo "1. Go to your Netlify dashboard"
echo "2. Click 'Trigger deploy' > 'Clear cache and deploy site'"
echo "3. Or push these changes to trigger auto-deploy"
echo