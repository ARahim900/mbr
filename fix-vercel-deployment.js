#!/usr/bin/env node

/**
 * Fix Vercel Deployment Issues
 * Regenerates package-lock.json and ensures compatibility
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Vercel deployment issues...');

try {
  const lockfilePath = path.join(process.cwd(), 'package-lock.json');
  
  // Remove existing lockfile
  if (fs.existsSync(lockfilePath)) {
    console.log('🗑️  Removing existing package-lock.json');
    fs.unlinkSync(lockfilePath);
  }
  
  // Remove node_modules if it exists
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('🗑️  Removing node_modules');
    execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
  }
  
  // Regenerate lockfile with npm install
  console.log('📦 Regenerating package-lock.json...');
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
  });
  
  console.log('✅ Package-lock.json regenerated successfully!');
  console.log('🚀 Ready for Vercel deployment');
  
} catch (error) {
  console.error('❌ Fix failed:', error.message);
  process.exit(1);
}