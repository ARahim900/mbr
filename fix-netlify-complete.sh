#!/bin/bash

# Comprehensive fix for Husky and deployment issues

echo "🔧 Applying comprehensive Netlify deployment fixes..."

# Create a Node.js script to update package.json
cat > update-package.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Update scripts to handle husky properly
pkg.scripts = {
  ...pkg.scripts,
  // Make prepare script conditional
  "prepare": "node -e \"if(process.env.NETLIFY || process.env.CI || process.env.SKIP_HUSKY) process.exit(0)\" || husky 2>/dev/null || true",
  "postinstall": "echo 'Post-install complete'",
  // Build scripts
  "build": "vite build",
  "build:netlify": "vite build",
  "build:strict": "npm run type-check && npm run lint && vite build",
  "build:local": "npm run type-check && npm run lint && vite build",
  // Other scripts
  "type-check": "tsc --noEmit --skipLibCheck",
  "lint": "eslint . --ext ts,tsx --max-warnings 200",
  "lint:fix": "eslint . --ext ts,tsx --fix"
};

// Remove husky from dependencies if it exists in wrong place
if (pkg.dependencies && pkg.dependencies.husky) {
  delete pkg.dependencies.husky;
}

// Add husky to devDependencies if not present
if (!pkg.devDependencies) {
  pkg.devDependencies = {};
}

// Add husky as optional dependency
if (!pkg.devDependencies.husky) {
  pkg.devDependencies.husky = "^9.0.11";
}

// Add optionalDependencies section
pkg.optionalDependencies = {
  ...pkg.optionalDependencies,
  "husky": "^9.0.11"
};

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log('✅ package.json updated successfully!');
console.log('📦 Husky is now optional and won\'t break production builds');
EOF

# Run the update script
node update-package.js

# Clean up
rm update-package.js

# Create .npmrc to help with installation
cat > .npmrc << 'EOF'
legacy-peer-deps=true
engine-strict=false
EOF

echo "✅ All fixes applied!"
echo ""
echo "📌 Changes made:"
echo "  1. Updated package.json scripts to make husky optional"
echo "  2. Added husky as optionalDependency"
echo "  3. Created .npmrc for better compatibility"
echo "  4. prepare script now checks for CI/Netlify environment"
echo ""
echo "🚀 Ready for deployment!"
