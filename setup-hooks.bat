@echo off
title MBR Git Hooks Setup

echo ================================================
echo     MBR - Muscat Bay Resource Management
echo     Git Hooks and Commit Standards Setup
echo ================================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Setting up Git hooks...
node scripts/setup-hooks-windows.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to setup Git hooks
    pause
    exit /b 1
)
echo.

echo [3/4] Configuring commit template...
git config --local commit.template .gitmessage
echo.

echo [4/4] Running verification test...
call npm run verify
echo.

echo ================================================
echo     Setup Complete!
echo ================================================
echo.
echo Available commands:
echo   - npm run verify        : Run pre-commit checks
echo   - npm run rollback      : Interactive rollback helper
echo   - npm run commit-helper : Guided commit process
echo   - npm run dev          : Start development server
echo.
echo Next steps:
echo   1. Make your changes
echo   2. Run: git add .
echo   3. Run: git commit
echo   4. Follow the commit template
echo.
echo For more information, see COMMIT_MANAGEMENT_GUIDE.md
echo.
pause
