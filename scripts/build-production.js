#!/usr/bin/env node

/**
 * Production Build Script
 * Simplified and reliable build process
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Starting production build...');

try {
  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Verify dependencies are installed
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    execSync('npm ci --legacy-peer-deps', { stdio: 'inherit' });
  }
  
  // Clean previous build
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    console.log('🗑️  Cleaning previous build...');
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  
  // Run build
  console.log('🔨 Building application...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  // Verify build output
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory not found');
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in build output');
  }
  
  console.log('✅ Production build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}