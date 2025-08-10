#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Auto-fixing package.json for Netlify deployment...');

// Read current package.json
const packagePath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Fix 1: Update scripts
packageJson.scripts = packageJson.scripts || {};
packageJson.scripts.prepare = "husky 2>/dev/null || true";
packageJson.scripts.build = "vite build";
packageJson.scripts["build:full"] = "npm run type-check && npm run lint && vite build";

// Fix 2: Move husky to optionalDependencies
if (packageJson.dependencies && packageJson.dependencies.husky) {
  packageJson.optionalDependencies = packageJson.optionalDependencies || {};
  packageJson.optionalDependencies.husky = packageJson.dependencies.husky;
  delete packageJson.dependencies.husky;
}

if (packageJson.devDependencies && packageJson.devDependencies.husky) {
  packageJson.optionalDependencies = packageJson.optionalDependencies || {};
  packageJson.optionalDependencies.husky = packageJson.devDependencies.husky;
  delete packageJson.devDependencies.husky;
}

// If husky isn't anywhere, add it as optional
if (!packageJson.optionalDependencies || !packageJson.optionalDependencies.husky) {
  packageJson.optionalDependencies = packageJson.optionalDependencies || {};
  packageJson.optionalDependencies.husky = "^9.0.11";
}

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ package.json updated successfully!');
console.log('📦 Changes made:');
console.log('  - prepare script: husky 2>/dev/null || true');
console.log('  - build script: vite build');
console.log('  - husky moved to optionalDependencies');
