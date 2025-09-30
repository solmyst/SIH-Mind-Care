# 🌐 Custom Domain Setup Guide - mind-care.live

This guide will help you deploy Mind Care Live to your custom domain `mind-care.live` using GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Access to DNS settings for `mind-care.live`
- Domain registrar account (where you bought mind-care.live)

## 🚀 Step-by-Step Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub and create a new repository:**
   - Repository name: `mind-care-live` (or any name you prefer)
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README (we'll push existing code)

2. **Note your repository URL:**
   - It will be: `https://github.com/YOUR_USERNAME/mind-care-live`

### Step 2: Update Deployment Scripts

1. **Edit `deploy.sh` (Linux/Mac) or `deploy.bat` (Windows):**
   - Replace `YOUR_USERNAME` with your actual GitHub username
   - Example: If your username is `johnsmith`, change:
   ```bash
   # From:
   https://github.com/YOUR_USERNAME/mind-care-live.git
   # To:
   https://github.com/johnsmith/mind-care-live.git
   ```

### Step 3: Configure DNS Settings

You need to point your domain to GitHub Pages. Choose **ONE** of these methods:

#### Method A: CNAME Record (Recommended)
1. **Go to your domain registrar's DNS settings**
2. **Add a CNAME record:**
   - **Name/Host:** `@` or leave blank (for root domain)
   - **Value/Target:** `YOUR_USERNAME.github.io`
   - **TTL:** 3600 (or default)

3. **Add a CNAME for www subdomain:**
   - **Name/Host:** `www`
   - **Value/Target:** `mind-care.live`
   - **TTL:** 3600

#### Method B: A Records (Alternative)
1. **Add A records pointing to GitHub Pages IPs:**
   - **Name/Host:** `@`
   - **Value:** `185.199.108.153`
   - **TTL:** 3600

2. **Repeat for all GitHub Pages IPs:**
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

### Step 4: Deploy to GitHub

1. **Push your code to GitHub:**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial deployment of Mind Care Live"

# Add your repository as origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/mind-care-live.git
git branch -M main
git push -u origin main
```

2. **Or use the deployment script:**
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

### Step 5: Configure GitHub Pages

1. **Go to your repository on GitHub**
2. **Click "Settings" tab**
3. **Scroll to "Pages" section**
4. **Configure source:**
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Root folder

5. **Add custom domain:**
   - Enter `mind-care.live` in the custom domain field
   - Click "Save"
   - ✅ Check "Enforce HTTPS" (after DNS propagates)

### Step 6: Verify Setup

1. **Check DNS propagation:**
   - Use tools like [whatsmydns.net](https://www.whatsmydns.net/)
   - Search for `mind-care.live`
   - Should show GitHub Pages IPs

2. **Test your site:**
   - Visit `https://mind-care.live`
   - Should load your Mind Care Live app
   - May take 24-48 hours for full DNS propagation

## 🔧 Troubleshooting

### Common Issues:

1. **"Repository not found" error:**
   - Make sure you created the GitHub repository
   - Check that the repository name matches in your scripts
   - Verify your GitHub username is correct

2. **DNS not resolving:**
   - Wait 24-48 hours for DNS propagation
   - Check DNS settings with your registrar
   - Use `nslookup mind-care.live` to test

3. **HTTPS certificate issues:**
   - Wait for GitHub to provision SSL certificate
   - Can take up to 24 hours after DNS is working
   - Don't enable "Enforce HTTPS" until certificate is ready

4. **404 errors:**
   - Check that `CNAME` file contains `mind-care.live`
   - Verify GitHub Pages is enabled in repository settings
   - Check that files are in `gh-pages` branch

### Debug Commands:

```bash
# Test DNS resolution
nslookup mind-care.live

# Check if GitHub can see your domain
dig mind-care.live

# Test local build
npm run build
npm run preview
```

## 📊 Domain Registrar Specific Instructions

### Namecheap:
1. Go to Domain List → Manage
2. Advanced DNS tab
3. Add CNAME record: `@` → `YOUR_USERNAME.github.io`

### GoDaddy:
1. Go to DNS Management
2. Add CNAME: `@` → `YOUR_USERNAME.github.io`

### Cloudflare:
1. DNS tab
2. Add CNAME: `@` → `YOUR_USERNAME.github.io`
3. Set proxy status to "DNS only" (gray cloud)

### Google Domains:
1. DNS tab
2. Custom resource records
3. CNAME: `@` → `YOUR_USERNAME.github.io`

## ✅ Final Checklist

- [ ] GitHub repository created and public
- [ ] Code pushed to repository
- [ ] DNS CNAME record added
- [ ] GitHub Pages enabled
- [ ] Custom domain configured in GitHub Pages
- [ ] HTTPS enforced (after DNS propagates)
- [ ] Site accessible at https://mind-care.live

## 🎉 Success!

Once everything is configured, your Mind Care Live platform will be available at:
- **Primary:** https://mind-care.live
- **Backup:** https://YOUR_USERNAME.github.io/mind-care-live

The site will include all features:
- ✅ AI mood detection and suggestions
- ✅ Dynamic mood-based theming
- ✅ Breathing exercises and wellness tools
- ✅ PWA functionality (installable on mobile)
- ✅ Responsive design for all devices

## 🔄 Future Updates

To update your live site:
1. Make changes to your code
2. Push to main branch: `git push origin main`
3. GitHub Actions will automatically deploy
4. Changes live at https://mind-care.live within minutes

---

**Need help?** Check GitHub Pages documentation or open an issue in your repository.