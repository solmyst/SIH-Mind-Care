#!/bin/bash

# Mind Care Live - GitHub Pages Deployment Script

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Create a temporary directory for gh-pages
echo "📁 Preparing deployment files..."
rm -rf gh-pages-temp
mkdir gh-pages-temp

# Copy dist contents to temp directory
cp -r dist/* gh-pages-temp/

# Add CNAME file for custom domain (optional)
# echo "mindcarelive.com" > gh-pages-temp/CNAME

# Add .nojekyll to prevent GitHub from processing as Jekyll site
touch gh-pages-temp/.nojekyll

# Initialize git in temp directory
cd gh-pages-temp
git init
git add .
git commit -m "Deploy Mind Care Live to GitHub Pages"

# Push to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
git branch -M gh-pages
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/mind-care-live.git
git push -f origin gh-pages

# Clean up
cd ..
rm -rf gh-pages-temp

echo "🎉 Deployment completed!"
echo "🌐 Your site will be available at: https://mind-care.live/"
echo "⚠️  Don't forget to:"
echo "   1. Create the GitHub repository first"
echo "   2. Configure DNS for mind-care.live to point to GitHub Pages"
echo "   3. Enable GitHub Pages in repository settings"