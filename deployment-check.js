#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class DeploymentChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.info = [];
  }

  log(type, message, file = null) {
    const entry = file ? `${message} (${file})` : message;
    this[type].push(entry);
  }

  checkFileExists(filePath, required = false) {
    const exists = fs.existsSync(filePath);
    if (!exists && required) {
      this.log('issues', `Missing required file: ${filePath}`);
    } else if (!exists) {
      this.log('warnings', `Optional file missing: ${filePath}`);
    } else {
      this.log('info', `Found: ${filePath}`);
    }
    return exists;
  }

  checkPackageJson() {
    console.log('\n🔍 Checking package.json...');
    
    if (!this.checkFileExists('package.json', true)) return;
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check build script
      if (!packageJson.scripts?.build) {
        this.log('issues', 'Missing "build" script in package.json');
      } else {
        this.log('info', `Build script: ${packageJson.scripts.build}`);
      }
      
      // Check Node version
      if (packageJson.engines?.node) {
        this.log('info', `Node version specified: ${packageJson.engines.node}`);
      } else {
        this.log('warnings', 'No Node version specified in engines');
      }
      
      // Check for Vite
      const hasVite = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;
      if (hasVite) {
        this.log('info', 'Vite detected - using dist directory');
      }
      
    } catch (error) {
      this.log('issues', `Error reading package.json: ${error.message}`);
    }
  }

  checkNetlifyConfig() {
    console.log('\n🔍 Checking Netlify configuration...');
    
    if (this.checkFileExists('netlify.toml')) {
      try {
        const config = fs.readFileSync('netlify.toml', 'utf8');
        
        // Check build command
        if (config.includes('command =')) {
          this.log('info', 'Build command configured in netlify.toml');
        } else {
          this.log('warnings', 'No build command in netlify.toml');
        }
        
        // Check publish directory
        if (config.includes('publish =')) {
          this.log('info', 'Publish directory configured in netlify.toml');
        } else {
          this.log('warnings', 'No publish directory in netlify.toml');
        }
        
        // Check SPA redirects
        if (config.includes('from = "/*"') && config.includes('to = "/index.html"')) {
          this.log('info', 'SPA redirects configured');
        } else {
          this.log('warnings', 'SPA redirects not properly configured');
        }
        
      } catch (error) {
        this.log('issues', `Error reading netlify.toml: ${error.message}`);
      }
    }
  }

  checkBuildOutput() {
    console.log('\n🔍 Checking build output...');
    
    // Check for dist directory (Vite default)
    if (this.checkFileExists('dist')) {
      if (this.checkFileExists('dist/index.html')) {
        this.log('info', 'Build output looks good - dist/index.html exists');
      } else {
        this.log('warnings', 'dist directory exists but no index.html found');
      }
    } else {
      this.log('info', 'No dist directory found - run build first to test');
    }
  }

  checkGitignore() {
    console.log('\n🔍 Checking .gitignore...');
    
    if (this.checkFileExists('.gitignore')) {
      try {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        
        const requiredEntries = ['node_modules', 'dist', '.env', '.env.local'];
        const missingEntries = requiredEntries.filter(entry => 
          !gitignore.includes(entry)
        );
        
        if (missingEntries.length === 0) {
          this.log('info', 'All important entries found in .gitignore');
        } else {
          this.log('warnings', `Missing in .gitignore: ${missingEntries.join(', ')}`);
        }
        
      } catch (error) {
        this.log('issues', `Error reading .gitignore: ${error.message}`);
      }
    }
  }

  checkEnvironmentFiles() {
    console.log('\n🔍 Checking environment files...');
    
    const envFiles = ['.env', '.env.local', '.env.production'];
    const foundEnvFiles = envFiles.filter(file => this.checkFileExists(file));
    
    if (foundEnvFiles.length > 0) {
      this.log('info', `Environment files found: ${foundEnvFiles.join(', ')}`);
      this.log('warnings', 'Remember to set environment variables in Netlify dashboard');
    }
    
    // Check for .env.example
    if (this.checkFileExists('.env.example')) {
      this.log('info', 'Found .env.example - good for documentation');
    }
  }

  checkPublicDirectory() {
    console.log('\n🔍 Checking public directory...');
    
    if (this.checkFileExists('public')) {
      // Check for _redirects file
      if (this.checkFileExists('public/_redirects')) {
        this.log('info', 'Found _redirects in public directory');
      } else {
        this.log('info', 'No _redirects file - using netlify.toml redirects');
      }
      
      // Check for common assets
      const commonAssets = ['favicon.ico', 'robots.txt', 'manifest.json'];
      commonAssets.forEach(asset => {
        if (this.checkFileExists(`public/${asset}`)) {
          this.log('info', `Found public asset: ${asset}`);
        }
      });
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 DEPLOYMENT READINESS REPORT');
    console.log('='.repeat(60));
    
    if (this.issues.length > 0) {
      console.log('\n❌ CRITICAL ISSUES (must fix):');
      this.issues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS (recommended fixes):');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    if (this.info.length > 0) {
      console.log('\n✅ GOOD TO GO:');
      this.info.forEach(info => console.log(`   • ${info}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.issues.length === 0) {
      console.log('🎉 Ready for deployment!');
      console.log('\nNext steps:');
      console.log('1. Run: npm run build (to test build locally)');
      console.log('2. Connect your repo to Netlify');
      console.log('3. Deploy!');
    } else {
      console.log('🔧 Please fix the critical issues above before deploying.');
    }
    
    console.log('\n💡 Pro tips:');
    console.log('• Test your build locally first: npm run build && npm run preview');
    console.log('• Set environment variables in Netlify dashboard');
    console.log('• Enable build notifications in Netlify settings');
    
    return this.issues.length === 0;
  }

  run() {
    console.log('🚀 Netlify Deployment Readiness Check');
    console.log('=====================================');
    
    this.checkPackageJson();
    this.checkNetlifyConfig();
    this.checkBuildOutput();
    this.checkGitignore();
    this.checkEnvironmentFiles();
    this.checkPublicDirectory();
    
    return this.generateReport();
  }
}

// Run the checker
const checker = new DeploymentChecker();
const ready = checker.run();
process.exit(ready ? 0 : 1);

export default DeploymentChecker;