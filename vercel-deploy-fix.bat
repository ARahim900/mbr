@echo off
echo ====================================
echo   Vercel Deployment Fix
echo ====================================
echo.

echo [1/4] Cleaning up old files...
if exist dist rmdir /s /q dist

echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [3/4] Testing build locally...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo [4/4] Checking required files...
if exist package-lock.json (
    echo ✅ package-lock.json exists
) else (
    echo ❌ package-lock.json missing
)

if exist vercel.json (
    echo ✅ vercel.json exists
) else (
    echo ❌ vercel.json missing
)

if exist dist\index.html (
    echo ✅ Build output exists
) else (
    echo ❌ Build output missing
)

echo.
echo SUCCESS: Ready for Vercel deployment!
echo.
echo Next steps:
echo 1. Commit and push these changes (including package-lock.json)
echo 2. Or redeploy on Vercel dashboard
echo.
pause