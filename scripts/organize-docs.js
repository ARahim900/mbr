#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Documentation file mapping
const docMapping = {
  // Deployment docs
  'NETLIFY_DEPLOYMENT_GUIDE.md': 'docs/deployment/netlify.md',
  'VERCEL_DEPLOYMENT_FIXED.md': 'docs/deployment/vercel.md',
  'VERCEL_DEPLOYMENT_FIXES.md': 'docs/deployment/vercel-troubleshooting.md',
  'DEPLOYMENT_BUILD_FIXES.md': 'docs/deployment/build-fixes.md',
  'DEPLOYMENT_TRIGGER.md': 'docs/deployment/triggers.md',
  'DEPLOYMENT_TROUBLESHOOTING.md': 'docs/deployment/troubleshooting.md',
  
  // Development docs
  'DESIGN_GUIDELINES_AND_STANDARDS.md': 'docs/development/design-guidelines.md',
  'DESIGN_QUICK_REFERENCE.md': 'docs/development/design-reference.md',
  'MOBILE_RESPONSIVENESS_GUIDE.md': 'docs/development/mobile-responsiveness.md',
  'MOBILE_TRANSFORMATION_GUIDE.md': 'docs/development/mobile-transformation.md',
  'NAVIGATION_ENHANCEMENTS.md': 'docs/development/navigation-enhancements.md',
  'UI_NAVIGATION_ENHANCEMENT.md': 'docs/development/ui-navigation.md',
  'FRAMEWORK7_NAVIGATION_FIX.md': 'docs/development/framework7-fix.md',
  'CRITICAL_NAVIGATION_FIX.md': 'docs/development/critical-navigation-fix.md',
  'CHANGE_CONTROL_PROCESS.md': 'docs/development/change-control.md',
  'COMMIT_MANAGEMENT_GUIDE.md': 'docs/development/commit-guidelines.md',
  'GITHUB_ACTIONS_UPDATES.md': 'docs/development/github-actions.md',
  'MCP_INTEGRATION.md': 'docs/development/mcp-integration.md',
  'MODERNIZATION_SUMMARY.md': 'docs/development/modernization-summary.md',
  'IMPLEMENTATION_GUIDE.md': 'docs/development/implementation-guide.md',
  'IMPLEMENTATION_SUMMARY.md': 'docs/development/implementation-summary.md',
  'ISSUES_TO_CREATE.md': 'docs/development/issues-to-create.md',
  'FIX_SUMMARY.md': 'docs/development/fix-summary.md',
  'BUILD_FIXES_SUMMARY.md': 'docs/development/build-fixes-summary.md',
  'CHART_MOBILE_FIX_VERIFICATION.md': 'docs/development/chart-mobile-fix.md',
  'VISUALIZATION_FIXES_GUIDE.md': 'docs/development/visualization-fixes.md',
  'WATER_CHART_LABEL_ENHANCEMENTS.md': 'docs/development/water-chart-enhancements.md',
  'WATER_SYSTEM_FIXES.md': 'docs/development/water-system-fixes.md',
  'RANGE_SELECTION_FIX_GUIDE.md': 'docs/development/range-selection-fix.md',
  'STP_PLANT_IMPROVEMENTS.md': 'docs/development/stp-plant-improvements.md',
  'SCROLL_ANIMATIONS_README.md': 'docs/development/scroll-animations.md',
  'ZONE_ANALYSIS_DATA_GUIDE.md': 'docs/development/zone-analysis.md',
  
  // Guides
  'SUPABASE_SETUP_GUIDE.md': 'docs/guides/supabase-setup.md',
  'EXPO_SETUP_GUIDE.md': 'docs/guides/expo-setup.md',
  'EXPO_QUICK_START.md': 'docs/guides/expo-quick-start.md',
  'PULL_GUIDE.md': 'docs/guides/pull-guide.md',
  
  // Keep in root (important files)
  'README.md': 'README.md', // Keep main README in root
  'CHANGELOG.md': 'CHANGELOG.md', // Keep changelog in root
  'DOCUMENTATION_INDEX.md': 'docs/index.md', // Move to docs
  'CLAUDE.md': 'docs/development/claude-notes.md', // Move to development
  'REVERT_TO_JULY18.md': 'docs/development/revert-notes.md', // Move to development
};

// Files to remove (unused/duplicate)
const filesToRemove = [
  'EMERGENCY_NAVIGATION_FIX.html',
  '2nd Page.pdf',
  'src/muscat-bay-demo.html',
  'EMERGENCY_HOTFIX.sh'
];

console.log('🚀 Starting documentation organization...\n');

// Create directories if they don't exist
const dirs = ['docs', 'docs/guides', 'docs/deployment', 'docs/development'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Move documentation files
let movedCount = 0;
let removedCount = 0;

Object.entries(docMapping).forEach(([source, destination]) => {
  if (fs.existsSync(source)) {
    try {
      // Create destination directory if it doesn't exist
      const destDir = path.dirname(destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.renameSync(source, destination);
      console.log(`✅ Moved: ${source} → ${destination}`);
      movedCount++;
    } catch (error) {
      console.log(`❌ Error moving ${source}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  File not found: ${source}`);
  }
});

// Remove unused files
filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`🗑️  Removed: ${file}`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Error removing ${file}: ${error.message}`);
    }
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Moved ${movedCount} documentation files`);
console.log(`   🗑️  Removed ${removedCount} unused files`);
console.log(`   📁 Organized into logical structure`);

console.log('\n🎉 Documentation organization complete!');
console.log('📖 Check docs/README.md for the new documentation structure.'); 