@echo off
echo 🚀 Deploying Vercel fixes...

echo 📝 Adding changes to git...
git add .

echo 💾 Committing changes...
git commit -m "fix: comprehensive Vercel deployment fixes

- Updated Node.js engine requirement to >=18.0.0 for Vercel compatibility
- Added robust build scripts with npm ci fallback
- Optimized vercel.json with proper environment variables
- Added .nvmrc for Node version consistency
- Added .vercelignore for build optimization
- Fixed package-lock.json compatibility issues
- Added multiple build strategies for maximum reliability

This resolves the 'npm ci can only install with existing package-lock.json' error"

echo 🚀 Pushing to main branch...
git push origin main

echo ✅ Deployment fixes pushed! Vercel should now build successfully.
echo 📊 Check your Vercel dashboard for the new deployment status.

pause