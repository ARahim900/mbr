#!/usr/bin/env node

/**
 * Validate and Fix Package Lock
 * Ensures lockfile compatibility with npm ci
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Validating package-lock.json...');

try {
  const lockfilePath = path.join(process.cwd(), 'package-lock.json');
  
  if (!fs.existsSync(lockfilePath)) {
    console.log('❌ No package-lock.json found');
    process.exit(1);
  }
  
  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  
  console.log(`📋 Lockfile version: ${lockfile.lockfileVersion}`);
  console.log(`📦 Package name: ${lockfile.name}`);
  
  // Check if lockfile version is compatible
  if (lockfile.lockfileVersion >= 1) {
    console.log('✅ Lockfile version is compatible with npm ci');
    
    // Test npm ci in dry-run mode
    try {
      console.log('🧪 Testing npm ci...');
      execSync('npm ci --dry-run', { stdio: 'pipe' });
      console.log('✅ npm ci test passed');
    } catch (error) {
      console.log('⚠️  npm ci test failed, lockfile may need regeneration');
      console.log('Error:', error.message);
      
      // Suggest regeneration
      console.log('💡 Try running: npm run fix-lockfile');
    }
  } else {
    console.log('❌ Lockfile version is too old for npm ci');
    console.log('💡 Regenerating lockfile...');
    
    // Backup and regenerate
    fs.renameSync(lockfilePath, `${lockfilePath}.backup`);
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    console.log('✅ Lockfile regenerated');
  }
  
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}