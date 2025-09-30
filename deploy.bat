@echo off
echo 🚀 Starting deployment to GitHub Pages...

echo 📦 Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo 📁 Preparing deployment files...
if exist gh-pages-temp rmdir /s /q gh-pages-temp
mkdir gh-pages-temp

echo 📋 Copying files...
xcopy dist\* gh-pages-temp\ /s /e /q

echo 📄 Adding deployment files...
echo. > gh-pages-temp\.nojekyll

cd gh-pages-temp
git init
git add .
git commit -m "Deploy Mind Care Live to GitHub Pages"

echo 🌐 Deploying to GitHub Pages...
git branch -M gh-pages
REM Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/mind-care-live.git
git push -f origin gh-pages

cd ..
rmdir /s /q gh-pages-temp

echo 🎉 Deployment completed!
echo 🌐 Your site will be available at: https://mind-care.live/
echo ⚠️  Don't forget to:
echo    1. Create the GitHub repository first
echo    2. Configure DNS for mind-care.live to point to GitHub Pages
echo    3. Enable GitHub Pages in repository settings
pause