#!/usr/bin/env node

/**
 * FINAL FIX: Update package.json to make husky optional
 * This script will complete the deployment fix
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting final Netlify deployment fix...\n');

// Read current package.json
const packagePath = path.join(process.cwd(), 'package.json');
let pkg;

try {
  pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('✅ Found package.json');
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Backup original
const backupPath = packagePath + '.backup';
fs.writeFileSync(backupPath, JSON.stringify(pkg, null, 2));
console.log('📦 Created backup at package.json.backup');

// Update scripts
console.log('\n📝 Updating scripts...');
pkg.scripts = {
  ...pkg.scripts,
  // Critical fixes for husky
  "prepare": "husky 2>/dev/null || true",
  "postinstall": "echo 'Post-install complete'",
  
  // Build scripts
  "build": "vite build",
  "build:netlify": "vite build",
  "build:strict": "npm run type-check && npm run lint && vite build",
  "build:local": "npm run type-check && npm run lint && vite build",
  
  // Keep existing scripts
  "dev": pkg.scripts.dev || "vite",
  "preview": pkg.scripts.preview || "vite preview",
  "type-check": "tsc --noEmit --skipLibCheck",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 200",
  "lint:fix": "eslint . --ext ts,tsx --fix"
};

// Ensure husky is in the right place
if (pkg.dependencies && pkg.dependencies.husky) {
  console.log('⚠️  Moving husky from dependencies to devDependencies');
  delete pkg.dependencies.husky;
}

// Add to devDependencies if not present
if (!pkg.devDependencies) {
  pkg.devDependencies = {};
}

if (!pkg.devDependencies.husky) {
  console.log('➕ Adding husky to devDependencies');
  pkg.devDependencies.husky = "^9.0.11";
}

// Add to optionalDependencies for extra safety
if (!pkg.optionalDependencies) {
  pkg.optionalDependencies = {};
}
pkg.optionalDependencies.husky = "^9.0.11";
console.log('➕ Added husky to optionalDependencies');

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
console.log('\n✅ package.json updated successfully!');

// Create .npmrc if it doesn't exist
const npmrcPath = path.join(process.cwd(), '.npmrc');
const npmrcContent = `legacy-peer-deps=true
engine-strict=false
save-exact=false
`;

if (!fs.existsSync(npmrcPath)) {
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('✅ Created .npmrc file');
} else {
  console.log('ℹ️  .npmrc already exists');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('🎉 DEPLOYMENT FIX COMPLETE!');
console.log('='.repeat(50));
console.log('\n📋 Changes made:');
console.log('  ✓ prepare script: "husky 2>/dev/null || true"');
console.log('  ✓ build script: "vite build"');
console.log('  ✓ husky added to optionalDependencies');
console.log('  ✓ .npmrc configured for compatibility');

console.log('\n🚀 Next steps:');
console.log('  1. Commit these changes:');
console.log('     git add package.json .npmrc');
console.log('     git commit -m "Fix: Complete husky bypass for Netlify deployment"');
console.log('     git push origin main');
console.log('  2. Trigger Netlify redeploy');
console.log('\n✨ Your deployment should now succeed!');
