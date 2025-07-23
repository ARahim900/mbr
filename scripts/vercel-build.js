#!/usr/bin/env node

/**
 * Vercel Build Script
 * Handles platform-specific build issues and ensures successful deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Check if we're in a Vercel environment
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    console.log('📦 Detected Vercel environment');
    
    // Ensure we have the correct Node.js version
    console.log('🔍 Node.js version:', process.version);
    
    // Try to install missing rollup dependencies if needed
    try {
      console.log('🔧 Installing platform-specific dependencies...');
      execSync('npm install @rollup/rollup-linux-x64-gnu --save-optional --no-audit', { 
        stdio: 'inherit',
        timeout: 120000 
      });
    } catch (error) {
      console.log('⚠️  Optional dependency installation failed, continuing...');
    }
  }
  
  // Run the actual build
  console.log('🏗️  Running Vite build...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    timeout: 300000 // 5 minutes timeout
  });
  
  // Verify build output
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory not found');
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in build output');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build output verified in dist/ directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}