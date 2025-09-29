@echo off
echo 🚀 Deploying Mind Care Live...

REM Remove node_modules and dist
echo 🧹 Cleaning up...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Check if build was successful
if exist dist (
    echo ✅ Build successful!
    echo 📁 Built files are in the 'dist' folder
    echo.
    echo 🌐 Next steps:
    echo 1. Upload the contents of the 'dist' folder to your web server
    echo 2. Point mind-care.live domain to your hosting service
    echo 3. Set environment variable: VITE_GEMINI_API_KEY
    echo.
    echo 🎉 Your Digital Mental Wellness Platform is ready!
) else (
    echo ❌ Build failed!
    exit /b 1
)