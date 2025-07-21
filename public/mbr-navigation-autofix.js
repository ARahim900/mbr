/**
 * MBR Navigation Auto-Fix Script
 * Automatically fixes white/disappearing text issues on navigation tabs
 * Uses Framework7 latest libraries for enhanced navigation experience
 */

// Load Framework7 libraries dynamically
function loadFramework7Libraries() {
    return new Promise((resolve, reject) => {
        console.log('🚀 Loading Framework7 libraries...');
        
        // Load Framework7 CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/framework7@8.3.3/css/framework7.bundle.min.css';
        document.head.appendChild(cssLink);
        
        // Load Framework7 Icons CSS
        const iconsLink = document.createElement('link');
        iconsLink.rel = 'stylesheet';
        iconsLink.href = 'https://cdn.jsdelivr.net/npm/framework7-icons@5.0.5/css/framework7-icons.css';
        document.head.appendChild(iconsLink);
        
        // Load our custom navigation CSS
        const customCssLink = document.createElement('link');
        customCssLink.rel = 'stylesheet';
        customCssLink.href = '/src/styles/framework7-navigation-fix.css';
        document.head.appendChild(customCssLink);
        
        // Load Framework7 JavaScript
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/framework7@8.3.3/js/framework7.bundle.min.js';
        script.onload = () => {
            console.log('✅ Framework7 libraries loaded successfully');
            resolve();
        };
        script.onerror = () => {
            console.error('❌ Failed to load Framework7 libraries');
            reject(new Error('Failed to load Framework7'));
        };
        document.head.appendChild(script);
    });
}

// Initialize Framework7 App
function initializeFramework7App() {
    if (window.Framework7) {
        console.log('🎯 Initializing Framework7 App...');
        
        window.mbrApp = new Framework7({
            el: '#app',
            theme: 'md',
            routes: [
                {
                    path: '/',
                    url: './index.html',
                },
            ],
            view: {
                pushState: true
            }
        });
        
        console.log('✅ Framework7 App initialized');
    }
}

// Navigation contrast fix function
function applyNavigationFixes() {
    console.log('🔧 Applying navigation contrast fixes...');
    
    // Find all navigation elements
    const selectors = [
        '.nav-item', '.nav-tab', '.tab-button',
        '[data-tab]', '.navigation-tab',
        '.f7-tab-link', '.f7-tab',
        '[class*="nav"]', '[class*="tab"]', '[class*="Tab"]',
        '[class*="Navigation"]', '.MuiTab-root',
        'button[role="tab"]', 'a[role="tab"]'
    ];
    
    const navElements = document.querySelectorAll(selectors.join(', '));
    let fixedCount = 0;
    
    navElements.forEach(function(element) {
        // Skip if already processed
        if (element.hasAttribute('data-mbr-fixed')) return;
        
        // Mark as processed
        element.setAttribute('data-mbr-fixed', 'true');
        
        // Remove problematic classes
        element.classList.remove('text-white', 'bg-white', 'text-transparent');
        
        // Check if element is active
        const isActive = element.classList.contains('active') || 
                        element.classList.contains('f7-tab-link-active') ||
                        element.getAttribute('aria-selected') === 'true' ||
                        element.hasAttribute('aria-current');
        
        if (isActive) {
            // Apply active styling
            element.style.cssText = `
                background: linear-gradient(135deg, #4E4456 0%, #5D4D67 100%) !important;
                color: #ffffff !important;
                border: 1px solid #00D2B3 !important;
                box-shadow: 0 8px 16px rgba(78, 68, 86, 0.3) !important;
                font-weight: 600 !important;
                border-radius: 10px !important;
                padding: 12px 20px !important;
                margin: 4px !important;
                transition: all 0.3s ease-in-out !important;
                transform: translateY(-2px) !important;
                text-decoration: none !important;
                position: relative !important;
            `;
            
            // Add active indicator if it doesn't exist
            if (!element.querySelector('.mbr-active-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'mbr-active-indicator';
                indicator.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 10px;
                    width: 8px;
                    height: 8px;
                    background: #00D2B3;
                    border-radius: 50%;
                    transform: translateY(-50%);
                `;
                element.appendChild(indicator);
            }
        } else {
            // Apply inactive styling
            element.style.cssText = `
                background: rgba(255, 255, 255, 0.1) !important;
                color: rgba(255, 255, 255, 0.7) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 10px !important;
                padding: 12px 20px !important;
                margin: 4px !important;
                transition: all 0.3s ease-in-out !important;
                text-decoration: none !important;
            `;
        }
        
        // Fix child elements
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            child.style.color = 'inherit';
        });
        
        fixedCount++;
    });
    
    console.log(`✅ Navigation contrast fix applied to ${fixedCount} elements`);
    return fixedCount;
}

// Monitor navigation changes
function setupNavigationMonitoring() {
    console.log('👁️ Setting up navigation monitoring...');
    
    // Monitor DOM changes
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain navigation elements
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const hasNav = node.matches && (
                            node.matches('.nav-item, .nav-tab, .tab-button, [data-tab], .navigation-tab, .f7-tab-link') ||
                            node.querySelector('.nav-item, .nav-tab, .tab-button, [data-tab], .navigation-tab, .f7-tab-link')
                        );
                        if (hasNav) {
                            shouldFix = true;
                        }
                    }
                });
            }
            
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'class' || mutation.attributeName === 'aria-selected')) {
                shouldFix = true;
            }
        });
        
        if (shouldFix) {
            setTimeout(applyNavigationFixes, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected']
    });
    
    // Monitor click events
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target && (
            target.matches('.nav-item, .nav-tab, .tab-button, [data-tab], .navigation-tab, .f7-tab-link') ||
            target.closest('.nav-item, .nav-tab, .tab-button, [data-tab], .navigation-tab, .f7-tab-link')
        )) {
            setTimeout(applyNavigationFixes, 150);
        }
    });
    
    // Monitor route changes (for SPAs)
    window.addEventListener('popstate', function() {
        setTimeout(applyNavigationFixes, 200);
    });
    
    // Override history methods to catch programmatic navigation
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(applyNavigationFixes, 300);
    };
    
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(applyNavigationFixes, 300);
    };
    
    console.log('✅ Navigation monitoring setup complete');
}

// Initialize the navigation fix system
async function initializeMBRNavigationFix() {
    console.log('🔥 Initializing MBR Navigation Fix System...');
    
    try {
        // Load Framework7 libraries
        await loadFramework7Libraries();
        
        // Wait a bit for libraries to be ready
        setTimeout(() => {
            // Initialize Framework7 app
            initializeFramework7App();
            
            // Apply initial fixes
            applyNavigationFixes();
            
            // Setup monitoring
            setupNavigationMonitoring();
            
            console.log('🎉 MBR Navigation Fix System initialized successfully!');
            
            // Notify that the fix is ready
            if (window.mbrNavigationFixReady) {
                window.mbrNavigationFixReady();
            }
            
        }, 500);
        
    } catch (error) {
        console.error('❌ Failed to initialize MBR Navigation Fix:', error);
        
        // Fallback: try to apply fixes without Framework7
        console.log('🔄 Attempting fallback navigation fix...');
        applyNavigationFixes();
        setupNavigationMonitoring();
    }
}

// Global functions for manual control
window.mbrFixNavigation = applyNavigationFixes;
window.mbrInitializeNavigation = initializeMBRNavigationFix;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMBRNavigationFix);
} else {
    initializeMBRNavigationFix();
}

// Also initialize on window load as backup
window.addEventListener('load', function() {
    setTimeout(initializeMBRNavigationFix, 1000);
});

// Periodic fix application (every 5 seconds) to catch any missed elements
setInterval(function() {
    const elementsNeedingFix = document.querySelectorAll(
        '.nav-item:not([data-mbr-fixed]), .nav-tab:not([data-mbr-fixed]), .tab-button:not([data-mbr-fixed])'
    );
    if (elementsNeedingFix.length > 0) {
        console.log(`🔄 Found ${elementsNeedingFix.length} unfixed navigation elements, applying fixes...`);
        applyNavigationFixes();
    }
}, 5000);

console.log('📝 MBR Navigation Auto-Fix Script loaded');
