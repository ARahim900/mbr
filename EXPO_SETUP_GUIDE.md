# 🚀 Expo Go Setup Guide for Muscat Bay App

This guide will help you run your Muscat Bay Assets & Operations app on your iPhone using Expo Go.

## 📱 Prerequisites

1. **iPhone with iOS 13 or later**
2. **Expo Go app** (download from App Store)
3. **Computer with Node.js installed**
4. **Both devices on the same WiFi network**

## 🛠️ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Expo Setup
```bash
npm run setup:expo
```

This will:
- Install Expo CLI globally
- Install all project dependencies
- Generate a QR code for your app

### 3. Start Expo Development Server
```bash
npm run expo:start
```

### 4. Scan QR Code
1. Open **Expo Go** app on your iPhone
2. Tap **"Scan QR Code"**
3. Point your camera at the QR code
4. Your app will load automatically!

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run expo:start` | Start Expo development server |
| `npm run expo:start:web` | Start web version |
| `npm run expo:start:ios` | Start iOS simulator (if available) |
| `npm run expo:start:android` | Start Android emulator (if available) |
| `npm run expo:qr` | Show QR code in terminal |
| `npm run generate:qr` | Generate QR code image file |
| `npm run setup:expo` | Complete Expo setup |

## 🔧 Troubleshooting

### QR Code Not Working?
1. Make sure both devices are on the same WiFi network
2. Check if your firewall is blocking the connection
3. Try using the Expo Go app's "Enter URL manually" option
4. Use the URL displayed in the terminal

### App Not Loading?
1. Check your internet connection
2. Restart the Expo development server
3. Clear Expo Go app cache
4. Make sure all dependencies are installed

### Performance Issues?
1. Close other apps on your iPhone
2. Ensure good WiFi signal strength
3. Consider using a wired connection for development

## 📱 Mobile Optimizations

The app includes several mobile-specific optimizations:

- **Touch-friendly buttons** (minimum 44px touch targets)
- **Mobile navigation** with swipe gestures
- **Safe area handling** for notches and home indicators
- **Chart optimizations** for touch interaction
- **Prevented zoom** on input focus

## 🔄 Development Workflow

1. **Make changes** to your code
2. **Save the file** - changes will auto-reload on your iPhone
3. **Test on device** - see changes instantly
4. **Debug** using Expo DevTools in your browser

## 📊 Features Available on Mobile

- ✅ Dashboard with real-time data
- ✅ Water consumption charts
- ✅ Electricity monitoring
- ✅ Contractor tracking
- ✅ HVAC system management
- ✅ Firefighting alarm system
- ✅ STP plant monitoring
- ✅ Water analysis tools
- ✅ Responsive design
- ✅ Touch-optimized interface

## 🎯 Tips for Best Experience

1. **Keep your iPhone charged** - development can be battery-intensive
2. **Use landscape mode** for charts and data tables
3. **Enable notifications** for real-time updates
4. **Bookmark the app** in Expo Go for quick access

## 🚀 Deployment

When ready to deploy:
```bash
npm run expo:build
npm run expo:publish
```

This will create a standalone app that can be distributed via TestFlight or App Store.

---

**Need help?** Check the main README.md for more detailed information about the app features and architecture. 