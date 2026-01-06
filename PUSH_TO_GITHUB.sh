#!/bin/bash

# Push Pulse Mobile to GitHub
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details

echo "🚀 Setting up Git repository..."

# Navigate to project directory
cd "/Users/laosanchez/Documents/Cursor/Pulse Mobile"

# Initialize git (if not already initialized)
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Initial commit: Pulse Mobile app"

# Add remote (REPLACE WITH YOUR REPO URL)
echo "🔗 Adding remote repository..."
echo "⚠️  Please replace the URL below with your actual GitHub repository URL"
echo ""
echo "Run these commands manually:"
echo ""
echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "Or if using SSH:"
echo "git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "git branch -M main"
echo "git push -u origin main"

