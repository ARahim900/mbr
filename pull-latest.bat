@echo off
REM Pull Latest Changes Script for MBR Project (Windows)
REM This script helps you pull the latest changes from the repository

echo.
echo ==================================
echo MBR - Pull Latest Changes
echo ==================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed. Please install git first.
    echo You can download it from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This is not a git repository.
    echo Please run this script from the MBR project directory.
    pause
    exit /b 1
)

REM Check for uncommitted changes
git diff-index --quiet HEAD -- 2>nul
if %errorlevel% neq 0 (
    echo WARNING: You have uncommitted changes!
    echo.
    echo Choose an option:
    echo 1) Stash changes and pull latest
    echo 2) Commit changes and pull latest
    echo 3) Cancel
    echo.
    set /p choice="Enter your choice (1-3): "

    if "%choice%"=="1" (
        echo.
        echo Stashing your changes...
        git stash push -m "Auto-stash before pull %date% %time%"
    ) else if "%choice%"=="2" (
        echo.
        echo Committing your changes...
        git add .
        set /p commit_msg="Enter commit message: "
        git commit -m "%commit_msg%"
    ) else if "%choice%"=="3" (
        echo.
        echo Cancelled. No changes made.
        pause
        exit /b 0
    ) else (
        echo.
        echo Invalid choice. Exiting.
        pause
        exit /b 1
    )
)

REM Pull latest changes
echo.
echo Pulling latest changes from main branch...
git pull origin main

if %errorlevel% equ 0 (
    echo.
    echo Successfully pulled latest changes!
    
    REM Install dependencies
    echo.
    echo Installing dependencies...
    call npm install
    
    if %errorlevel% equ 0 (
        echo.
        echo Dependencies installed successfully!
        
        REM Ask if user wants to start dev server
        echo.
        set /p start_dev="Would you like to start the development server? (y/n): "
        
        if /i "%start_dev%"=="y" (
            echo.
            echo Starting development server...
            call npm run dev
        ) else (
            echo.
            echo All done! You can start the dev server later with: npm run dev
        )
    ) else (
        echo.
        echo ERROR: Failed to install dependencies. Please check the error above.
    )
) else (
    echo.
    echo ERROR: Failed to pull changes. You may have merge conflicts to resolve.
    echo Run 'git status' to see what needs to be resolved.
)

echo.
pause
