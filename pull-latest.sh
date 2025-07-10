#!/bin/bash

# Pull Latest Changes Script for MBR Project
# This script helps you pull the latest changes from the repository

echo "🚀 MBR - Pull Latest Changes"
echo "=============================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ This is not a git repository. Please run this script from the MBR project directory."
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes!"
    echo ""
    echo "Choose an option:"
    echo "1) Stash changes and pull latest"
    echo "2) Commit changes and pull latest"
    echo "3) Cancel"
    echo ""
    read -p "Enter your choice (1-3): " choice

    case $choice in
        1)
            echo "📦 Stashing your changes..."
            git stash push -m "Auto-stash before pull $(date '+%Y-%m-%d %H:%M:%S')"
            ;;
        2)
            echo "💾 Committing your changes..."
            git add .
            read -p "Enter commit message: " commit_msg
            git commit -m "$commit_msg"
            ;;
        3)
            echo "❌ Cancelled. No changes made."
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Exiting."
            exit 1
            ;;
    esac
fi

# Pull latest changes
echo ""
echo "📥 Pulling latest changes from main branch..."
git pull origin main

# Check if pull was successful
if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled latest changes!"
    
    # Install dependencies
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully!"
        
        # Ask if user wants to start dev server
        echo ""
        read -p "Would you like to start the development server? (y/n): " start_dev
        
        if [[ $start_dev =~ ^[Yy]$ ]]; then
            echo ""
            echo "🚀 Starting development server..."
            npm run dev
        else
            echo ""
            echo "✨ All done! You can start the dev server later with: npm run dev"
        fi
    else
        echo "❌ Failed to install dependencies. Please check the error above."
    fi
else
    echo "❌ Failed to pull changes. You may have merge conflicts to resolve."
    echo "Run 'git status' to see what needs to be resolved."
fi
