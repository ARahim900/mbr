// CRITICAL NAVIGATION FIX - Auto-inject CSS to fix white/disappearing text
(function() {
  'use strict';

  // Function to inject critical CSS
  function injectNavigationFix() {
    const css = `
      /* CRITICAL NAVIGATION FIX - Force Override All Existing Styles */

      /* Force white text to never disappear - HIGHEST PRIORITY */
      *[class*="active"] span,
      *[class*="active"] .text,
      *[class*="active"] p,
      *[class*="active"] h1,
      *[class*="active"] h2,
      *[class*="active"] h3,
      *[class*="active"] h4,
      *[class*="active"] h5,
      *[class*="active"] h6,
      button.active *,
      .active * {
        color: white !important;
        opacity: 1 !important;
      }

      /* Force active tab background to be dark purple - NEVER WHITE */
      *[class*="active"],
      button.active,
      .active {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        background-color: #4E4456 !important;
        color: white !important;
        border: 1px solid rgba(78, 68, 86, 0.3) !important;
      }

      /* Prevent any white or light backgrounds on active tabs */
      button.active,
      .active,
      *[class*="bg-white"].active,
      *[class*="text-white"].active {
        background: #4E4456 !important;
        background-color: #4E4456 !important;
        color: white !important;
      }

      /* Navigation specific overrides */
      .navigation-tabs button.active,
      nav button.active,
      [role="tab"].active,
      [role="tabpanel"] button.active {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        color: white !important;
        box-shadow: 0 8px 16px rgba(78, 68, 86, 0.2) !important;
      }

      /* Force icons in active tabs to be teal */
      button.active svg,
      .active svg,
      button.active .icon,
      .active .icon {
        color: #00D2B3 !important;
        fill: #00D2B3 !important;
      }

      /* Water System Analysis specific fixes */
      .water-system-analysis button.active,
      .water-system-analysis .active {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        color: white !important;
      }

      /* Tailwind specific overrides */
      .bg-white.active {
        background: #4E4456 !important;
      }

      .text-white.active {
        color: white !important;
      }

      /* Force all tab content to be visible */
      .tab-content,
      .tab-text,
      .tab-label {
        color: inherit !important;
        opacity: 1 !important;
      }

      /* Override any glassmorphism that might be causing issues */
      .active.backdrop-blur-md {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
      }

      /* Ensure hover states don't break visibility */
      button.active:hover,
      .active:hover {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        color: white !important;
      }

      button.active:hover *,
      .active:hover * {
        color: white !important;
      }

      /* Mobile specific fixes */
      @media (max-width: 768px) {
        .active,
        button.active {
          background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
          color: white !important;
        }
        
        .active *,
        button.active * {
          color: white !important;
        }
      }

      /* Force visibility on any React component with active state */
      [data-state="active"],
      [aria-selected="true"],
      [aria-current="true"],
      .selected {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        color: white !important;
      }

      [data-state="active"] *,
      [aria-selected="true"] *,
      [aria-current="true"] *,
      .selected * {
        color: white !important;
      }

      /* Final catch-all to prevent any white text disappearing */
      .navigation-container .active,
      .nav-container .active,
      .tabs-container .active {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        color: white !important;
      }

      .navigation-container .active *,
      .nav-container .active *,
      .tabs-container .active * {
        color: white !important;
        opacity: 1 !important;
      }

      /* Additional protection against Tailwind overrides */
      .tw-bg-white.active,
      .tw-text-white.active,
      .tailwind-active {
        background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
        color: white !important;
      }
    `;

    // Create style element
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    
    // Add to head with highest priority
    document.head.appendChild(style);
    
    console.log('✅ Navigation contrast fix applied successfully!');
  }

  // Function to continuously monitor and fix navigation elements
  function monitorNavigation() {
    const observer = new MutationObserver(() => {
      // Find all active navigation elements and force correct styling
      const activeElements = document.querySelectorAll('.active, button.active, [data-state="active"], [aria-selected="true"]');
      
      activeElements.forEach(element => {
        // Force background and color
        element.style.setProperty('background', 'linear-gradient(135deg, #4E4456 0%, #5D4D67 100%)', 'important');
        element.style.setProperty('color', 'white', 'important');
        
        // Force all child elements to be white
        const children = element.querySelectorAll('*');
        children.forEach(child => {
          child.style.setProperty('color', 'white', 'important');
        });
        
        // Force SVG icons to be teal
        const icons = element.querySelectorAll('svg');
        icons.forEach(icon => {
          icon.style.setProperty('color', '#00D2B3', 'important');
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-state', 'aria-selected']
    });
  }

  // Apply fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectNavigationFix();
      setTimeout(monitorNavigation, 1000);
    });
  } else {
    injectNavigationFix();
    setTimeout(monitorNavigation, 1000);
  }

  // Also apply on window load as backup
  window.addEventListener('load', () => {
    setTimeout(() => {
      injectNavigationFix();
      monitorNavigation();
    }, 500);
  });

  // Export function for manual triggering if needed
  window.fixNavigationContrast = injectNavigationFix;

})();