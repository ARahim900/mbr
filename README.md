# Muscat Bay Resource Management System

A modern, responsive web application for managing water, electricity, HVAC, firefighting, contractor tracking, and STP plant operations at Muscat Bay.

## 🚀 Features

- **Multi-Module Dashboard**: Water, Electricity, HVAC, Firefighting, Contractor Tracking, and STP Plant management
- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Real-time Data**: Live updates and notifications
- **Advanced Analytics**: Interactive charts and data visualization
- **Modern Tech Stack**: React 18, TypeScript, Vite, React Query, Zustand
- **Robust Architecture**: Error boundaries, loading states, and comprehensive testing

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

### UI & UX
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Elegant notifications
- **AOS** - Animate on scroll
- **Recharts** - Data visualization

### Database & Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Relational database

### Development & Testing
- **Vitest** - Fast unit testing
- **Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mbr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your actual values
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key_optional
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 🏗️ Project Structure

```
mbr/
├── components/           # React components
│   ├── modules/         # Feature modules
│   ├── ui/              # Reusable UI components
│   └── Layout.tsx       # Main layout component
├── hooks/               # Custom React hooks
├── services/            # API services and data fetching
├── store/               # Zustand stores
├── utils/               # Utility functions
├── database/            # Database schemas and mock data
├── src/                 # Additional source files
│   ├── test/           # Test utilities
│   └── index.css       # Global styles
├── public/              # Static assets
└── types.ts            # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: `#4E4456` - Main brand color
- **Accent**: `#00D2B3` - Highlight color
- **Mint**: `#A2D0C8` - Secondary accent
- **Ice Mint**: `#81D8D0` - Tertiary accent

### Breakpoints
- **xs**: 0px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 📱 Mobile Optimization

The application is built with a mobile-first approach:

- Touch-friendly interface with 44px minimum touch targets
- Optimized charts and data visualization for mobile
- Swipe gestures and pull-to-refresh functionality
- Progressive Web App (PWA) capabilities
- Offline support for critical features

## 🔒 Security Features

- Environment variable protection
- Input validation with Zod schemas
- XSS protection
- CSRF protection
- Secure API communication

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance Optimization

- Code splitting and lazy loading
- Bundle optimization with Vite
- Image optimization
- Caching strategies with React Query
- Service worker for offline functionality

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
The project includes `netlify.toml` configuration for easy deployment:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure responsive design
- Maintain accessibility standards

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

**Built with ❤️ for Muscat Bay Resource Management**