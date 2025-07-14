# MBR Design Implementation Guide

This guide provides step-by-step instructions for implementing the modern UI/UX design across all modules of the MBR application.

## 🎨 Design System Overview

### Core Principles
1. **Glassmorphism**: All cards and containers use backdrop blur with transparency
2. **Responsive First**: Mobile (375px) → Tablet (768px) → Desktop (1024px+)
3. **Smooth Animations**: 300ms transitions on all interactive elements
4. **Gradient Charts**: No grid lines, use gradient fills
5. **Consistent Colors**: Primary (#4E4456), Accent (#00D2B3)

## 📦 Component Library

### Available Components

```typescript
import { 
  GlassCard, 
  GradientButton, 
  ResponsiveGrid,
  ChartGradients,
  getChartConfig,
  colors 
} from '../ui';
```

## 🚀 Implementation Steps

### 1. Update Electricity System

```typescript
// components/modules/ElectricitySystem.tsx
import React from 'react';
import { Zap, TrendingUp, DollarSign } from 'lucide-react';
import { GlassCard, GradientButton, ResponsiveGrid } from '../ui';

const ElectricitySystem = () => {
  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Electricity System
        </h1>
        <p className="text-white/60">Monitor power consumption</p>
      </div>

      {/* Metrics Grid - Mobile First */}
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }}>
        {/* Add MetricCards here */}
      </ResponsiveGrid>

      {/* Power Gauge */}
      <GlassCard className="p-6 mt-6">
        {/* Add circular gauge with gradients */}
      </GlassCard>
    </div>
  );
};
```

### 2. Update HVAC System

Key features to implement:
- Temperature heatmap with gradient colors
- Zone control sliders (styled range inputs)
- Schedule management with glassmorphism cards

```typescript
// Temperature Zone Card
<GlassCard className="p-4 hover:scale-105 transition-all">
  <div className="flex justify-between items-center">
    <span className="text-white">Zone {zoneNumber}</span>
    <div className="flex items-center space-x-2">
      <input
        type="range"
        min="18"
        max="28"
        value={temperature}
        className="w-32"
        onChange={handleChange}
      />
      <span className="text-[#00D2B3] font-bold">{temperature}°C</span>
    </div>
  </div>
</GlassCard>
```

### 3. Update Contractor Tracker

Mobile-first approach:
- **Mobile**: Card view with essential info
- **Desktop**: Table view with full details

```typescript
// Mobile Card View
<div className="grid grid-cols-1 md:hidden gap-4">
  {contractors.map(contractor => (
    <GlassCard key={contractor.id} className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-white font-semibold">{contractor.name}</h4>
          <p className="text-white/60 text-sm">{contractor.service}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          contractor.status === 'active' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {contractor.status}
        </span>
      </div>
    </GlassCard>
  ))}
</div>

// Desktop Table View
<div className="hidden md:block">
  <GlassCard className="p-6 overflow-x-auto">
    <table className="w-full">
      {/* Table implementation */}
    </table>
  </GlassCard>
</div>
```

### 4. Update STP Plant

Focus on real-time monitoring:
- Process flow diagram with animations
- Real-time sensor data with progress bars
- Alert management system

```typescript
// Sensor Data Card
<GlassCard className="p-4">
  <div className="flex items-center justify-between mb-2">
    <span className="text-white/60 text-sm">{sensor.label}</span>
    <Activity size={16} className="text-[#00D2B3]" />
  </div>
  <p className="text-2xl font-bold text-white">{sensor.value}</p>
  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-[#00D2B3] to-[#4E4456] 
        rounded-full animate-pulse"
      style={{ width: `${sensor.percentage}%` }}
    />
  </div>
</GlassCard>
```

## 📊 Chart Implementation

### Standard Chart Configuration

```typescript
import { getChartConfig, ChartGradients } from '../ui';

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data} {...getChartConfig()}>
    <ChartGradients />
    <XAxis 
      dataKey="time" 
      stroke={colors.text.muted}
      axisLine={false}
      tickLine={false}
    />
    <YAxis 
      stroke={colors.text.muted}
      axisLine={false}
      tickLine={false}
    />
    <Tooltip {...getChartConfig().tooltip} />
    <Area 
      type="monotone" 
      dataKey="value" 
      stroke={colors.accent}
      strokeWidth={2}
      fillOpacity={1} 
      fill="url(#colorGradient)" 
    />
  </AreaChart>
</ResponsiveContainer>
```

## 🎯 Responsive Patterns

### Mobile Navigation

```typescript
// Always include mobile menu button in header
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg"
>
  <Menu size={24} />
</button>
```

### Responsive Grid Layouts

```typescript
// Use ResponsiveGrid for consistent breakpoints
<ResponsiveGrid 
  cols={{ 
    mobile: 1,      // 375px+
    tablet: 2,      // 768px+
    desktop: 3,     // 1024px+
    wide: 4         // 1920px+
  }}
>
  {/* Grid items */}
</ResponsiveGrid>
```

## 🧪 Testing Checklist

Before considering a module complete:

- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1920px)
- [ ] Verify glassmorphism effects
- [ ] Check hover states
- [ ] Ensure smooth animations
- [ ] Validate chart gradients
- [ ] Test loading states
- [ ] Verify responsive behavior

## 💡 Pro Tips

1. **Performance**: Use `React.memo` for heavy components
2. **Loading States**: Always show skeleton screens
3. **Animations**: Keep under 300ms for snappy feel
4. **Touch Targets**: Minimum 44x44px on mobile
5. **Contrast**: Ensure text is readable on glass effects

## 🎨 Common Patterns

### Alert/Notification Card
```typescript
<GlassCard variant="warning" className="p-4">
  <div className="flex items-start space-x-3">
    <AlertTriangle className="text-yellow-500" size={24} />
    <div>
      <h4 className="text-yellow-500 font-semibold">Title</h4>
      <p className="text-white/80 text-sm">Description</p>
    </div>
  </div>
</GlassCard>
```

### Empty State
```typescript
<GlassCard className="p-12 text-center">
  <Icon size={48} className="text-white/40 mx-auto mb-4" />
  <h3 className="text-xl font-semibold text-white mb-2">
    No Data Available
  </h3>
  <p className="text-white/60 mb-4">Get started by adding data</p>
  <GradientButton>Add New</GradientButton>
</GlassCard>
```

### Loading State
```typescript
<div className="animate-pulse space-y-4">
  <div className="h-8 bg-white/10 rounded w-1/3" />
  <div className="h-32 bg-white/10 rounded-xl" />
</div>
```

## 🚀 Next Steps

1. Implement design in remaining modules
2. Add transition animations between pages
3. Implement dark mode toggle
4. Add more interactive elements
5. Optimize performance with lazy loading

Remember: Consistency is key! Use the provided components and patterns throughout the application.