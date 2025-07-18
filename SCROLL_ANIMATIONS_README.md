# Muscat Bay Resort - Scroll Animation Enhancement

## 🌊 Overview

This project has been enhanced with professional scroll-triggered animations inspired by luxury coastal resorts. The implementation features smooth, eye-catching animations that activate as users scroll through the page, creating an immersive and engaging experience.

## ✨ Features Implemented

### 1. **Scroll-Triggered Animations**
- **Fade Up**: Hero sections smoothly fade in and slide up
- **Fade In Scale**: Section titles appear with a scaling effect
- **Slide In Left/Right**: Cards and testimonials slide in from sides
- **Flip In**: Feature boxes flip into view
- **Zoom In**: Gallery images zoom in on scroll
- **Pulse In**: Buttons pulse as they appear
- **Fade In Text**: Paragraphs fade in with a blur effect
- **Counter Up**: Statistics count up to their target numbers

### 2. **Advanced Features**
- **Parallax Scrolling**: Background images move at different speeds
- **Section Reveals**: Entire sections smoothly reveal on scroll
- **Staggered Animations**: Multiple elements animate in sequence
- **Intersection Observer API**: Efficient performance-optimized animations
- **Accessibility Support**: Respects `prefers-reduced-motion` setting

### 3. **Design Elements**
- **Ocean & Desert Color Palette**: Inspired by Muscat's coastal beauty
- **Premium Typography**: Montserrat, Playfair Display, and Open Sans fonts
- **Responsive Grid Layouts**: Adapts beautifully to all screen sizes
- **Custom Loading Animation**: Smooth entry experience
- **Hover Effects**: Interactive elements with smooth transitions

## 📁 File Structure

```
src/
├── js/
│   └── scroll-animations.js    # Core animation logic
├── css/
│   └── muscat-bay-theme.css   # Complete theme styles
└── muscat-bay-demo.html       # Demo page showcasing all features
```

## 🚀 How to Use

### 1. **Include the Files**
```html
<!-- In your HTML head -->
<link rel="stylesheet" href="src/css/muscat-bay-theme.css">
<script type="module" src="src/js/scroll-animations.js"></script>
```

### 2. **Apply Animation Classes**
The animation system automatically detects and animates elements with these classes:
- `.hero-section` - Main hero areas
- `.section-title` - Section headings
- `.card` - Card components
- `.feature-box` - Feature sections
- `.testimonial` - Testimonial blocks
- `.stats-counter` - Number counters
- `.timeline-item` - Timeline elements
- `.gallery-item img` - Gallery images

### 3. **Custom Animation Attributes**
You can also manually add animations:
```html
<div class="scroll-animation" 
     data-animation="fade-up" 
     data-delay="200">
  Your content here
</div>
```

### 4. **Available Animations**
- `fade-up` - Fade in while moving up
- `fade-in-scale` - Fade in with scale
- `slide-in-left` - Slide from left
- `slide-in-right` - Slide from right
- `flip-in` - 3D flip effect
- `zoom-in` - Zoom in effect
- `pulse-in` - Pulse effect
- `fade-in-text` - Text with blur effect
- `fade-in-timeline` - Timeline specific animation
- `counter-up` - Number counting animation

## 🎨 Customization

### Colors
Edit the CSS variables in `muscat-bay-theme.css`:
```css
:root {
  --primary-blue: #1e3a5f;
  --ocean-blue: #2c5aa0;
  --sky-blue: #87ceeb;
  --sand-beige: #f5e6d3;
  --desert-gold: #d4a574;
  --sunset-orange: #ff6b35;
}
```

### Animation Timing
Modify animation durations in the CSS:
```css
.animated {
  animation-duration: 0.8s; /* Change this value */
}
```

### Intersection Observer Threshold
Adjust when animations trigger in `scroll-animations.js`:
```javascript
const options = {
  threshold: 0.1 // Change from 0 to 1
};
```

## 📱 Mobile Optimization

The animations are fully responsive and optimized for mobile devices:
- Simplified animations on smaller screens
- Touch-friendly interactions
- Reduced motion for better performance
- Adaptive layouts

## ♿ Accessibility

The implementation respects user preferences:
- Honors `prefers-reduced-motion` setting
- Maintains content readability during animations
- Keyboard navigation friendly
- Screen reader compatible

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📸 Demo

View the live demo at: `https://mbdb-theta.vercel.app/src/muscat-bay-demo.html`

## 🎯 Performance Tips

1. **Optimize Images**: Use appropriately sized images
2. **Lazy Loading**: Consider implementing lazy loading for images
3. **Minimize Animations**: Don't overuse animations
4. **Test Performance**: Use Chrome DevTools to monitor performance

## 🤝 Integration with Your App

To integrate these animations into your existing application:

1. Copy the animation styles you need from `muscat-bay-theme.css`
2. Import the `ScrollAnimations` class from `scroll-animations.js`
3. Initialize on page load:
```javascript
import ScrollAnimations from './src/js/scroll-animations.js';

document.addEventListener('DOMContentLoaded', () => {
  const animations = new ScrollAnimations();
  animations.initParallax();
  animations.initSectionReveals();
});
```

## 📝 License

This enhancement is provided as-is for the Muscat Bay Resort project.

---

**Created with ❤️ for Muscat Bay Resort - Where Desert Meets Ocean**
