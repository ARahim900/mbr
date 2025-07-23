#!/usr/bin/env node

/**
 * Vercel Safe Build Script
 * Ultimate fallback for Vercel deployments
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🛡️  Vercel Safe Build Starting...');

const buildStrategies = [
  {
    name: 'Strategy 1: npm ci with legacy peer deps',
    install: 'npm ci --legacy-peer-deps',
    build: 'npx vite build'
  },
  {
    name: 'Strategy 2: npm install with legacy peer deps',
    install: 'npm install --legacy-peer-deps',
    build: 'npx vite build'
  },
  {
    name: 'Strategy 3: npm install with force',
    install: 'npm install --force',
    build: 'npx vite build'
  },
  {
    name: 'Strategy 4: Clean install',
    install: 'npm install --legacy-peer-deps',
    build: 'npx vite build',
    preInstall: () => {
      // Clean up before install
      const nodeModulesPath = path.join(process.cwd(), 'node_modules');
      const lockfilePath = path.join(process.cwd(), 'package-lock.json');
      
      try {
        if (fs.existsSync(nodeModulesPath)) {
          console.log('🗑️  Removing node_modules...');
          fs.rmSync(nodeModulesPath, { recursive: true, force: true });
        }
        if (fs.existsSync(lockfilePath)) {
          console.log('🗑️  Removing package-lock.json...');
          fs.unlinkSync(lockfilePath);
        }
      } catch (e) {
        console.log('⚠️  Cleanup warning:', e.message);
      }
    }
  }
];

let buildSuccess = false;

for (const strategy of buildStrategies) {
  try {
    console.log(`🔄 Trying ${strategy.name}...`);
    
    // Set environment variables
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
    process.env.NPM_CONFIG_LEGACY_PEER_DEPS = 'true';
    process.env.ROLLUP_WATCH = 'false';
    
    // Run pre-install cleanup if defined
    if (strategy.preInstall) {
      strategy.preInstall();
    }
    
    // Try install
    console.log(`📦 Installing: ${strategy.install}`);
    execSync(strategy.install, { 
      stdio: 'inherit',
      timeout: 300000,
      env: { ...process.env }
    });
    
    // Try build
    console.log(`🏗️  Building: ${strategy.build}`);
    execSync(strategy.build, { 
      stdio: 'inherit',
      timeout: 300000,
      env: { ...process.env }
    });
    
    // Verify build output
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
      console.log(`✅ ${strategy.name} succeeded!`);
      buildSuccess = true;
      break;
    } else {
      throw new Error('Build output verification failed');
    }
    
  } catch (error) {
    console.log(`❌ ${strategy.name} failed: ${error.message}`);
    continue;
  }
}

if (!buildSuccess) {
  console.error('💥 All build strategies failed!');
  console.error('🔍 Debug information:');
  console.error('Node version:', process.version);
  console.error('NPM version:', execSync('npm --version', { encoding: 'utf8' }).trim());
  console.error('Current directory:', process.cwd());
  console.error('Environment variables:', {
    NODE_OPTIONS: process.env.NODE_OPTIONS,
    NPM_CONFIG_LEGACY_PEER_DEPS: process.env.NPM_CONFIG_LEGACY_PEER_DEPS,
    VERCEL: process.env.VERCEL
  });
  process.exit(1);
}

console.log('🎉 Build completed successfully!');
console.log('📁 Build output available in dist/ directory');