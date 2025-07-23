@echo off
echo 🚀 Deploying Vercel fix...

echo 📝 Adding changes to git...
git add .

echo 💾 Committing changes...
git commit -m "fix: resolve Vercel deployment npm ci lockfile issue

- Updated Node.js engine requirement from >=20.0.0 to >=18.0.0 for Vercel compatibility
- Regenerated package-lock.json with legacy peer deps support
- Simplified vercel.json configuration to use build:safe command
- Enhanced build:safe script with fallback install strategy
- Removed custom installCommand to avoid Vercel conflicts

This should resolve the 'npm ci can only install with existing package-lock.json' error"

echo 🚀 Pushing to main branch...
git push origin main

echo ✅ Deployment fix pushed! Vercel should now build successfully.
echo 📊 Check your Vercel dashboard for the new deployment status.

pause