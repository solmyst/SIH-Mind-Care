# 🚀 Simple GitHub Pages Deployment

## Quick Setup (3 Steps)

### 1. Create GitHub Repository
- Go to [GitHub](https://github.com/new)
- Repository name: `mind-care-live`
- Make it **Public**
- Click "Create repository"

### 2. Push Your Code
```bash
git init
git add .
git commit -m "Deploy Mind Care Live"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mind-care-live.git
git push -u origin main
```

### 3. Enable GitHub Pages
- Go to your repository → Settings → Pages
- Source: "GitHub Actions"
- That's it! 🎉

## Your Site Will Be Live At:
`https://YOUR_USERNAME.github.io/mind-care-live/`

## For Custom Domain (mind-care.live):
1. Add DNS CNAME record: `@` → `YOUR_USERNAME.github.io`
2. In GitHub Pages settings, add custom domain: `mind-care.live`
3. Enable HTTPS after DNS propagates

---
**Replace `YOUR_USERNAME` with your actual GitHub username**