#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Vercel build process...');

try {
  // Clean up any existing node_modules and package-lock.json
  console.log('🧹 Cleaning up existing dependencies...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  if (fs.existsSync('package-lock.json')) {
    execSync('rm -f package-lock.json', { stdio: 'inherit' });
  }

  // Install dependencies with production=false to include devDependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci --production=false', { stdio: 'inherit' });

  // Force install the Linux-specific Rollup dependency
  console.log('🔧 Installing platform-specific dependencies...');
  execSync('npm install @rollup/rollup-linux-x64-gnu@4.21.2 --no-save', { stdio: 'inherit' });

  // Run the build
  console.log('🏗️ Building the application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 