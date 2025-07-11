# Pull Latest Changes Guide

This guide provides quick and easy ways to pull the latest changes from the MBR repository.

## 🚀 Quick Commands

### Option 1: Simple Pull (if you have no local changes)

```bash
git pull origin main
npm install
npm run dev
```

### Option 2: Save Your Work First

```bash
git add .
git commit -m "Save my local changes"
git pull origin main
npm install
npm run dev
```

### Option 3: Use the Scripts

We've created convenient scripts to automate the pull process:

## 📜 Using the Pull Scripts

### For Mac/Linux Users:

1. **First time setup** (only needed once):
   ```bash
   chmod +x pull-latest.sh
   ```

2. **Run the script**:
   ```bash
   ./pull-latest.sh
   ```

### For Windows Users:

Simply double-click the `pull-latest.bat` file or run it from Command Prompt:
```cmd
pull-latest.bat
```

## 🔍 What the Scripts Do:

1. **Check Git Installation**: Ensures git is installed on your system
2. **Verify Repository**: Confirms you're in the MBR project directory
3. **Handle Uncommitted Changes**: 
   - Option to stash changes temporarily
   - Option to commit changes before pulling
   - Option to cancel if you need to review changes
4. **Pull Latest Changes**: Downloads the latest code from the main branch
5. **Install Dependencies**: Runs `npm install` to update packages
6. **Optional Dev Server**: Asks if you want to start the development server

## 📋 Features Included in Latest Changes:

✅ **Enhanced AuthContext** with better localStorage handling  
✅ **Debug panel** in the bottom-right corner  
✅ **Detailed console logging** with emoji indicators  
✅ **Better error recovery** mechanisms  

## 🐛 After Pulling - Debug Steps:

1. **Open Browser Console** (F12)
2. **Look for logs** with emojis:
   - 🔍 Search/lookup operations
   - ✅ Success messages
   - ❌ Error messages
3. **Click the debug button** in the bottom-right corner
4. **Test features**:
   - Create a new user
   - Refresh the page
   - Check authentication persistence

## ⚠️ Troubleshooting

### If you get merge conflicts:

```bash
# View the conflicts
git status

# Resolve conflicts in your editor, then:
git add .
git commit -m "Resolved merge conflicts"
```

### If npm install fails:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### If the dev server won't start:

```bash
# Kill any existing processes on port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then try again:
npm run dev
```

## 📝 Manual Git Commands Reference

### Check current status:
```bash
git status
```

### See what changed:
```bash
git diff
```

### Stash changes temporarily:
```bash
git stash
git pull origin main
git stash pop
```

### Force pull (⚠️ loses local changes):
```bash
git fetch origin
git reset --hard origin/main
```

## 🎯 Best Practices

1. **Always pull before starting new work**
2. **Commit frequently** with meaningful messages
3. **Test after pulling** to ensure everything works
4. **Check the console** for any errors or warnings
5. **Use the debug panel** to verify authentication state

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify all dependencies are installed: `npm list`
3. Ensure you're on the latest Node.js version: `node --version`
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

---

Happy coding! 🚀
