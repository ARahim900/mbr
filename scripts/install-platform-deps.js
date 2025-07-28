#!/usr/bin/env node

/**
 * Platform-specific dependency installer
 * Handles optional platform-specific dependencies safely
 */

const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();
const arch = os.arch();

console.log(`Installing dependencies for platform: ${platform}-${arch}`);

try {
  // Base installation without optional dependencies first
  console.log('Installing base dependencies...');
  execSync('npm ci --legacy-peer-deps --no-optional', { stdio: 'inherit' });
  
  // Install platform-specific optional dependencies if needed
  if (platform === 'win32' && arch === 'x64') {
    console.log('Installing Windows x64 specific dependencies...');
    try {
      execSync('npm install @rollup/rollup-win32-x64-msvc --save-optional', { stdio: 'inherit' });
    } catch (error) {
      console.warn('Warning: Failed to install Windows-specific dependencies, continuing...');
    }
  }
  
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Installation failed:', error.message);
  process.exit(1);
}