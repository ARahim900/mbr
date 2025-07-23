#!/usr/bin/env node

/**
 * Fix common design violations in components
 */

import fs from 'fs';
import path from 'path';

let fixedCount = 0;

function fixDesignViolations(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // Fix 1: Add bg-white/10 with backdrop-blur
  if (newContent.includes('backdrop-blur') && !newContent.includes('bg-white/10')) {
    newContent = newContent.replace(/backdrop-blur-(\w+)/g, 'backdrop-blur-$1 bg-white/10');
    fixedCount++;
  }
  
  // Fix 2: Ensure shadow-lg is used
  if (newContent.includes('shadow-') && !newContent.includes('shadow-lg')) {
    newContent = newContent.replace(/shadow-\w+/g, 'shadow-lg');
    fixedCount++;
  }
  
  // Fix 3: Add transitions to hover effects
  const hoverRegex = /className="([^"]*hover:[^"]*)"(?![^"]*transition)/g;
  newContent = newContent.replace(hoverRegex, (match, classes) => {
    if (!classes.includes('transition')) {
      return `className="${classes} transition-all duration-300"`;
    }
    return match;
  });
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !['node_modules', 'dist', '.git'].includes(file)) {
      processDir(fullPath);
    } else if (stat.isFile() && file.endsWith('.tsx')) {
      fixDesignViolations(fullPath);
    }
  });
}

console.log('🎨 Fixing design violations...');
processDir('./components');
processDir('./src');
console.log(`✅ Fixed ${fixedCount} design violations.`);