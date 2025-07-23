@echo off
echo ====================================
echo   Netlify esbuild Version Fix
echo ====================================
echo.

echo [1/4] Cleaning up...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .netlify rmdir /s /q .netlify

echo [2/4] Installing specific esbuild version...
call npm install esbuild@0.25.6 --save-dev --exact

echo [3/4] Installing all dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [4/4] Testing build...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo SUCCESS: Local build works!
echo.
echo Next steps for Netlify:
echo 1. Commit and push these changes
echo 2. Or go to Netlify dashboard and trigger "Clear cache and deploy site"
echo.
pause