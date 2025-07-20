# Changelog

## [1.6.0] - 2025-07-20

### Added
- **New Firefighting & Alarm System Module**
  - Fire alarm monitoring and status tracking
  - Equipment management (fire extinguishers, sprinkler systems)
  - Maintenance scheduling and tracking
  - Safety reports and fire drill documentation
  - Real-time alarm status dashboard
  - Comprehensive fire safety equipment overview

### Updated
- App.tsx to include firefighting module routing
- Sidebar navigation to include Firefighting & Alarm option with Shield icon
- Module navigation system to support new module

## [Rollback] - 2025-07-20

### Reverted to July 18, 2025 State
- Rolled back all changes made after July 18 due to critical issues
- Restored stable navigation functionality
- Fixed chart visibility problems
- Restored working build configuration

### Issues Resolved by Rollback
- Navigation disappearing in water sections
- Line charts not rendering
- Mobile responsiveness problems
- Build failures on Netlify

## [1.5.0] - 2025-07-18

### Added
- AOS (Animate On Scroll) library v3.0.0-beta.6
- Framer Motion for advanced animations
- React Intersection Observer for scroll triggers
- Comprehensive scroll animation features
- Custom useAOS React hook
- Multiple animation types: fade, slide, zoom, flip, rotate

### Enhanced
- Improved user experience with smooth scroll animations
- Better visual feedback for user interactions
- Enhanced mobile performance with optimized animations

### Technical
- Updated build configuration for animation libraries
- Optimized bundle splitting for better performance
- Added animation-specific CSS utilities

## Previous Versions
- See git history for earlier changes