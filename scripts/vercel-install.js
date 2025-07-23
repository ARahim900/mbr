#!/usr/bin/env node

/**
 * Vercel Install Script
 * Handles npm installation issues in Vercel environment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📦 Starting Vercel install process...');

try {
  const lockfilePath = path.join(process.cwd(), 'package-lock.json');
  
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1';
  console.log(isVercel ? '🚀 Vercel environment detected' : '💻 Local environment');
  
  // Try different installation strategies
  const installCommands = [
    'npm ci --legacy-peer-deps',
    'npm install --legacy-peer-deps',
    'npm install --force'
  ];
  
  let installSuccess = false;
  
  for (const command of installCommands) {
    try {
      console.log(`📥 Trying: ${command}`);
      execSync(command, { 
        stdio: 'inherit',
        timeout: 300000, // 5 minutes
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
      });
      installSuccess = true;
      console.log(`✅ Installation successful with: ${command}`);
      break;
    } catch (error) {
      console.log(`⚠️  Failed: ${command}`);
      
      // If npm ci fails, try regenerating lockfile
      if (command.includes('npm ci') && fs.existsSync(lockfilePath)) {
        console.log('🔄 Regenerating lockfile...');
        try {
          fs.unlinkSync(lockfilePath);
        } catch (e) {
          console.log('Could not remove lockfile');
        }
      }
      continue;
    }
  }
  
  if (!installSuccess) {
    throw new Error('All installation methods failed');
  }
  
  // Verify installation
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error('node_modules directory not found after installation');
  }
  
  console.log('✅ Dependencies installed successfully!');
  
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}