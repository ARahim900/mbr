#!/usr/bin/env node

// Simple build test script for Netlify deployment debugging

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Netlify Build Test');
console.log('====================');

// Check Node version
console.log(`Node version: ${process.version}`);
console.log(`NPM version: ${execSync('npm --version', { encoding: 'utf8' }).trim()}`);

// Check if package.json exists and is valid
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Package.json valid - Project: ${pkg.name}`);
  console.log(`📦 Dependencies count: ${Object.keys(pkg.dependencies || {}).length}`);
  console.log(`🛠️  DevDependencies count: ${Object.keys(pkg.devDependencies || {}).length}`);
} catch (error) {
  console.log(`❌ Package.json error: ${error.message}`);
  process.exit(1);
}

// Check if vite is available
try {
  execSync('npm list vite', { encoding: 'utf8', stdio: 'pipe' });
  console.log('✅ Vite is available');
} catch (error) {
  console.log('❌ Vite not found in dependencies');
}

// Test npm install
console.log('\n🔧 Testing npm install...');
try {
  execSync('npm install --legacy-peer-deps', { 
    encoding: 'utf8', 
    stdio: 'inherit',
    timeout: 120000 // 2 minutes timeout
  });
  console.log('✅ npm install successful');
} catch (error) {
  console.log(`❌ npm install failed: ${error.message}`);
  process.exit(1);
}

// Test build
console.log('\n🏗️  Testing build...');
try {
  execSync('npm run build', { 
    encoding: 'utf8', 
    stdio: 'inherit',
    timeout: 180000 // 3 minutes timeout
  });
  console.log('✅ Build successful');
  
  // Check if dist directory was created
  if (fs.existsSync('dist') && fs.existsSync('dist/index.html')) {
    console.log('✅ Build output verified - dist/index.html exists');
  } else {
    console.log('⚠️  Build completed but dist/index.html not found');
  }
} catch (error) {
  console.log(`❌ Build failed: ${error.message}`);
  process.exit(1);
}

console.log('\n🎉 All tests passed! Ready for Netlify deployment.');