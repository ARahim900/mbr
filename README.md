# MBR - Muscat Bay Resource Management System

A comprehensive web application for managing facility operations including Water Systems, Electricity Systems, HVAC Systems, Contractor Tracking, and STP Plant management.

⚠️ **IMPORTANT**: This application has reached its final design state. Please refer to DESIGN_GUIDELINES_AND_STANDARDS.md before making any changes.

## 🎨 Design Philosophy

This application features a modern SaaS design with:
- Glassmorphism effects throughout the UI
- Gradient-based visualizations with no grid lines
- Mobile-first responsive design that works perfectly on all devices
- Smooth animations and transitions for enhanced user experience
- Dark purple themed interface (#4E4456) with teal accents

## 🚀 Features

### Core Modules
- **Water System Management**: Monitor and analyze water usage, quality, and zone-based consumption
- **Electricity System**: Track electrical consumption with detailed analytics and trends
- **HVAC System**: Manage heating, ventilation, and air conditioning systems
- **Contractor Tracker**: Keep track of contractors, their work schedules, and performance
- **STP Plant**: Sewage treatment plant monitoring with real-time data visualization

### Design Features
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop screens
- 🎯 **Modern UI/UX**: Glassmorphism, gradients, and smooth animations
- 📊 **Interactive Charts**: Real-time data visualization with Recharts
- 🔄 **Collapsible Sidebar**: Smart navigation that adapts to screen size
- 🌙 **Dark Mode Ready**: Built-in dark mode support
- ⚡ **Performance Optimized**: Fast loading and smooth interactions

## 💻 Technology Stack

- **Frontend Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Tailwind CSS (via CDN) with custom glassmorphism effects
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **Animations**: AOS (Animate On Scroll) v3.0.0-beta.6
- **State Management**: React hooks and context
- **Deployment**: Netlify-ready configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/ARahim900/mbr.git
cd mbr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Gemini API key to the .env file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔄 Pulling Latest Changes

We provide convenient scripts to help you pull the latest changes:

### Quick Method:
- **Mac/Linux**: Run `./pull-latest.sh`
- **Windows**: Double-click `pull-latest.bat`

### Manual Method:
```bash
git pull origin main
npm install
npm run dev
```

📚 For detailed instructions and troubleshooting, see PULL_GUIDE.md

## 🌐 Deployment

### Netlify Deployment (Recommended)

#### Via GitHub Integration:
1. Log in to Netlify
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub" and select ARahim900/mbr
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site settings
6. Deploy!

#### Via Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🏗️ Project Structure

```
mbr/
├── components/               # React components
│   ├── cards/               # Reusable card components
│   ├── modules/             # Main application modules
│   ├── ui/                  # UI components (buttons, charts, etc.)
│   ├── Layout.tsx           # Main layout wrapper
│   ├── Sidebar.tsx          # Collapsible navigation sidebar
│   └── TopHeader.tsx        # Fixed header component
├── database/                # Database utilities and mock data
├── services/                # API and service layer
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── water-system/           # Water system specific components
├── APP Logo.png           # Application logo
├── index.html              # Entry HTML file
├── index.tsx               # React entry point
├── App.tsx                 # Main App component
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Project dependencies
├── netlify.toml            # Netlify deployment config
├── pull-latest.sh          # Pull script for Mac/Linux
├── pull-latest.bat         # Pull script for Windows
├── PULL_GUIDE.md           # Detailed pull instructions
└── DESIGN_GUIDELINES_AND_STANDARDS.md  # Design system documentation
```

## 📱 Responsive Design

The application is optimized for:
- **Mobile**: 375px and up (iPhone SE, modern smartphones)
- **Tablet**: 768px - 1023px (iPads, Android tablets)
- **Desktop**: 1024px and up (laptops, desktops, large screens)

## 🎨 Design System

Key design elements that must be preserved:
- **Primary Color**: #4E4456 (Dark Purple)
- **Accent Color**: #00D2B3 (Teal)
- **Glassmorphism**: backdrop-blur-md bg-white/10
- **Shadows**: Multi-level shadow system for depth
- **Animations**: 300ms transitions with ease-in-out
- **Charts**: Gradient fills, no grid lines, custom tooltips

*For detailed design specifications, see DESIGN_GUIDELINES_AND_STANDARDS.md*

## 🔒 Environment Variables

Required environment variables for deployment:
- `GEMINI_API_KEY`: Your Google Gemini API key for AI features

## 📚 Documentation

- [Design Guidelines](DESIGN_GUIDELINES_AND_STANDARDS.md) - MUST READ before making changes
- [Pull Guide](PULL_GUIDE.md) - Instructions for pulling latest changes
- [Modernization Summary](docs/MODERNIZATION_SUMMARY.md) - Overview of design improvements
- [Mobile Transformation Guide](docs/MOBILE_TRANSFORMATION_GUIDE.md) - Mobile-specific features
- [UI Navigation Enhancement](docs/UI_NAVIGATION_ENHANCEMENT.md) - Navigation system details

## ⚠️ Important Notes

- **Design Freeze**: The current design is finalized. Any changes must follow the guidelines in DESIGN_GUIDELINES_AND_STANDARDS.md
- **Mobile First**: Always test on mobile devices first
- **Performance**: Keep bundle size minimal, use lazy loading where appropriate
- **Accessibility**: Maintain WCAG compliance for all interactive elements

## 🤝 Contributing

Before contributing:
1. Read the [Design Guidelines](DESIGN_GUIDELINES_AND_STANDARDS.md)
2. Pull latest changes using the provided scripts
3. Test on all device sizes
4. Ensure no visual regressions
5. Document any new patterns

## 📄 License

This project is private and proprietary. All rights reserved.

---

Built with ❤️ for Muscat Bay