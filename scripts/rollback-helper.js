#!/usr/bin/env node

/**
 * Rollback Helper for MBR Project
 * Provides safe and easy rollback functionality
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors
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
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getRecentCommits(count = 10) {
  const logFormat = '%H|%s|%an|%ar';
  const commits = runCommand(`git log --format="${logFormat}" -n ${count}`);
  
  return commits.trim().split('\n').map((line, index) => {
    const [hash, subject, author, date] = line.split('|');
    return {
      index: index + 1,
      hash: hash.substring(0, 7),
      fullHash: hash,
      subject,
      author,
      date
    };
  });
}

function getCurrentBranch() {
  return runCommand('git branch --show-current').trim();
}

function hasUncommittedChanges() {
  const status = runCommand('git status --porcelain');
  return status.trim().length > 0;
}

function showCommitDetails(hash) {
  log('\n📋 Commit Details:', 'cyan');
  log('─'.repeat(60), 'cyan');
  const details = runCommand(`git show --stat ${hash}`);
  console.log(details);
}

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  log('\n🔄 MBR Rollback Helper', 'blue');
  log('='.repeat(60), 'blue');
  
  // Check current branch
  const branch = getCurrentBranch();
  log(`\n📍 Current branch: ${branch}`, 'yellow');
  
  // Check for uncommitted changes
  if (hasUncommittedChanges()) {
    log('\n⚠️  You have uncommitted changes!', 'red');
    const proceed = await promptUser('Do you want to stash them first? (y/n): ');
    
    if (proceed.toLowerCase() === 'y') {
      runCommand('git stash');
      log('✅ Changes stashed. You can recover them with "git stash pop"', 'green');
    } else {
      log('❌ Please commit or stash your changes before rolling back.', 'red');
      rl.close();
      return;
    }
  }
  
  // Show recent commits
  log('\n📜 Recent Commits:', 'cyan');
  log('─'.repeat(60), 'cyan');
  
  const commits = getRecentCommits(20);
  commits.forEach(commit => {
    console.log(
      `${colors.yellow}${commit.index.toString().padStart(2)}${colors.reset} | ` +
      `${colors.green}${commit.hash}${colors.reset} | ` +
      `${commit.subject.substring(0, 40).padEnd(40)} | ` +
      `${colors.cyan}${commit.date}${colors.reset}`
    );
  });
  
  log('─'.repeat(60), 'cyan');
  
  // Ask user what to do
  log('\n🎯 Rollback Options:', 'blue');
  log('1. Revert a specific commit (safe - creates new commit)', 'green');
  log('2. Reset to a specific commit (destructive - changes history)', 'yellow');
  log('3. Create a backup branch before rollback', 'cyan');
  log('4. View commit details', 'cyan');
  log('5. Exit', 'red');
  
  const action = await promptUser('\nChoose an option (1-5): ');
  
  switch (action) {
    case '1': {
      // Revert
      const commitNum = await promptUser('Enter commit number to revert: ');
      const commit = commits[parseInt(commitNum) - 1];
      
      if (!commit) {
        log('❌ Invalid commit number', 'red');
        break;
      }
      
      showCommitDetails(commit.fullHash);
      const confirm = await promptUser('\nRevert this commit? (y/n): ');
      
      if (confirm.toLowerCase() === 'y') {
        try {
          runCommand(`git revert ${commit.fullHash} --no-edit`);
          log('\n✅ Commit reverted successfully!', 'green');
          log('A new commit has been created that undoes the changes.', 'green');
        } catch (error) {
          log('❌ Revert failed. There might be conflicts.', 'red');
        }
      }
      break;
    }
    
    case '2': {
      // Reset
      log('\n⚠️  WARNING: This will permanently remove commits!', 'red');
      const commitNum = await promptUser('Enter commit number to reset to: ');
      const commit = commits[parseInt(commitNum) - 1];
      
      if (!commit) {
        log('❌ Invalid commit number', 'red');
        break;
      }
      
      showCommitDetails(commit.fullHash);
      
      log('\nReset options:', 'yellow');
      log('1. --soft (keeps changes staged)', 'cyan');
      log('2. --mixed (keeps changes unstaged) [default]', 'cyan');
      log('3. --hard (discards all changes) ⚠️', 'red');
      
      const resetType = await promptUser('Choose reset type (1-3): ');
      const resetFlag = resetType === '1' ? '--soft' : resetType === '3' ? '--hard' : '--mixed';
      
      const confirm = await promptUser(`\nReset to ${commit.subject}? (y/n): `);
      
      if (confirm.toLowerCase() === 'y') {
        // Create backup tag
        const backupTag = `backup-${Date.now()}`;
        runCommand(`git tag ${backupTag}`);
        log(`\n📌 Backup tag created: ${backupTag}`, 'green');
        
        runCommand(`git reset ${resetFlag} ${commit.fullHash}`);
        log('\n✅ Reset completed!', 'green');
        log(`You can recover with: git reset --hard ${backupTag}`, 'yellow');
      }
      break;
    }
    
    case '3': {
      // Create backup branch
      const branchName = `backup-${branch}-${Date.now()}`;
      runCommand(`git branch ${branchName}`);
      log(`\n✅ Backup branch created: ${branchName}`, 'green');
      log('You can switch to it with: git checkout ' + branchName, 'cyan');
      break;
    }
    
    case '4': {
      // View details
      const commitNum = await promptUser('Enter commit number to view: ');
      const commit = commits[parseInt(commitNum) - 1];
      
      if (!commit) {
        log('❌ Invalid commit number', 'red');
        break;
      }
      
      showCommitDetails(commit.fullHash);
      
      // Ask if user wants to do something with this commit
      const next = await promptUser('\nPress Enter to continue...');
      await main(); // Restart
      return;
    }
    
    case '5': {
      log('\n👋 Exiting rollback helper', 'blue');
      break;
    }
    
    default:
      log('❌ Invalid option', 'red');
  }
  
  rl.close();
}

// Show usage tips
log('\n💡 Quick Rollback Commands:', 'yellow');
log('─'.repeat(60), 'yellow');
log('View history:        git log --oneline -10', 'cyan');
log('Revert last commit:  git revert HEAD', 'cyan');
log('Undo last commit:    git reset HEAD~1', 'cyan');
log('Create backup:       git branch backup-$(date +%s)', 'cyan');
log('─'.repeat(60), 'yellow');

// Run the interactive helper
main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
});
