#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

// Function to run commands
function run(command, options = {}) {
  console.log(`📦 Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ Failed to run: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Clean up any existing installations
console.log('🧹 Cleaning up previous installations...');
if (fs.existsSync('node_modules')) {
  console.log('Removing node_modules...');
  run('rm -rf node_modules');
}

if (fs.existsSync('package-lock.json')) {
  console.log('Removing package-lock.json...');
  run('rm -f package-lock.json');
}

// Set npm configuration
console.log('⚙️ Configuring npm...');
run('npm config set fund false');
run('npm config set audit false');
run('npm config set legacy-peer-deps true');

// Install dependencies with specific flags for Netlify
console.log('📦 Installing dependencies...');
run('npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline');

// Install platform-specific rollup dependencies if needed
console.log('🔧 Installing platform-specific dependencies...');
const platform = process.platform;
const arch = process.arch;

console.log(`Platform: ${platform}, Architecture: ${arch}`);

// Install platform-specific rollup dependencies
try {
  if (platform === 'linux' && arch === 'x64') {
    console.log('Installing Linux x64 rollup dependency...');
    run('npm install --no-save @rollup/rollup-linux-x64-gnu@4.46.1');
  } else if (platform === 'darwin') {
    console.log('Installing macOS rollup dependency...');
    run('npm install --no-save @rollup/rollup-darwin-x64@4.46.1');
  } else if (platform === 'win32') {
    console.log('Installing Windows rollup dependency...');
    run('npm install --no-save @rollup/rollup-win32-x64-msvc@4.46.1');
  }
  
  // Install esbuild platform dependency
  if (platform === 'linux' && arch === 'x64') {
    run('npm install --no-save @esbuild/linux-x64@0.25.8');
  }
} catch (error) {
  console.log('⚠️ Failed to install platform-specific dependencies, continuing...');
  console.log('Error:', error.message);
}

// Run the build
console.log('🏗️ Building the application...');
try {
  // Try npm run build first
  run('npm run build');
} catch (error) {
  console.log('⚠️ npm run build failed, trying direct vite command...');
  try {
    run('node ./node_modules/vite/bin/vite.js build');
  } catch (viteError) {
    console.log('⚠️ Direct vite command failed, trying npx...');
    run('npx vite build');
  }
}

console.log('✅ Netlify build completed successfully!');