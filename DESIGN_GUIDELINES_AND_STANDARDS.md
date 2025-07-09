# MBR Application Design Guidelines and Standards

## 🎯 Purpose
This document serves as the definitive guide for maintaining the current design, structure, and functionality of the MBR (Muscat Bay Resource Management) application. These guidelines ensure consistency and preserve the carefully crafted user experience across all future updates.

## 🚨 CRITICAL: DO NOT MODIFY
The current design has been finalized and optimized for both mobile and desktop experiences. Any changes to the following core elements are strictly prohibited without explicit approval:

### 1. Color Scheme
- **Primary Header Color**: `#4E4456` (Dark Purple)
- **Logo Area Background**: `#3A353F` (Darker Purple)
- **Border Color**: `#5A5563`
- **Accent Color**: `#00D2B3` (Teal/Turquoise)
- **Background Colors**:
  - Light Mode: `bg-gray-50`
  - Dark Mode: `bg-gray-900`
- **Text Colors**:
  - Primary: `text-gray-900` / `text-white`
  - Secondary: `text-gray-600` / `text-gray-300`

### 2. Layout Structure
```
┌─────────────────────────────────────────┐
│          Fixed Header (#4E4456)          │
├────────┬────────────────────────────────┤
│        │                                 │
│Sidebar │      Main Content Area         │
│ (Col-  │                                 │
│lapsible)│                                │
│        │                                 │
└────────┴────────────────────────────────┘
```

## 📐 Component Standards

### Sidebar Navigation
- **Behavior**: 
  - Desktop: Collapsible with toggle button
  - Mobile: Overlay with backdrop
- **Width**: 
  - Expanded: `w-64` (16rem)
  - Collapsed: `w-20` (5rem)
- **Logo Display**:
  - Full logo when expanded
  - "MB" indicator when collapsed
- **Auto-close**: On mobile after selection

### Header Bar
- **Height**: Fixed at `h-24` (6rem)
- **Elements** (left to right):
  1. Mobile menu button (mobile only)
  2. Current section title
  3. Search, notifications, settings icons
  4. User profile avatar

### Content Area
- **Padding Top**: `pt-24 lg:pt-20`
- **Container**: `container mx-auto`
- **Overflow**: `overflow-x-hidden overflow-y-auto`

## 🎨 Design Patterns

### 1. Glassmorphism Effects
```css
/* Standard glassmorphism */
backdrop-blur-md bg-white/10 border border-white/20

/* Card glassmorphism */
bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg
```

### 2. Shadow System
- **Card Shadow**: `shadow-xl hover:shadow-2xl`
- **Button Shadow**: `shadow-md hover:shadow-lg`
- **Elevation Levels**:
  - Level 1: `shadow-sm`
  - Level 2: `shadow-md`
  - Level 3: `shadow-lg`
  - Level 4: `shadow-xl`
  - Level 5: `shadow-2xl`

### 3. Animation Standards
- **Transition Duration**: `transition-all duration-300`
- **Hover Scale**: `hover:scale-105`
- **Ease Function**: `ease-in-out`
- **Mobile Touch Feedback**: `active:scale-95`

### 4. Border Radius
- **Cards**: `rounded-lg` (0.5rem)
- **Buttons**: `rounded-lg` (0.5rem)
- **Small Elements**: `rounded-md` (0.375rem)
- **Pills/Badges**: `rounded-full`

## 📱 Responsive Breakpoints

### Breakpoint System
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: ≥ 1024px (lg:)

### Mobile-First Rules
1. Always start with mobile styles
2. Use `lg:` prefix for desktop overrides
3. Hide non-essential elements on mobile with `hidden lg:block`
4. Ensure touch targets are minimum 44x44px

## 📊 Chart Guidelines

### Chart Standards
- **No Grid Lines**: All charts must have grid lines disabled
- **Gradient Fills**: Use gradient fills for bars and areas
- **Tooltips**: Custom tooltips with glassmorphism effect
- **Colors**: Use the defined gradient color pairs
- **Animations**: Enable animation on load
- **Responsive**: Charts must resize properly

### Gradient Definitions
```javascript
const gradients = {
  blue: ['#3B82F6', '#1E40AF'],
  green: ['#10B981', '#047857'],
  purple: ['#8B5CF6', '#6D28D9'],
  teal: ['#14B8A6', '#0F766E'],
  red: ['#EF4444', '#DC2626']
};
```

## 🧩 Component Requirements

### MetricCard
- Must include icon with gradient background
- Display value prominently
- Show trend indicator (arrow up/down)
- Include label below value
- Glassmorphism background

### StatCard
- Similar to MetricCard but with horizontal layout
- Icon on the left
- Value and label on the right
- Optional trend percentage

### ChartCard
- Glassmorphism wrapper
- Gradient header background
- Title in header
- Chart fills entire body
- Proper padding and margins

### Button
- Four variants: primary, secondary, outline, ghost
- Three sizes: sm, md, lg
- Must have hover and active states
- Include focus ring for accessibility

## 🚫 Prohibited Changes

1. **DO NOT** modify the header color (#4E4456)
2. **DO NOT** change the sidebar collapse behavior
3. **DO NOT** add grid lines to charts
4. **DO NOT** remove glassmorphism effects
5. **DO NOT** change the responsive breakpoints
6. **DO NOT** modify the navigation structure
7. **DO NOT** alter the color scheme
8. **DO NOT** change animation timings
9. **DO NOT** remove gradient fills from charts
10. **DO NOT** modify touch target sizes

## ✅ Allowed Modifications

1. **Adding new modules**: Follow existing module structure
2. **New features within modules**: Use existing components
3. **Bug fixes**: That don't alter visual appearance
4. **Performance optimizations**: That maintain visual fidelity
5. **New data visualizations**: Using existing chart patterns
6. **Content updates**: Text, labels, data sources

## 🔧 Implementation Checklist

Before any update, verify:
- [ ] Colors match the defined palette
- [ ] Responsive behavior works on all screen sizes
- [ ] Animations are smooth and consistent
- [ ] Touch targets are appropriately sized
- [ ] Glassmorphism effects are preserved
- [ ] Charts follow the no-grid-line rule
- [ ] Sidebar behavior is unchanged
- [ ] Header remains fixed and styled correctly

## 📝 Code Standards

### TypeScript
- Use strict typing for all components
- Define interfaces for all props
- No `any` types without justification

### Component Structure
```typescript
interface ComponentProps {
  // Define all props with types
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return (
    // JSX with Tailwind classes
  );
};

export default Component;
```

### Tailwind Usage
- Use utility classes, not custom CSS
- Group related utilities logically
- Use consistent spacing patterns
- Apply responsive modifiers consistently

## 🎯 Testing Requirements

All changes must be tested on:
1. **Mobile Devices**:
   - iPhone SE (375px)
   - iPhone 12/13/14 (390px)
   - Samsung Galaxy (360px)
2. **Tablets**:
   - iPad (768px)
   - iPad Pro (1024px)
3. **Desktop**:
   - 1366px (common laptop)
   - 1920px (full HD)
   - 2560px (QHD)

## 📋 Review Process

Any proposed changes must:
1. Include screenshots on all device sizes
2. Document the business justification
3. Show performance impact analysis
4. Get approval from project stakeholders
5. Update this document if new patterns are introduced

## ⚠️ Final Note

This design system represents months of careful iteration and testing. The current implementation perfectly balances aesthetics, functionality, and performance. Any deviation from these guidelines risks compromising the user experience that has been meticulously crafted.

**When in doubt, preserve the existing design.**