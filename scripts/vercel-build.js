#!/usr/bin/env node

/**
 * Vercel Build Script
 * Handles platform-specific build issues and ensures successful deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Vercel build process...');

try {
  // Check if we're in a Vercel environment
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    console.log('📦 Detected Vercel environment');
    console.log('🔍 Node.js version:', process.version);
  }
  
  // Set build environment variables
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  process.env.ROLLUP_WATCH = 'false';
  
  // Run the actual build with error handling
  console.log('🏗️  Running Vite build...');
  
  const buildCommands = [
    'npx vite build --mode production',
    'npx vite build',
    'node_modules/.bin/vite build'
  ];
  
  let buildSuccess = false;
  
  for (const command of buildCommands) {
    try {
      console.log(`🔨 Attempting: ${command}`);
      execSync(command, { 
        stdio: 'inherit',
        timeout: 300000, // 5 minutes timeout
        env: { ...process.env }
      });
      buildSuccess = true;
      break;
    } catch (error) {
      console.log(`⚠️  Command failed: ${command}, trying next...`);
      continue;
    }
  }
  
  if (!buildSuccess) {
    throw new Error('All build commands failed');
  }
  
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
  console.error('Stack trace:', error.stack);
  process.exit(1);
}