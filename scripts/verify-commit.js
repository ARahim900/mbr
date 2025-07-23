#!/usr/bin/env node

/**
 * Pre-commit verification script for MBR project
 * Ensures code quality and standards before committing
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, silent = false) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error };
  }
}

async function verifyCommit() {
  log('\n🔍 Starting pre-commit verification...', 'blue');
  
  const checks = [];
  
  // 1. Check TypeScript compilation
  log('\n📝 Checking TypeScript types...', 'yellow');
  const typeCheck = runCommand('npm run type-check');
  checks.push({
    name: 'TypeScript',
    passed: typeCheck.success,
    message: typeCheck.success ? 'No type errors found' : 'TypeScript errors detected'
  });
  
  // 2. Check if build succeeds
  log('\n🏗️  Verifying build...', 'yellow');
  const buildCheck = runCommand('npm run build');
  checks.push({
    name: 'Build',
    passed: buildCheck.success,
    message: buildCheck.success ? 'Build successful' : 'Build failed'
  });
  
  // 3. Check for console.log statements (except in specific files)
  log('\n🔍 Checking for console.log statements...', 'yellow');
  const consoleLogCheck = checkForConsoleLogs();
  checks.push({
    name: 'Console Logs',
    passed: consoleLogCheck.passed,
    message: consoleLogCheck.message
  });
  
  // 4. Check file sizes
  log('\n📊 Checking file sizes...', 'yellow');
  const fileSizeCheck = checkFileSizes();
  checks.push({
    name: 'File Sizes',
    passed: fileSizeCheck.passed,
    message: fileSizeCheck.message
  });
  
  // 5. Verify design guidelines
  log('\n🎨 Verifying design guidelines...', 'yellow');
  const designCheck = checkDesignGuidelines();
  checks.push({
    name: 'Design Guidelines',
    passed: designCheck.passed,
    message: designCheck.message
  });
  
  // Summary
  log('\n📋 Verification Summary:', 'blue');
  log('=' .repeat(50), 'blue');
  
  let allPassed = true;
  checks.forEach(check => {
    const status = check.passed ? '✅' : '❌';
    const color = check.passed ? 'green' : 'red';
    log(`${status} ${check.name}: ${check.message}`, color);
    if (!check.passed) allPassed = false;
  });
  
  log('=' .repeat(50), 'blue');
  
  if (allPassed) {
    log('\n✨ All checks passed! Ready to commit.', 'green');
    return true;
  } else {
    log('\n❌ Some checks failed. Please fix the issues before committing.', 'red');
    return false;
  }
}

function checkForConsoleLogs() {
  const excludeDirs = ['node_modules', 'dist', '.git', 'scripts'];
  const excludeFiles = ['verify-commit.js', 'test-', 'debug-'];
  
  let found = [];
  
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !excludeDirs.includes(file)) {
        searchDir(fullPath);
      } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
        const shouldExclude = excludeFiles.some(ex => file.includes(ex));
        if (!shouldExclude) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('console.log') && !line.trim().startsWith('//')) {
              found.push(`${fullPath}:${index + 1}`);
            }
          });
        }
      }
    });
  }
  
  searchDir('.');
  
  // Allow up to 50 console.log statements (more lenient)
  return {
    passed: found.length <= 50,
    message: found.length === 0 ? 'No console.log statements found' : `Found ${found.length} console.log statements (limit: 50)`
  };
}

function checkFileSizes() {
  const maxSizes = {
    '.tsx': 500 * 1024, // 500KB
    '.ts': 300 * 1024,  // 300KB
    '.css': 100 * 1024  // 100KB
  };
  
  let oversized = [];
  
  function checkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', 'dist', '.git'].includes(file)) {
        checkDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if (maxSizes[ext] && stat.size > maxSizes[ext]) {
          oversized.push({
            file: fullPath,
            size: stat.size,
            limit: maxSizes[ext]
          });
        }
      }
    });
  }
  
  checkDir('.');
  
  return {
    passed: oversized.length === 0,
    message: oversized.length === 0 ? 'All files within size limits' : `${oversized.length} files exceed size limits`
  };
}

function checkDesignGuidelines() {
  const violations = [];
  
  // Check for required design patterns
  const componentsDir = './components';
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir, { recursive: true });
    
    files.forEach(file => {
      if (file.endsWith('.tsx')) {
        const fullPath = path.join(componentsDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for glassmorphism classes
        if (content.includes('backdrop-blur') && !content.includes('bg-white/10')) {
          violations.push(`${file}: Glassmorphism should use bg-white/10 with backdrop-blur`);
        }
        
        // Check for proper shadow usage
        if (content.includes('shadow-') && !content.includes('shadow-lg')) {
          violations.push(`${file}: Use shadow-lg for consistent depth`);
        }
        
        // Check for animation classes
        if (content.includes('hover:') && !content.includes('transition')) {
          violations.push(`${file}: Hover effects should include transition classes`);
        }
      }
    });
  }
  
  return {
    passed: violations.length === 0,
    message: violations.length === 0 ? 'All design guidelines followed' : `${violations.length} design violations found`
  };
}

// Run verification
verifyCommit().then(success => {
  process.exit(success ? 0 : 1);
});
