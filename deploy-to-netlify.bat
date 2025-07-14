@echo off
echo ====================================
echo   MBR Water System Deployment
echo ====================================
echo.

REM Step 1: Install dependencies
echo [1/4] Installing dependencies...
call npm install --force
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Step 2: Build the project
echo.
echo [2/4] Building the project...
call npx vite build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build project
    pause
    exit /b 1
)

REM Step 3: Install Netlify CLI if not present
echo.
echo [3/4] Checking Netlify CLI...
call netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Netlify CLI...
    call npm install -g netlify-cli
)

REM Step 4: Deploy to Netlify
echo.
echo [4/4] Deploying to Netlify...
echo.
echo Choose deployment option:
echo 1. Quick deploy (temporary URL)
echo 2. Production deploy (custom domain)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo Deploying to temporary URL...
    call netlify deploy --dir=dist --open
) else if "%choice%"=="2" (
    echo Deploying to production...
    call netlify deploy --prod --dir=dist --open
) else (
    echo Invalid choice. Deploying to temporary URL...
    call netlify deploy --dir=dist --open
)

echo.
echo ====================================
echo   Deployment Complete!
echo ====================================
echo.
echo Your enhanced Water System with glassmorphism labels is now live!
echo.
pause 