#!/usr/bin/env node

/**
 * Unified Build Script for MBR Project
 * Handles deployment builds for both Netlify and Vercel with consistent behavior
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TIMEOUT_MS = 300000; // 5 minutes
const PLATFORM = process.platform;
const ARCH = process.arch;

// Logging utilities
const log = (message, emoji = '📦') => console.log(`${emoji} ${message}`);
const error = (message) => console.error(`❌ ${message}`);
const success = (message) => console.log(`✅ ${message}`);

/**
 * Execute a command with proper error handling
 */
function executeCommand(command, options = {}) {
  log(`Running: ${command}`);
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      timeout: TIMEOUT_MS,
      ...options 
    });
  } catch (err) {
    throw new Error(`Command failed: ${command} - ${err.message}`);
  }
}

/**
 * Install platform-specific optional dependencies
 */
function installPlatformDependencies() {
  log('Installing platform-specific dependencies...', '🔧');
  
  const dependencies = [];
  
  // Rollup platform dependencies
  if (PLATFORM === 'linux' && ARCH === 'x64') {
    dependencies.push('@rollup/rollup-linux-x64-gnu@^4.46.2');
    dependencies.push('@esbuild/linux-x64@^0.25.8');
  } else if (PLATFORM === 'darwin') {
    if (ARCH === 'arm64') {
      dependencies.push('@rollup/rollup-darwin-arm64@^4.46.2');
      dependencies.push('@esbuild/darwin-arm64@^0.25.8');
    } else {
      dependencies.push('@rollup/rollup-darwin-x64@^4.46.2');
      dependencies.push('@esbuild/darwin-x64@^0.25.8');
    }
  } else if (PLATFORM === 'win32' && ARCH === 'x64') {
    dependencies.push('@rollup/rollup-win32-x64-msvc@^4.46.2');
    dependencies.push('@esbuild/win32-x64@^0.25.8');
  }
  
  if (dependencies.length > 0) {
    try {
      executeCommand(`npm install --no-save ${dependencies.join(' ')}`);
      success('Platform dependencies installed successfully');
    } catch (err) {
      log('Failed to install platform dependencies, continuing...', '⚠️');
    }
  }
}

/**
 * Clean previous build artifacts
 */
function cleanBuild() {
  log('Cleaning previous build artifacts...', '🧹');
  
  const dirsToClean = ['dist', '.vite'];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      log(`Removed ${dir} directory`);
    }
  });
}

/**
 * Verify build output
 */
function verifyBuild() {
  log('Verifying build output...', '🔍');
  
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory not found');
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in build output');
  }
  
  // Check for essential assets
  const assetsPath = path.join(distPath, 'assets');
  if (!fs.existsSync(assetsPath)) {
    throw new Error('Assets directory not found in build output');
  }
  
  success('Build output verified successfully');
}

/**
 * Main build process
 */
async function main() {
  const startTime = Date.now();
  
  try {
    log('Starting unified build process...', '🚀');
    log(`Platform: ${PLATFORM}, Architecture: ${ARCH}`);
    log(`Node.js version: ${process.version}`);
    
    // Detect environment
    const isNetlify = process.env.NETLIFY === 'true';
    const isVercel = process.env.VERCEL === '1';
    const environment = isNetlify ? 'Netlify' : isVercel ? 'Vercel' : 'Local';
    
    log(`Environment: ${environment}`, '🌍');
    
    // Set environment variables for optimal build
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
    process.env.ROLLUP_WATCH = 'false';
    process.env.NODE_ENV = 'production';
    
    // Clean previous builds
    cleanBuild();
    
    // Install platform-specific dependencies
    installPlatformDependencies();
    
    // Run pre-build checks
    log('Running type check...', '🔍');
    executeCommand('npm run type-check');
    
    log('Running linter...', '🔍');
    executeCommand('npm run lint');
    
    // Build the application
    log('Building application...', '🏗️');
    executeCommand('npx vite build --mode production');
    
    // Verify build output
    verifyBuild();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    success(`Build completed successfully in ${duration}s`);
    
  } catch (err) {
    error(`Build failed: ${err.message}`);
    process.exit(1);
  }
}

// Run the build
main();