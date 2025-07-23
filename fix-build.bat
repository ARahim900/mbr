@echo off
echo 🔧 Fixing build dependencies...

echo 📦 Cleaning up...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📥 Installing dependencies...
npm install --legacy-peer-deps --include=optional

echo 🔧 Installing platform-specific rollup dependencies...
npm install @rollup/rollup-win32-x64-msvc@4.21.2 --save-optional --legacy-peer-deps --force

echo 🏗️ Testing build...
npm run build

echo ✅ Build fix complete!
pause