# MBR Design Quick Reference Card

## 🎨 Color Palette
```css
/* Primary Colors */
--header: #4E4456
--header-dark: #3A353F
--border: #5A5563
--accent: #00D2B3

/* Backgrounds */
--bg-light: bg-gray-50
--bg-dark: bg-gray-900

/* Text */
--text-primary: text-gray-900 / text-white
--text-secondary: text-gray-600 / text-gray-300
```

## 🧊 Glassmorphism Recipe
```css
/* Standard Glass Effect */
backdrop-blur-md bg-white/10 border border-white/20

/* Card Glass Effect */
bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg
```

## 📱 Responsive Classes
```css
/* Mobile First */
p-4 lg:p-6          /* Padding */
text-sm lg:text-base /* Text size */
hidden lg:block      /* Hide on mobile */
grid-cols-1 lg:grid-cols-3 /* Grid */
```

## 🎭 Component Templates

### Metric Card
```tsx
<div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
  <div className="flex items-center justify-between">
    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <TrendIcon className="h-5 w-5 text-green-500" />
  </div>
  <p className="mt-4 text-2xl font-bold">{value}</p>
  <p className="text-gray-600 dark:text-gray-400">{label}</p>
</div>
```

### Button
```tsx
<button className="px-4 py-2 bg-gradient-to-r from-[#00D2B3] to-[#00B5A0] text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
  Button Text
</button>
```

### Chart Container
```tsx
<div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
  <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-lg">
    <h3 className="text-white font-semibold">{title}</h3>
  </div>
  <div className="p-6">
    {/* Chart content */}
  </div>
</div>
```

## 📊 Chart Configuration
```javascript
// Gradient Definition
const gradient = (
  <defs>
    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.3}/>
    </linearGradient>
  </defs>
);

// Chart Props
<XAxis stroke="#9CA3AF" strokeWidth={0} />
<YAxis stroke="#9CA3AF" strokeWidth={0} />
<CartesianGrid strokeDasharray="0" stroke="transparent" />
<Tooltip 
  contentStyle={{
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px'
  }}
/>
```

## 🚫 Never Do This
```css
/* ❌ WRONG */
grid-lines: visible
background: #FFFFFF
animation: custom 500ms
border-radius: 0

/* ✅ CORRECT */
strokeDasharray="0" stroke="transparent"
bg-white dark:bg-gray-800 bg-opacity-90
transition-all duration-300
rounded-lg
```

## 📏 Spacing Scale
```
p-1 = 0.25rem
p-2 = 0.5rem
p-3 = 0.75rem
p-4 = 1rem
p-6 = 1.5rem
p-8 = 2rem
```

## 🎯 Touch Targets
- Minimum size: 44x44px
- Use classes: `min-h-[44px] min-w-[44px]`
- Add padding to small icons

## 🔄 Standard Animations
```css
/* Hover */
hover:scale-105

/* Click */
active:scale-95

/* Transition */
transition-all duration-300 ease-in-out

/* Shadow */
shadow-xl hover:shadow-2xl
```

## 📱 Breakpoint Reference
- Mobile: < 640px
- Tablet: 640px - 1023px  
- Desktop: ≥ 1024px (use `lg:`)

## ⚡ Performance Tips
1. Use `transform` for animations (not `width`/`height`)
2. Lazy load heavy components
3. Use `useMemo` for expensive calculations
4. Keep bundle size under 500KB

## 🚨 Emergency Contacts
If you need to modify the design:
1. Check DESIGN_GUIDELINES_AND_STANDARDS.md
2. Get stakeholder approval
3. Test on all device sizes
4. Update documentation

---
**Remember: When in doubt, keep it as is!**