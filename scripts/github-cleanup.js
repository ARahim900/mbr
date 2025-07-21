#!/usr/bin/env node

/**
 * GitHub Repository Cleanup Script
 * This script helps clean up issues and PRs systematically
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 GitHub Repository Cleanup Helper\n');

const tasks = [
  {
    type: 'IMMEDIATE',
    priority: '🚨',
    items: [
      {
        id: 'security-1',
        task: 'Go to https://dashboard.clerk.com',
        action: 'Revoke exposed API keys from PR #5',
        reason: 'Security breach - keys are public'
      },
      {
        id: 'security-2',
        task: 'Generate new Clerk API keys',
        action: 'Create new keys in Clerk dashboard',
        reason: 'Replace compromised keys'
      }
    ]
  },
  {
    type: 'ISSUES',
    priority: '📋',
    items: [
      {
        id: 'issue-9',
        task: 'Close Issue #9',
        action: 'gh issue close 9 --comment "Issue resolved as per the description"',
        reason: 'Already resolved'
      },
      {
        id: 'issue-4',
        task: 'Close Issue #4',
        action: 'gh issue close 4 --comment "Closing as duplicate of #3"',
        reason: 'Duplicate of Issue #3'
      },
      {
        id: 'issue-3',
        task: 'Add README.md and close Issue #3',
        action: 'Copy README content from issue, commit, then close',
        command: 'gh issue close 3 --comment "README.md added in commit [hash]"',
        reason: 'Documentation ready to add'
      }
    ]
  },
  {
    type: 'PULL_REQUESTS',
    priority: '🔀',
    items: [
      {
        id: 'pr-5',
        task: 'Fix PR #5 Security Issue',
        action: 'Remove SETUP_KEYS.md from PR',
        commands: [
          'gh pr checkout 5',
          'git rm SETUP_KEYS.md',
          'git commit -m "fix: Remove exposed API keys"',
          'git push',
          'gh pr comment 5 --body "🔒 Removed exposed API keys. Please ensure new keys are in .env.local"'
        ],
        reason: 'Contains exposed API keys'
      },
      {
        id: 'pr-1',
        task: 'Review and Merge PR #1',
        action: 'Zone data fixes',
        commands: [
          'gh pr review 1 --approve',
          'gh pr merge 1 --squash --subject "fix: Add missing data for zones 03(A) and 03(B)"'
        ],
        reason: 'Ready to merge'
      },
      {
        id: 'pr-7',
        task: 'Review and Merge PR #7',
        action: 'Chart enhancement',
        commands: [
          'gh pr review 7 --approve',
          'gh pr merge 7 --squash --subject "feat: Enhance Water System chart data labels"'
        ],
        reason: 'Small improvement ready'
      },
      {
        id: 'pr-8',
        task: 'Review and Merge PR #8',
        action: 'New firefighting feature',
        commands: [
          'gh pr review 8 --approve',
          'gh pr merge 8 --squash --subject "feat: Add Firefighting & Alarm System Tracker"'
        ],
        reason: 'Feature complete and ready'
      }
    ]
  }
];

// Print action plan
console.log('📊 Current Status:');
console.log('- 3 Open Issues (2 are README duplicates, 1 already resolved)');
console.log('- 4 Open Pull Requests (1 has security issue)');
console.log('- 1 Critical Security Issue (exposed API keys)\n');

// Generate cleanup commands
const generateCleanupScript = () => {
  let script = '#!/bin/bash\n\n';
  script += '# GitHub Repository Cleanup Script\n';
  script += '# Generated: ' + new Date().toISOString() + '\n\n';
  
  tasks.forEach(section => {
    script += `\n# ${section.priority} ${section.type}\n`;
    script += '# ' + '='.repeat(50) + '\n\n';
    
    section.items.forEach(item => {
      script += `# ${item.task}\n`;
      if (item.reason) script += `# Reason: ${item.reason}\n`;
      
      if (item.commands) {
        item.commands.forEach(cmd => {
          script += `${cmd}\n`;
        });
      } else if (item.command) {
        script += `${item.command}\n`;
      } else {
        script += `# Manual action required: ${item.action}\n`;
      }
      script += '\n';
    });
  });
  
  return script;
};

// Save cleanup script
const cleanupScript = generateCleanupScript();
fs.writeFileSync('cleanup-github.sh', cleanupScript);
console.log('✅ Created cleanup-github.sh\n');

// Interactive checklist
console.log('📝 Interactive Cleanup Checklist:\n');

let completed = 0;
const total = tasks.reduce((sum, section) => sum + section.items.length, 0);

tasks.forEach(section => {
  console.log(`\n${section.priority} ${section.type}`);
  console.log('─'.repeat(40));
  
  section.items.forEach(item => {
    console.log(`[ ] ${item.task}`);
    console.log(`    → ${item.action}`);
    if (item.reason) console.log(`    ⚠️  ${item.reason}`);
    console.log('');
  });
});

console.log('\n📈 Progress: 0/' + total + ' tasks completed');

// Summary
console.log('\n🎯 Quick Commands:\n');
console.log('# Close resolved issue:');
console.log('gh issue close 9 --comment "Resolved"\n');

console.log('# Close duplicate issues:');
console.log('gh issue close 4 --comment "Duplicate of #3"\n');

console.log('# Fix security issue in PR #5:');
console.log('gh pr checkout 5');
console.log('git rm SETUP_KEYS.md');
console.log('git commit -m "fix: Remove exposed API keys"');
console.log('git push\n');

console.log('# Merge ready PRs:');
console.log('gh pr merge 1 --squash');
console.log('gh pr merge 7 --squash');
console.log('gh pr merge 8 --squash\n');

console.log('✨ After cleanup, you\'ll have:');
console.log('- 0 Open Issues');
console.log('- 1 Open PR (Clerk Auth - after security fix)');
console.log('- Clean commit history');
console.log('- Secure repository\n');

// Create summary file
const summary = {
  timestamp: new Date().toISOString(),
  issues: {
    total: 3,
    toClose: ['#9 (resolved)', '#4 (duplicate)', '#3 (after adding README)']
  },
  pullRequests: {
    total: 4,
    toMerge: ['#1', '#7', '#8'],
    toFix: ['#5 (remove API keys)']
  },
  security: {
    critical: 'Exposed Clerk API keys in PR #5',
    action: 'Revoke keys immediately at https://dashboard.clerk.com'
  }
};

fs.writeFileSync('cleanup-summary.json', JSON.stringify(summary, null, 2));
console.log('📄 Cleanup summary saved to cleanup-summary.json');
