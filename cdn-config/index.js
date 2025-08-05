/**
 * Comprehensive CDN Configuration System
 * Supports multiple CDN providers with security, performance, and fallback mechanisms
 */

const path = require('path');
const fs = require('fs');

// CDN Configuration Registry
const CDN_PROVIDERS = {
  cloudflare: require('./providers/cloudflare'),
  cloudfront: require('./providers/cloudfront'),
  fastly: require('./providers/fastly'),
  netlify: require('./providers/netlify'),
  vercel: require('./providers/vercel')
};

// Security Configuration
const SECURITY_CONFIG = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Vite dev
        "'unsafe-eval'", // Required for React dev tools
        'https://cdn.jsdelivr.net',
        'https://unpkg.com',
        'https://cdnjs.cloudflare.com'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for styled-components and CSS-in-JS
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net',
        'data:'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        '*.githubusercontent.com'
      ],
      'connect-src': [
        "'self'",
        'https://api.github.com',
        'wss:',
        'ws:'
      ],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }
  },
  
  headers: {
    security: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    },
    
    performance: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Vary': 'Accept-Encoding',
      'X-Served-By': 'CDN'
    },
    
    cors: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    }
  }
};

// Caching Strategies
const CACHE_STRATEGIES = {
  static: {
    pattern: '/assets/*',
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    }
  },
  
  html: {
    pattern: '/*.html',
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'ETag': true
    }
  },
  
  api: {
    pattern: '/api/*',
    headers: {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  
  fonts: {
    pattern: '*.{woff,woff2,ttf,otf,eot}',
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  images: {
    pattern: '*.{jpg,jpeg,png,gif,webp,svg,ico}',
    headers: {
      'Cache-Control': 'public, max-age=2592000', // 30 days
      'Vary': 'Accept'
    }
  }
};

// Asset Optimization Configuration
const OPTIMIZATION_CONFIG = {
  compression: {
    gzip: {
      enabled: true,
      level: 6,
      types: [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/javascript',
        'application/json',
        'application/xml',
        'text/xml'
      ]
    },
    
    brotli: {
      enabled: true,
      quality: 6,
      types: [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/javascript',
        'application/json'
      ]
    }
  },
  
  minification: {
    html: true,
    css: true,
    js: true,
    removeComments: true,
    collapseWhitespace: true
  },
  
  imageOptimization: {
    webp: {
      enabled: true,
      quality: 80
    },
    avif: {
      enabled: true,
      quality: 50
    }
  }
};

// Fallback Configuration
const FALLBACK_CONFIG = {
  primary: process.env.CDN_PRIMARY || 'cloudflare',
  secondary: process.env.CDN_SECONDARY || 'netlify',
  
  strategies: {
    timeout: 5000, // 5 seconds
    retries: 3,
    backoffMultiplier: 2,
    
    healthCheck: {
      interval: 300000, // 5 minutes
      endpoint: '/health',
      timeout: 3000
    }
  },
  
  localFallback: {
    enabled: true,
    path: './dist',
    routes: {
      '/assets/*': './dist/assets',
      '/*': './dist/index.html'
    }
  }
};

class CDNManager {
  constructor(provider = 'netlify') {
    this.provider = provider;
    this.config = CDN_PROVIDERS[provider];
    this.securityConfig = SECURITY_CONFIG;
    this.cacheStrategies = CACHE_STRATEGIES;
    this.optimizationConfig = OPTIMIZATION_CONFIG;
    this.fallbackConfig = FALLBACK_CONFIG;
    
    if (!this.config) {
      throw new Error(`Unsupported CDN provider: ${provider}`);
    }
  }
  
  // Generate CSP header string
  generateCSPHeader() {
    const { directives } = this.securityConfig.contentSecurityPolicy;
    return Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
  }
  
  // Generate complete header configuration
  generateHeaders() {
    const cspHeader = this.generateCSPHeader();
    
    return {
      ...this.securityConfig.headers.security,
      ...this.securityConfig.headers.cors,
      'Content-Security-Policy': cspHeader,
      'Content-Security-Policy-Report-Only': cspHeader // For testing
    };
  }
  
  // Generate cache rules
  generateCacheRules() {
    return Object.entries(this.cacheStrategies).map(([name, strategy]) => ({
      name,
      pattern: strategy.pattern,
      headers: strategy.headers
    }));
  }
  
  // Generate configuration for specific provider
  generateProviderConfig() {
    if (!this.config.generateConfig) {
      throw new Error(`Provider ${this.provider} does not support config generation`);
    }
    
    return this.config.generateConfig({
      headers: this.generateHeaders(),
      cacheRules: this.generateCacheRules(),
      optimization: this.optimizationConfig,
      fallback: this.fallbackConfig
    });
  }
  
  // Validate CDN configuration
  async validateConfiguration() {
    const results = {
      provider: this.provider,
      valid: true,
      errors: [],
      warnings: []
    };
    
    try {
      // Validate provider-specific configuration
      if (this.config.validate) {
        const providerValidation = await this.config.validate();
        if (!providerValidation.valid) {
          results.valid = false;
          results.errors.push(...providerValidation.errors);
        }
      }
      
      // Validate security headers
      const headers = this.generateHeaders();
      if (!headers['Content-Security-Policy']) {
        results.errors.push('Missing Content Security Policy');
        results.valid = false;
      }
      
      // Validate cache strategies
      const cacheRules = this.generateCacheRules();
      if (cacheRules.length === 0) {
        results.warnings.push('No cache rules defined');
      }
      
    } catch (error) {
      results.valid = false;
      results.errors.push(`Configuration validation failed: ${error.message}`);
    }
    
    return results;
  }
  
  // Deploy configuration to CDN
  async deploy(options = {}) {
    const { dryRun = false, force = false } = options;
    
    try {
      // Validate configuration first
      const validation = await this.validateConfiguration();
      if (!validation.valid && !force) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Generate provider-specific configuration
      const config = this.generateProviderConfig();
      
      if (dryRun) {
        console.log('Dry run - Configuration would be deployed:');
        console.log(JSON.stringify(config, null, 2));
        return { success: true, dryRun: true, config };
      }
      
      // Deploy using provider-specific method
      if (this.config.deploy) {
        const result = await this.config.deploy(config);
        return result;
      } else {
        throw new Error(`Provider ${this.provider} does not support automatic deployment`);
      }
      
    } catch (error) {
      console.error(`CDN deployment failed: ${error.message}`);
      throw error;
    }
  }
  
  // Monitor CDN performance
  async monitor() {
    if (!this.config.monitor) {
      throw new Error(`Provider ${this.provider} does not support monitoring`);
    }
    
    return await this.config.monitor();
  }
  
  // Test CDN fallback mechanisms
  async testFallback() {
    const results = {
      primary: { provider: this.provider, available: false, responseTime: null },
      secondary: { provider: this.fallbackConfig.secondary, available: false, responseTime: null },
      local: { available: false }
    };
    
    // Test primary CDN
    try {
      const start = Date.now();
      await this.config.healthCheck();
      results.primary.available = true;
      results.primary.responseTime = Date.now() - start;
    } catch (error) {
      console.warn(`Primary CDN (${this.provider}) health check failed:`, error.message);
    }
    
    // Test secondary CDN
    if (CDN_PROVIDERS[this.fallbackConfig.secondary]) {
      try {
        const start = Date.now();
        await CDN_PROVIDERS[this.fallbackConfig.secondary].healthCheck();
        results.secondary.available = true;
        results.secondary.responseTime = Date.now() - start;
      } catch (error) {
        console.warn(`Secondary CDN (${this.fallbackConfig.secondary}) health check failed:`, error.message);
      }
    }
    
    // Test local fallback
    if (this.fallbackConfig.localFallback.enabled) {
      const localPath = path.resolve(this.fallbackConfig.localFallback.path);
      results.local.available = fs.existsSync(localPath);
    }
    
    return results;
  }
}

module.exports = {
  CDNManager,
  CDN_PROVIDERS,
  SECURITY_CONFIG,
  CACHE_STRATEGIES,
  OPTIMIZATION_CONFIG,
  FALLBACK_CONFIG
};