# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run type-check` - Check TypeScript types (run before commits)
- `npm run lint` - Check code linting (run before commits)
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier

### Testing
- `npm run test` - Run all tests with Vitest
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Run tests with coverage report
- Run single test: `npm run test -- path/to/test.test.ts`

### Deployment & Maintenance
- `npm run deploy:clean` - Clean build with console log removal and design fixes
- `npm run fix-console-logs` - Remove console.log statements for production
- `npm run clean-install` - Clean reinstall of dependencies

## Architecture Overview

This is a **modular facility management system** for Muscat Bay with six core modules:

1. **Water Analysis** - Hierarchical meter management (L1→L2→L3→L4)
2. **Electricity** - Power consumption tracking
3. **HVAC System** - Building climate maintenance
4. **Firefighting & Alarm** - Safety equipment management
5. **Contractor Tracker** - Service provider management
6. **STP Plant** - Sewage treatment operations

### Data Architecture
- **Primary Database**: Supabase (PostgreSQL) via `services/supabaseClient.ts`
- **Fallback Data**: Local TypeScript files in `database/` directory
- **4-Level Hierarchy**: Main Bulk → Zone Bulk → Building Bulk → Unit Meters
- **Time Series**: Monthly consumption data with automatic aggregation

### State Management
- **UI State**: Zustand store (`store/useAppStore.ts`)
- **Server State**: React Query for caching and synchronization
- **Forms**: React Hook Form + Zod validation

### Component Structure
```
components/
├── modules/          # Domain-specific business logic
├── ui/              # Reusable design system components
├── cards/           # Specialized card components
└── Layout.tsx       # Main responsive layout
```

## Development Patterns

### Module Development
Each module follows this structure:
- `database/[module]Database.ts` - Data layer with processing functions
- `components/modules/[Module].tsx` - Main component with business logic
- Supporting UI components for charts, tables, forms

### Responsive Design
- **Mobile-first approach** with adaptive navigation
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **Touch targets**: Minimum 44px for mobile interaction
- **Navigation**: Sidebar on desktop → Bottom tabs on mobile

### Data Processing Patterns
```typescript
// Hierarchical data aggregation
const processHierarchicalData = (meters: Meter[]) => {
  // Group by L1 → L2 → L3 → L4 levels
  // Calculate totals and distribution losses
  // Return aggregated structure
}
```

### Chart Integration
- **Library**: Recharts with custom styling
- **Types**: Bar, Line, Area, Pie, Gauge charts
- **Responsive**: Auto-resize containers with mobile optimizations
- **Colors**: Custom palette matching design system

## Environment Setup

Required environment variables in `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key_optional
```

## Path Aliases
Configured in `tsconfig.json`:
- `@/*` - Root directory
- `@components/*` - Components directory
- `@hooks/*` - Custom hooks
- `@services/*` - API services
- `@utils/*` - Utility functions
- `@store/*` - State management
- `@types` - Type definitions

## Key Conventions

### TypeScript
- Strict mode enabled with comprehensive type checking
- Prefer interfaces over types for object definitions
- Use proper typing for chart data and API responses

### Git Workflow
- Git hooks automatically run linting and type checking
- Use conventional commit messages
- Run `npm run type-check` and `npm run lint` before committing

### Data Visualization
- All charts must be responsive and mobile-optimized
- Use consistent color scheme from design system
- Include proper tooltips and accessibility features

### Performance
- Code splitting with manual chunks (vendor, charts)
- React Query for server state caching
- Lazy loading for heavy components