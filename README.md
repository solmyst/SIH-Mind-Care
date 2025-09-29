# Mind Care Live - Digital Mental Wellness Platform

🌐 **Live at: [mind-care.live](https://mind-care.live)**

An AI-powered mental health support platform with intelligent mood detection and dynamic theming. Built with React, TypeScript, and Google's Gemini AI.

## ✨ Features

- 🤖 **AI Chat Assistant** - Powered by Google Gemini API
- 🎭 **Real-time Mood Detection** - Automatically detects user emotions
- 🎨 **Dynamic Theme Changes** - UI adapts to user's emotional state
- 🌍 **Multi-language Support** - English, Spanish, French, Hindi
- 🚨 **Crisis Detection** - Automatic identification of mental health emergencies
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Privacy Focused** - Secure and confidential conversations

## 🚀 Quick Deploy

### Method 1: Automated Script
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

### Method 2: Manual Steps
```bash
# Remove node_modules
rm -rf node_modules

# Install and build
npm install
npm run build

# Deploy the 'dist' folder to your hosting service
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment Options

### Netlify (Recommended)
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set custom domain: `mind-care.live`

### Vercel
1. Import GitHub repository
2. Framework preset: Vite
3. Set custom domain: `mind-care.live`

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Use GitHub Actions workflow (included)

## 🔧 Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📁 Project Structure

```
mind-care-live/
├── src/
│   ├── components/          # React components
│   │   ├── QuickChat.tsx   # AI chat interface
│   │   ├── aiGemini.tsx    # Gemini API integration
│   │   ├── MoodCard.tsx    # Mood display component
│   │   └── ...
│   ├── App.tsx             # Main application
│   └── main.tsx           # Entry point
├── public/                 # Static assets
├── dist/                  # Built files (generated)
└── deployment files       # Various hosting configs
```

## 🎯 Key Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **AI**: Google Gemini API
- **Animation**: Framer Motion
- **State Management**: React Hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please visit [mind-care.live](https://mind-care.live) or open an issue on GitHub.

---

**Made with ❤️ for mental health awareness**