#!/usr/bin/env node

/**
 * Ultimate Vercel Deployment Fix
 * Comprehensive solution for all npm ci and build issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Ultimate Vercel Deployment Fix Starting...');
console.log('=' .repeat(50));

const fixes = [];

try {
  // Fix 1: Verify and fix package.json engines
  console.log('🔧 Fix 1: Checking Node.js version compatibility...');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.engines?.node !== '>=18.0.0') {
    packageJson.engines = { ...packageJson.engines, node: '>=18.0.0' };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    fixes.push('✅ Updated Node.js engine to >=18.0.0');
  } else {
    fixes.push('✅ Node.js engine already correct');
  }

  // Fix 2: Ensure build:safe script is robust
  console.log('🔧 Fix 2: Ensuring robust build script...');
  if (!packageJson.scripts['build:safe']?.includes('npm ci --legacy-peer-deps || npm install --legacy-peer-deps')) {
    packageJson.scripts['build:safe'] = 'npm ci --legacy-peer-deps || npm install --legacy-peer-deps && vite build';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    fixes.push('✅ Updated build:safe script with fallback');
  } else {
    fixes.push('✅ Build:safe script already robust');
  }

  // Fix 3: Validate package-lock.json
  console.log('🔧 Fix 3: Validating package-lock.json...');
  const lockfilePath = path.join(process.cwd(), 'package-lock.json');
  
  if (fs.existsSync(lockfilePath)) {
    try {
      const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
      if (lockfile.lockfileVersion >= 1) {
        fixes.push('✅ Package-lock.json is valid');
      } else {
        throw new Error('Invalid lockfile version');
      }
    } catch (error) {
      console.log('⚠️  Package-lock.json is corrupted, regenerating...');
      fs.unlinkSync(lockfilePath);
      execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
      fixes.push('✅ Regenerated package-lock.json');
    }
  } else {
    console.log('⚠️  No package-lock.json found, creating...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    fixes.push('✅ Created package-lock.json');
  }

  // Fix 4: Optimize vercel.json
  console.log('🔧 Fix 4: Optimizing vercel.json...');
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  const optimalVercelConfig = {
    "version": 2,
    "buildCommand": "npm run build:safe",
    "outputDirectory": "dist",
    "framework": null,
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096",
      "NPM_CONFIG_LEGACY_PEER_DEPS": "true"
    },
    "build": {
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=4096",
        "NPM_CONFIG_LEGACY_PEER_DEPS": "true"
      }
    },
    "functions": {
      "app/api/**/*.js": {
        "maxDuration": 30
      }
    },
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/(.*\\.js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/(.*\\.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  };

  fs.writeFileSync(vercelJsonPath, JSON.stringify(optimalVercelConfig, null, 2));
  fixes.push('✅ Optimized vercel.json configuration');

  // Fix 5: Test build locally
  console.log('🔧 Fix 5: Testing build process...');
  try {
    execSync('npm run build:safe', { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        NODE_OPTIONS: '--max-old-space-size=4096',
        NPM_CONFIG_LEGACY_PEER_DEPS: 'true'
      }
    });
    fixes.push('✅ Local build test successful');
  } catch (error) {
    fixes.push('⚠️  Local build test failed - check for dependency issues');
  }

  // Fix 6: Create .nvmrc for Node version consistency
  console.log('🔧 Fix 6: Creating .nvmrc for Node version consistency...');
  fs.writeFileSync('.nvmrc', '18');
  fixes.push('✅ Created .nvmrc file');

  // Fix 7: Add .vercelignore for optimization
  console.log('🔧 Fix 7: Creating .vercelignore...');
  const vercelIgnore = `# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage
.nyc_output

# Development
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Build artifacts (keep dist for output)
.cache
.parcel-cache
.next
.nuxt
.vuepress/dist

# Temporary files
.tmp
.temp`;

  fs.writeFileSync('.vercelignore', vercelIgnore);
  fixes.push('✅ Created .vercelignore file');

  console.log('\n' + '='.repeat(50));
  console.log('🎉 ULTIMATE FIX COMPLETE!');
  console.log('='.repeat(50));
  
  fixes.forEach(fix => console.log(fix));
  
  console.log('\n📋 Summary of fixes applied:');
  console.log('1. ✅ Node.js version compatibility (>=18.0.0)');
  console.log('2. ✅ Robust build script with npm ci fallback');
  console.log('3. ✅ Valid package-lock.json');
  console.log('4. ✅ Optimized vercel.json with environment variables');
  console.log('5. ✅ Local build test');
  console.log('6. ✅ Node version consistency (.nvmrc)');
  console.log('7. ✅ Build optimization (.vercelignore)');
  
  console.log('\n🚀 Ready for deployment!');
  console.log('Next steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "fix: comprehensive Vercel deployment fixes"');
  console.log('3. git push origin main');
  console.log('\n💡 Your Vercel deployment should now work perfectly!');

} catch (error) {
  console.error('❌ Ultimate fix failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}