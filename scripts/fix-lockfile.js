#!/usr/bin/env node

/**
 * Fix Package Lock Script
 * Regenerates package-lock.json if it's corrupted
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing package-lock.json...');

try {
  const lockfilePath = path.join(process.cwd(), 'package-lock.json');
  
  // Check if lockfile exists and is valid
  if (fs.existsSync(lockfilePath)) {
    try {
      const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
      if (lockfile.lockfileVersion && lockfile.lockfileVersion >= 1) {
        console.log('✅ Lockfile appears valid, no changes needed');
        return;
      }
    } catch (error) {
      console.log('⚠️  Lockfile is corrupted, regenerating...');
    }
  }
  
  // Remove existing lockfile and node_modules
  if (fs.existsSync(lockfilePath)) {
    fs.unlinkSync(lockfilePath);
    console.log('🗑️  Removed corrupted lockfile');
  }
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('🗑️  Removing node_modules...');
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  
  // Regenerate lockfile
  console.log('📦 Regenerating package-lock.json...');
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit',
    timeout: 300000 
  });
  
  console.log('✅ Package-lock.json regenerated successfully!');
  
} catch (error) {
  console.error('❌ Failed to fix lockfile:', error.message);
  process.exit(1);
}