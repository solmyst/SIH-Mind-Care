# Deployment Guide for mind-care.live

## 🚀 Quick Deployment Steps

### 1. Remove node_modules (Manual Step)
```bash
# Run this command in your terminal:
rm -rf node_modules
# Or on Windows:
rmdir /s node_modules
```

### 2. Build the Project
```bash
npm install
npm run build
```

### 3. Deployment Options

#### Option A: Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder
3. Set custom domain to `mind-care.live`
4. The `netlify.toml` file is already configured

#### Option B: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set custom domain to `mind-care.live`
4. The `vercel.json` file is already configured

#### Option C: GitHub Pages
1. Push code to GitHub
2. Go to Settings > Pages
3. Set source to GitHub Actions
4. The `CNAME` file is already configured

#### Option D: Traditional Web Hosting
1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web server
3. Point `mind-care.live` to your server
4. The `_redirects` file handles routing

## 🔧 Environment Variables

Make sure to set these environment variables in your hosting platform:

```
VITE_GEMINI_API_KEY=AIzaSyCjz2wyyrZFTGq74WH98I3fMZKMJtYw9OQ
```

## 📁 Files Created for Deployment

- `netlify.toml` - Netlify configuration
- `vercel.json` - Vercel configuration  
- `_redirects` - General redirect rules
- `CNAME` - Domain configuration for GitHub Pages
- `deploy.md` - This deployment guide

## 🎯 Final Steps

1. **Remove node_modules**: `rm -rf node_modules`
2. **Install dependencies**: `npm install`
3. **Build project**: `npm run build`
4. **Deploy**: Choose one of the options above
5. **Set domain**: Point mind-care.live to your hosting service

## ✅ Features Included

- ✅ AI Mood Detection with Gemini API
- ✅ Dynamic Theme Changes
- ✅ Mental Health Chat Assistant
- ✅ Responsive Design
- ✅ Multi-language Support
- ✅ Crisis Detection & Support
- ✅ Real-time Mood Analysis

Your Digital Mental Wellness Platform is ready for deployment! 🎉