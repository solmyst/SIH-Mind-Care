# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy Mind Care Live to GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- Node.js 18+ installed

## 🔧 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository" or go to [https://github.com/new](https://github.com/new)
3. Repository name: `mind-care-live` (or your preferred name)
4. Description: `AI-powered Digital Mental Wellness Platform`
5. Make it **Public** (required for free GitHub Pages)
6. ✅ Check "Add a README file"
7. Click "Create repository"

### Step 2: Clone and Setup

1. **Clone your new repository:**
```bash
git clone https://github.com/YOUR_USERNAME/mind-care-live.git
cd mind-care-live
```

2. **Copy all project files to the repository folder**
   - Copy all files from your current project
   - Make sure to include the `.github` folder with workflows

3. **Install dependencies:**
```bash
npm install
```

### Step 3: Update Configuration

1. **Update `vite.config.ts`:**
   - The base URL is already configured for GitHub Pages
   - Replace `mind-care-live` with your repository name if different

2. **Update `deploy.sh` (if using manual deployment):**
   - Replace `YOUR_USERNAME` with your GitHub username
   - Replace `mind-care-live` with your repository name

### Step 4: Deploy Using GitHub Actions (Automatic)

1. **Push your code:**
```bash
git add .
git commit -m "Initial deployment of Mind Care Live"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The deployment will start automatically

3. **Wait for deployment:**
   - Go to "Actions" tab to see the deployment progress
   - Once complete, your site will be available at:
   - `https://YOUR_USERNAME.github.io/mind-care-live/`

### Step 5: Alternative Manual Deployment

If you prefer manual deployment:

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Deploy:**
```bash
npm run deploy:github
```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Click "Save"

## 🌐 Custom Domain (Optional)

To use a custom domain like `mindcarelive.com`:

1. **Add CNAME file:**
```bash
echo "yourdomain.com" > public/CNAME
```

2. **Configure DNS:**
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or A records pointing to GitHub Pages IPs

3. **Update GitHub Pages settings:**
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## 🔍 Troubleshooting

### Common Issues:

1. **404 Error on refresh:**
   - GitHub Pages doesn't support client-side routing by default
   - The included `.htaccess` and `404.html` files handle this

2. **Build fails:**
   - Check the Actions tab for error details
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **Assets not loading:**
   - Check the `base` URL in `vite.config.ts`
   - Ensure it matches your repository name

4. **Fonts not loading:**
   - Google Fonts are loaded from CDN
   - Check network connectivity and CORS policies

### Debug Commands:

```bash
# Test build locally
npm run build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Clear cache and reinstall
npm run clean
npm install
```

## 📊 Monitoring Deployment

1. **GitHub Actions:**
   - Monitor deployments in the "Actions" tab
   - View logs for any errors

2. **GitHub Pages Status:**
   - Check Settings → Pages for deployment status
   - View deployment history

3. **Site Health:**
   - Test all features after deployment
   - Check responsive design on different devices
   - Verify PWA functionality

## 🎉 Success!

Once deployed, your Mind Care Live platform will be available at:
- `https://YOUR_USERNAME.github.io/mind-care-live/`

The site includes:
- ✅ PWA functionality (installable on mobile)
- ✅ Responsive design
- ✅ AI mood detection
- ✅ Dynamic theming
- ✅ Offline support (service worker)

## 🔄 Updates

To update your deployed site:

1. Make changes to your code
2. Commit and push to main branch:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```
3. GitHub Actions will automatically redeploy

---

**Need help?** Open an issue in your repository or check the [GitHub Pages documentation](https://docs.github.com/en/pages).