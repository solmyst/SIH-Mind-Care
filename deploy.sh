#!/bin/bash

echo "🚀 Deploying Mind Care Live..."

# Remove node_modules and dist
echo "🧹 Cleaning up..."
rm -rf node_modules dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in the 'dist' folder"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Upload the contents of the 'dist' folder to your web server"
    echo "2. Point mind-care.live domain to your hosting service"
    echo "3. Set environment variable: VITE_GEMINI_API_KEY"
    echo ""
    echo "🎉 Your Digital Mental Wellness Platform is ready!"
else
    echo "❌ Build failed!"
    exit 1
fi