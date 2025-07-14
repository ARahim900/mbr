// Export all UI components
export { GlassCard } from './GlassCard';
export { GradientButton } from './GradientButton';
export { ResponsiveGrid } from './ResponsiveGrid';

// Chart configuration helper
export const getChartConfig = () => ({
  margin: { top: 5, right: 5, bottom: 5, left: 5 },
  grid: false,
  axisLine: false,
  tickLine: false,
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(78, 68, 86, 0.9)',
      border: 'none',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      color: '#fff'
    }
  }
});

// Custom chart gradient definitions
export const ChartGradients = () => (
  <defs>
    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#00D2B3" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#4E4456" stopOpacity={0.1}/>
    </linearGradient>
    <linearGradient id="colorGradientSecondary" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#4E4456" stopOpacity={0.1}/>
    </linearGradient>
    <linearGradient id="colorGradientWarning" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#FFD93D" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
    </linearGradient>
  </defs>
);

// Color palette
export const colors = {
  primary: '#4E4456',
  accent: '#00D2B3',
  background: {
    primary: '#1a1a2e',
    secondary: '#16213e'
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    muted: 'rgba(255, 255, 255, 0.6)'
  },
  status: {
    success: '#4ECDC4',
    warning: '#FFD93D',
    danger: '#FF6B6B',
    info: '#6C63FF'
  }
};

// Responsive breakpoints
export const breakpoints = {
  mobile: 375,    // iPhone SE
  tablet: 768,    // iPad
  desktop: 1024,  // Desktop
  wide: 1920      // Wide screens
};