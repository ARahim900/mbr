#!/usr/bin/env node

/**
 * Build Fix Script
 * Handles Rollup dependency issues on Windows
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Starting build with dependency fixes...');

try {
  // Set environment variables to help with build
  process.env.ROLLUP_WATCH = 'false';
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Try to create a symlink or copy the missing dependency
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const rollupPath = path.join(nodeModulesPath, '@rollup');
  
  if (!fs.existsSync(rollupPath)) {
    fs.mkdirSync(rollupPath, { recursive: true });
  }
  
  // Try alternative build approaches
  const buildCommands = [
    'npx vite build --mode production',
    'npx vite build --force',
    'node_modules/.bin/vite build'
  ];
  
  let buildSuccess = false;
  
  for (const command of buildCommands) {
    try {
      console.log(`🏗️ Trying: ${command}`);
      execSync(command, { 
        stdio: 'inherit',
        timeout: 300000,
        env: { ...process.env, ROLLUP_WATCH: 'false' }
      });
      buildSuccess = true;
      break;
    } catch (error) {
      console.log(`⚠️ Command failed: ${command}`);
      continue;
    }
  }
  
  if (!buildSuccess) {
    throw new Error('All build attempts failed');
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
  console.log('💡 Try running: npm run clean-install');
  process.exit(1);
}