#!/usr/bin/env node

/**
 * Setup script for MBR Git hooks on Windows
 * This script configures git hooks and commit templates
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    log(`Error running command: ${command}`, 'red');
    log(error.message, 'red');
    return null;
  }
}

// Create .git/hooks directory if it doesn't exist
const hooksDir = path.join('.git', 'hooks');
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

log('🔧 Setting up MBR Git hooks and commit standards for Windows...', 'blue');

// Create pre-commit hook
const preCommitHook = `#!/bin/sh

echo "🚀 Running pre-commit checks..."

# Run the verification script
node scripts/verify-commit.js

# Capture the exit code
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "❌ Pre-commit checks failed. Please fix the issues before committing."
    echo "💡 Tip: You can bypass hooks with --no-verify, but this is not recommended!"
    exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
`;

// Create commit-msg hook
const commitMsgHook = `#!/bin/sh

# Read the commit message
commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore)(\\(.+\\))?: .{1,50}'
commit_message=$(cat $1)

if ! echo "$commit_message" | grep -qE "$commit_regex"; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "📝 Your commit message must follow this format:"
    echo "   <type>: <subject>"
    echo ""
    echo "📋 Valid types:"
    echo "   feat:     New feature"
    echo "   fix:      Bug fix"
    echo "   docs:     Documentation changes"
    echo "   style:    Formatting changes (no code change)"
    echo "   refactor: Code refactoring"
    echo "   perf:     Performance improvements"
    echo "   test:     Adding tests"
    echo "   chore:    Build process or auxiliary tools"
    echo ""
    echo "Example: feat: Add water consumption dashboard"
    echo ""
    exit 1
fi

echo "✅ Commit message format is valid!"
`;

// Write hooks
try {
  fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook, { mode: 0o755 });
  log('✅ Pre-commit hook created', 'green');
} catch (error) {
  log('❌ Failed to create pre-commit hook: ' + error.message, 'red');
}

try {
  fs.writeFileSync(path.join(hooksDir, 'commit-msg'), commitMsgHook, { mode: 0o755 });
  log('✅ Commit-msg hook created', 'green');
} catch (error) {
  log('❌ Failed to create commit-msg hook: ' + error.message, 'red');
}

// Make hooks executable (Windows doesn't need chmod, but Git bash might)
if (process.platform !== 'win32' || process.env.SHELL) {
  runCommand('chmod +x .git/hooks/pre-commit');
  runCommand('chmod +x .git/hooks/commit-msg');
}

// Set up commit message template
runCommand('git config --local commit.template .gitmessage');
log('✅ Commit message template configured', 'green');

// Create a Windows batch file for easy setup
const batchContent = `@echo off
echo Setting up MBR Git hooks...
node scripts/setup-hooks-windows.js
echo.
echo Setup complete! Press any key to exit...
pause > nul
`;

try {
  fs.writeFileSync('setup-hooks.bat', batchContent);
  log('✅ Created setup-hooks.bat for easy Windows setup', 'green');
} catch (error) {
  log('⚠️  Could not create batch file: ' + error.message, 'yellow');
}

log('\n✅ Git hooks setup complete!', 'green');
log('\n📋 What\'s been configured:', 'cyan');
log('   ✓ Pre-commit hook for code verification', 'green');
log('   ✓ Commit message validation', 'green');
log('   ✓ Commit message template', 'green');
log('   ✓ Windows batch file for easy setup', 'green');

log('\n🎯 Next steps:', 'blue');
log('   1. Make changes to your code', 'cyan');
log('   2. Stage your changes: git add .', 'cyan');
log('   3. Commit (hooks will run automatically): git commit', 'cyan');
log('   4. The commit template will guide you', 'cyan');

log('\n💡 Available commands:', 'yellow');
log('   npm run verify        - Test your code before committing', 'cyan');
log('   npm run rollback      - Interactive rollback helper', 'cyan');
log('   npm run commit-helper - Guided commit process', 'cyan');

log('\n📌 Windows-specific tips:', 'yellow');
log('   - Use Git Bash for best compatibility', 'cyan');
log('   - If hooks don\'t work in VS Code terminal, try Git Bash', 'cyan');
log('   - You can also double-click setup-hooks.bat to re-run setup', 'cyan');
