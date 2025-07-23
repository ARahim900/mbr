#!/usr/bin/env node

/**
 * Remove console.log statements from source files
 * Keeps console.error and console.warn for important logging
 */

import fs from 'fs';
import path from 'path';

const excludeDirs = ['node_modules', 'dist', '.git', 'scripts'];
const excludeFiles = ['verify-commit.js', 'test-', 'debug-'];

let removedCount = 0;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const processedLines = lines.map(line => {
    // Remove console.log but keep console.error, console.warn, etc.
    if (line.includes('console.log') && !line.trim().startsWith('//')) {
      removedCount++;
      // Comment out instead of removing to preserve line numbers
      return line.replace(/console\.log\(/g, '// console.log(');
    }
    return line;
  });
  
  const newContent = processedLines.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Processed: ${filePath}`);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !excludeDirs.includes(file)) {
      processDir(fullPath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      const shouldExclude = excludeFiles.some(ex => file.includes(ex));
      if (!shouldExclude) {
        processFile(fullPath);
      }
    }
  });
}

console.log('🧹 Removing console.log statements...');
processDir('.');
console.log(`✅ Completed! Commented out ${removedCount} console.log statements.`);