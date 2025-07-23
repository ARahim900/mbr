@echo off
echo ====================================
echo   MBR Deployment Fix Script
echo ====================================
echo.

echo [1/5] Cleaning up old files...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist package-lock.json del package-lock.json

echo [2/5] Clearing npm cache...
call npm cache clean --force

echo [3/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Trying with --legacy-peer-deps...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ERROR: Still failed. Check your package.json
        pause
        exit /b 1
    )
)

echo [4/5] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed. Check the error messages above.
    pause
    exit /b 1
)

echo [5/5] Testing build locally...
if exist dist\index.html (
    echo SUCCESS: Build completed successfully!
    echo You can now deploy to Netlify manually or trigger a new deploy.
) else (
    echo ERROR: Build output missing. Something went wrong.
    pause
    exit /b 1
)

echo.
echo ====================================
echo   Fix Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Go to your Netlify dashboard
echo 2. Click "Trigger deploy" ^> "Clear cache and deploy site"
echo 3. Or push these changes to trigger auto-deploy
echo.
pause