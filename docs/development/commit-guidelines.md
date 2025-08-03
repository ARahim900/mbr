# 📋 MBR Commit Management Guide

## 🎯 Overview

This guide provides comprehensive instructions for maintaining clean, atomic commits with proper verification and easy rollback capabilities in the MBR project.

## 🚀 Quick Start

### Initial Setup (One-time only)

```bash
# Clone the repository
git clone https://github.com/ARahim900/mbr.git
cd mbr

# Install dependencies (this will automatically set up git hooks)
npm install

# Or manually setup hooks
npm run setup-hooks        # Mac/Linux
npm run setup-hooks:windows # Windows
```

### Daily Workflow

1. **Before making changes:**
   ```bash
   git pull origin main
   npm install  # If package.json was updated
   ```

2. **Make your changes** following the design guidelines

3. **Verify your changes:**
   ```bash
   npm run verify  # Run all checks before committing
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit  # Hooks will run automatically
   ```

## 📝 Commit Message Format

### Structure
```
<type>: <subject>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature (e.g., `feat: Add water consumption dashboard`)
- **fix**: Bug fix (e.g., `fix: Resolve chart rendering on mobile`)
- **docs**: Documentation changes (e.g., `docs: Update API documentation`)
- **style**: Formatting, no code change (e.g., `style: Format code with prettier`)
- **refactor**: Code refactoring (e.g., `refactor: Simplify data processing logic`)
- **perf**: Performance improvements (e.g., `perf: Optimize chart rendering`)
- **test**: Adding tests (e.g., `test: Add unit tests for water module`)
- **chore**: Maintenance tasks (e.g., `chore: Update dependencies`)

### Rules
- Subject line: 50 characters max
- Use imperative mood ("Add" not "Added")
- No period at the end
- Body: Wrap at 72 characters
- Reference issues when applicable

### Examples

#### Simple commit:
```
feat: Add real-time water quality monitoring
```

#### Detailed commit:
```
fix: Resolve chart tooltip positioning on mobile devices

- Adjusted tooltip offset calculation
- Added viewport boundary detection
- Fixed z-index conflicts with sidebar

Closes #45
```

## 🔍 Pre-commit Verification

The automated verification checks:

1. **TypeScript Compilation** - No type errors
2. **Build Success** - Project builds without errors
3. **Console Logs** - No debugging statements left
4. **File Sizes** - No oversized files
5. **Design Guidelines** - Follows MBR design standards

### Manual Verification
```bash
npm run verify  # Run all checks manually
```

### Bypassing Checks (Emergency Only!)
```bash
git commit --no-verify  # Skip hooks - USE WITH CAUTION
```

## 🔄 Rollback Procedures

### Interactive Rollback Helper
```bash
npm run rollback
```

This provides:
- View recent commits
- Revert specific commits (safe)
- Reset to previous state (destructive)
- Create backup branches
- View commit details

### Manual Rollback Commands

#### View History
```bash
git log --oneline -10  # Last 10 commits
git log --graph --oneline --all  # Visual branch history
```

#### Safe Rollback (Revert)
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>
```

#### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1  # Keep changes staged
git reset HEAD~1         # Keep changes unstaged
```

#### Hard Reset (DESTRUCTIVE)
```bash
# Create backup first!
git branch backup-$(date +%s)

# Then reset
git reset --hard <commit-hash>
```

#### Recover from Mistakes
```bash
# View all operations
git reflog

# Recover to specific point
git reset --hard HEAD@{2}
```

## 🎯 Best Practices

### 1. Atomic Commits
- One feature/fix per commit
- Each commit should be independently revertible
- Test after each commit

### 2. Commit Frequency
- Commit when a logical unit of work is complete
- Don't commit broken code
- Push at least daily

### 3. Branch Strategy
```bash
# Feature branches
git checkout -b feat/water-analytics
git checkout -b fix/mobile-chart-issue

# Merge back
git checkout main
git merge --no-ff feat/water-analytics
```

### 4. Before Pushing
```bash
# Update from remote
git pull --rebase origin main

# Verify everything works
npm run verify
npm run build
npm run dev  # Test manually

# Then push
git push origin main
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run verify` | Run all pre-commit checks |
| `npm run rollback` | Interactive rollback helper |
| `npm run commit-helper` | Stage all changes and commit |
| `npm run setup-hooks` | Setup git hooks (Mac/Linux) |
| `npm run setup-hooks:windows` | Setup git hooks (Windows) |
| `npm run lint:check` | Check code quality |

## 🚨 Troubleshooting

### Hooks Not Running
```bash
# Re-run setup
npm run setup-hooks

# Check hook files exist
ls -la .git/hooks/
```

### Windows Issues
- Use Git Bash instead of CMD/PowerShell
- Run `npm run setup-hooks:windows`
- Or double-click `setup-hooks.bat`

### Commit Rejected
1. Read the error message carefully
2. Run `npm run verify` to see all issues
3. Fix each issue
4. Try committing again

### Accidental Commit
```bash
# If not pushed yet
git reset --soft HEAD~1  # Undo commit, keep changes

# If already pushed (creates new commit)
git revert HEAD
git push
```

## 📚 Additional Resources

- [Design Guidelines](./DESIGN_GUIDELINES_AND_STANDARDS.md)
- [Project README](./README.md)
- [Git Documentation](https://git-scm.com/doc)

## 💡 Tips

1. **Use VS Code Git Integration** - But understand the commands
2. **Review Before Committing** - `git diff --staged`
3. **Keep Commits Small** - Easier to review and revert
4. **Write Meaningful Messages** - Your future self will thank you
5. **Test Everything** - Automated checks catch most issues

## 🔐 Safety Features

1. **Pre-commit Hooks** - Prevent bad commits
2. **Commit Message Validation** - Ensures consistency
3. **Automatic Backups** - Rollback creates backup tags
4. **Build Verification** - Ensures project always builds

---

**Remember**: Clean commits today save debugging time tomorrow! 🚀
