// Muscat Bay Scroll Animations
// Advanced scroll-triggered animations using Intersection Observer

class ScrollAnimations {
  constructor() {
    this.initializeAnimations();
    this.setupIntersectionObserver();
    this.addCustomStyles();
  }

  // Initialize animation classes and data attributes
  initializeAnimations() {
    // Add animation attributes to elements
    const animationElements = [
      { selector: '.hero-section', animation: 'fade-up', delay: '0' },
      { selector: '.section-title', animation: 'fade-in-scale', delay: '100' },
      { selector: '.card', animation: 'slide-in-left', delay: '200', stagger: true },
      { selector: '.feature-box', animation: 'flip-in', delay: '150', stagger: true },
      { selector: '.image-gallery img', animation: 'zoom-in', delay: '100', stagger: true },
      { selector: '.testimonial', animation: 'slide-in-right', delay: '200', stagger: true },
      { selector: '.stats-counter', animation: 'counter-up', delay: '0' },
      { selector: '.timeline-item', animation: 'fade-in-timeline', delay: '150', stagger: true },
      { selector: '.btn', animation: 'pulse-in', delay: '300' },
      { selector: 'p', animation: 'fade-in-text', delay: '50', stagger: true }
    ];

    animationElements.forEach(({ selector, animation, delay, stagger }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        el.classList.add('scroll-animation');
        el.setAttribute('data-animation', animation);
        el.setAttribute('data-delay', stagger ? delay * (index + 1) : delay);
        el.style.opacity = '0';
      });
    });
  }

  // Setup Intersection Observer for triggering animations
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.getAttribute('data-animation');
          const delay = element.getAttribute('data-delay') || 0;

          setTimeout(() => {
            element.classList.add('animated', animation);
            element.style.opacity = '1';

            // Special handling for counter animations
            if (animation === 'counter-up') {
              this.animateCounter(element);
            }
          }, delay);

          observer.unobserve(element);
        }
      });
    }, options);

    // Observe all elements with scroll-animation class
    document.querySelectorAll('.scroll-animation').forEach(el => {
      observer.observe(el);
    });
  }

  // Animate number counters
  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.innerText);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.innerText = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.innerText = target;
      }
    };

    updateCounter();
  }

  // Add custom animation styles
  addCustomStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Base animation styles */
      .scroll-animation {
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Fade animations */
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes fadeInText {
        from {
          opacity: 0;
          transform: translateY(20px);
          filter: blur(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }

      /* Slide animations */
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Special effects */
      @keyframes flipIn {
        from {
          opacity: 0;
          transform: rotateY(90deg);
        }
        to {
          opacity: 1;
          transform: rotateY(0);
        }
      }

      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes pulseIn {
        0% {
          opacity: 0;
          transform: scale(0.9);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes fadeInTimeline {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Animation classes */
      .animated {
        animation-duration: 0.8s;
        animation-fill-mode: both;
      }

      .animated.fade-up {
        animation-name: fadeUp;
      }

      .animated.fade-in-scale {
        animation-name: fadeInScale;
      }

      .animated.fade-in-text {
        animation-name: fadeInText;
        animation-duration: 1.2s;
      }

      .animated.slide-in-left {
        animation-name: slideInLeft;
      }

      .animated.slide-in-right {
        animation-name: slideInRight;
      }

      .animated.flip-in {
        animation-name: flipIn;
        animation-duration: 1s;
      }

      .animated.zoom-in {
        animation-name: zoomIn;
      }

      .animated.pulse-in {
        animation-name: pulseIn;
      }

      .animated.fade-in-timeline {
        animation-name: fadeInTimeline;
      }

      /* Parallax scrolling effect */
      .parallax {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Smooth reveal for sections */
      .section-reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .section-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        @keyframes slideInLeft,
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }

      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize parallax scrolling
  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Add smooth section reveals
  initSectionReveals() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('section-reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      revealObserver.observe(section);
    });
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const scrollAnimations = new ScrollAnimations();
  scrollAnimations.initParallax();
  scrollAnimations.initSectionReveals();
});

// Export for module usage
export default ScrollAnimations;
