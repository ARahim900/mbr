#!/bin/bash
# Run this script locally to fix the package.json
node -e "
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (packageJson.scripts && packageJson.scripts.prepare) {
  packageJson.scripts.prepare = 'if [ \"\$CI\" != \"true\" ]; then husky install; fi';
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Fixed: prepare script now skips Husky in CI');
} else {
  console.log('⚠️ No prepare script found');
}
"