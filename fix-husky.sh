#!/bin/bash

# This script fixes the Husky issue in package.json for Netlify builds
# It modifies the prepare script to skip Husky installation in CI environments

echo "Fixing Husky issue in package.json..."

# Read the current package.json
if [ -f "package.json" ]; then
    # Create a backup
    cp package.json package.json.backup
    
    # Use Node.js to properly update the JSON file
    node -e "
    const fs = require('fs');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Update the prepare script to skip Husky in CI
    if (packageJson.scripts) {
        packageJson.scripts.prepare = 'if [ \"\$CI\" != \"true\" ]; then husky install; fi';
        console.log('Updated prepare script to skip Husky in CI');
    } else {
        console.log('No scripts section found in package.json');
    }
    
    // Write the updated package.json
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('package.json updated successfully');
    "
    
    echo "Fix applied successfully!"
    echo "The prepare script now skips Husky installation in CI environments like Netlify."
else
    echo "Error: package.json not found"
    exit 1
fi
