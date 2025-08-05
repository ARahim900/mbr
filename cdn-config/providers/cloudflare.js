/**
 * Cloudflare CDN Provider Configuration
 * Handles Cloudflare-specific CDN setup, security, and optimization
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class CloudflareCDNProvider {
  constructor() {
    this.name = 'cloudflare';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID;
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.baseUrl = 'https://api.cloudflare.com/client/v4';
  }

  // Generate Cloudflare-specific configuration
  generateConfig({ headers, cacheRules, optimization, fallback }) {
    const cloudflareConfig = {
      // Page Rules for caching
      pageRules: [
        {
          targets: [{ target: 'url', constraint: { operator: 'matches', value: '*/assets/*' }}],
          actions: [
            { id: 'cache_level', value: 'cache_everything' },
            { id: 'edge_cache_ttl', value: 31536000 }, // 1 year
            { id: 'browser_cache_ttl', value: 31536000 }
          ],
          priority: 1,
          status: 'active'
        },
        {
          targets: [{ target: 'url', constraint: { operator: 'matches', value: '*.{js,css,woff,woff2,ttf,otf,eot}' }}],
          actions: [
            { id: 'cache_level', value: 'cache_everything' },
            { id: 'edge_cache_ttl', value: 31536000 },
            { id: 'browser_cache_ttl', value: 31536000 }
          ],
          priority: 2,
          status: 'active'
        },
        {
          targets: [{ target: 'url', constraint: { operator: 'matches', value: '*.{jpg,jpeg,png,gif,webp,svg,ico}' }}],
          actions: [
            { id: 'cache_level', value: 'cache_everything' },
            { id: 'edge_cache_ttl', value: 2592000 }, // 30 days
            { id: 'browser_cache_ttl', value: 2592000 }
          ],
          priority: 3,
          status: 'active'
        }
      ],

      // Security settings
      security: {
        ssl: {
          mode: 'strict',
          min_tls_version: '1.2'
        },
        
        waf: {
          enabled: true,
          rules: [
            {
              expression: 'not (cf.client.bot or cf.verified_bot_category in {"search_engine" "social_media"})',
              action: 'challenge',
              description: 'Challenge non-verified bots'
            }
          ]
        },
        
        ddos_protection: {
          enabled: true,
          sensitivity: 'medium'
        },
        
        rate_limiting: {
          rules: [
            {
              threshold: 1000,
              period: 60,
              action: 'challenge',
              match: {
                request: {
                  url: '*'
                }
              }
            }
          ]
        }
      },

      // Performance optimizations
      performance: {
        // Auto minify
        minify: {
          css: true,
          html: true,
          js: true
        },
        
        // Brotli compression
        brotli: true,
        
        // Polish (image optimization)
        polish: 'lossless',
        
        // Mirage (lazy loading)
        mirage: true,
        
        // Rocket Loader
        rocket_loader: false, // Disabled for React apps
        
        // HTTP/2 prioritization
        http2_prioritization: true,
        
        // 0-RTT Connection Resumption
        zero_rtt: true,
        
        // Cloudflare Cache Reserve
        cache_reserve: true
      },

      // Custom headers via Transform Rules
      transform_rules: [
        {
          description: 'Add security headers',
          expression: 'true',
          action: 'rewrite',
          action_parameters: {
            headers: {
              'X-Frame-Options': {
                operation: 'set',
                value: 'DENY'
              },
              'X-Content-Type-Options': {
                operation: 'set',
                value: 'nosniff'
              },
              'X-XSS-Protection': {
                operation: 'set',
                value: '1; mode=block'
              },
              'Referrer-Policy': {
                operation: 'set',
                value: 'strict-origin-when-cross-origin'
              },
              'Permissions-Policy': {
                operation: 'set',
                value: 'geolocation=(), microphone=(), camera=()'
              },
              'Strict-Transport-Security': {
                operation: 'set',
                value: 'max-age=31536000; includeSubDomains; preload'
              },
              'Content-Security-Policy': {
                operation: 'set',
                value: headers['Content-Security-Policy']
              },
              'X-Served-By': {
                operation: 'set',
                value: 'Cloudflare-CDN'
              }
            }
          }
        }
      ],

      // Worker scripts for advanced functionality
      workers: [
        {
          name: 'cdn-fallback-worker',
          content: this.generateFallbackWorker(fallback),
          routes: ['*example.com/*']
        }
      ],

      // DNS settings
      dns: {
        proxied: true,
        ttl: 1 // Auto
      }
    };

    return cloudflareConfig;
  }

  // Generate Cloudflare Worker for fallback handling
  generateFallbackWorker(fallbackConfig) {
    return `
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Health check endpoint
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: Date.now(),
      cdn: 'cloudflare'
    }), {
      headers: { 'content-type': 'application/json' }
    })
  }
  
  try {
    // Try to fetch from origin
    const response = await fetch(request, {
      timeout: ${fallbackConfig.strategies.timeout}
    })
    
    // Add CDN headers
    const newHeaders = new Headers(response.headers)
    newHeaders.set('X-Cache-Status', response.cf?.cacheStatus || 'UNKNOWN')
    newHeaders.set('X-Served-By', 'Cloudflare-CDN')
    newHeaders.set('X-Ray-ID', response.cf?.ray || 'unknown')
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })
    
  } catch (error) {
    // Fallback to secondary CDN or error page
    console.error('Origin fetch failed:', error)
    
    if (url.pathname.startsWith('/assets/')) {
      // Try secondary CDN for assets
      const secondaryUrl = url.toString().replace(url.hostname, 'your-secondary-cdn.com')
      try {
        return await fetch(secondaryUrl)
      } catch (secondaryError) {
        return new Response('Asset not found', { status: 404 })
      }
    }
    
    // Return maintenance page for other requests
    return new Response(\`
      <!DOCTYPE html>
      <html>
        <head><title>Service Temporarily Unavailable</title></head>
        <body>
          <h1>Service Temporarily Unavailable</h1>
          <p>We're working to restore service. Please try again shortly.</p>
        </body>
      </html>
    \`, {
      status: 503,
      headers: { 'content-type': 'text/html' }
    })
  }
}`;
  }

  // Validate Cloudflare configuration
  async validate() {
    const results = { valid: true, errors: [], warnings: [] };
    
    // Check required environment variables
    if (!this.apiToken) {
      results.errors.push('CLOUDFLARE_API_TOKEN is required');
      results.valid = false;
    }
    
    if (!this.zoneId) {
      results.errors.push('CLOUDFLARE_ZONE_ID is required');
      results.valid = false;
    }
    
    // Test API connectivity
    if (this.apiToken && this.zoneId) {
      try {
        await this.testApiConnection();
      } catch (error) {
        results.warnings.push(`API connection test failed: ${error.message}`);
      }
    }
    
    return results;
  }

  // Test Cloudflare API connection
  async testApiConnection() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.cloudflare.com',
        port: 443,
        path: `/client/v4/zones/${this.zoneId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          reject(new Error(`API test failed: HTTP ${res.statusCode}`));
        }
      });
      
      req.on('error', reject);
      req.end();
    });
  }

  // Deploy to Cloudflare
  async deploy(config) {
    try {
      const results = {
        success: true,
        results: []
      };
      
      // Deploy page rules
      if (config.pageRules) {
        for (const rule of config.pageRules) {
          const result = await this.createPageRule(rule);
          results.results.push({ type: 'page_rule', ...result });
        }
      }
      
      // Deploy security settings
      if (config.security) {
        const securityResult = await this.updateSecuritySettings(config.security);
        results.results.push({ type: 'security', ...securityResult });
      }
      
      // Deploy performance settings
      if (config.performance) {
        const perfResult = await this.updatePerformanceSettings(config.performance);
        results.results.push({ type: 'performance', ...perfResult });
      }
      
      // Deploy workers
      if (config.workers) {
        for (const worker of config.workers) {
          const result = await this.deployWorker(worker);
          results.results.push({ type: 'worker', ...result });
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('Cloudflare deployment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create Cloudflare page rule
  async createPageRule(rule) {
    return this.makeApiRequest('POST', `/zones/${this.zoneId}/pagerules`, rule);
  }

  // Update security settings
  async updateSecuritySettings(security) {
    const results = [];
    
    // SSL settings
    if (security.ssl) {
      const sslResult = await this.makeApiRequest('PATCH', `/zones/${this.zoneId}/settings/ssl`, {
        value: security.ssl.mode
      });
      results.push({ setting: 'ssl', ...sslResult });
    }
    
    // WAF settings
    if (security.waf) {
      const wafResult = await this.makeApiRequest('PUT', `/zones/${this.zoneId}/firewall/waf/packages`, {
        sensitivity: 'medium'
      });
      results.push({ setting: 'waf', ...wafResult });
    }
    
    return { success: true, results };
  }

  // Update performance settings
  async updatePerformanceSettings(performance) {
    const results = [];
    
    // Minification
    if (performance.minify) {
      const minifyResult = await this.makeApiRequest('PATCH', `/zones/${this.zoneId}/settings/minify`, {
        value: performance.minify
      });
      results.push({ setting: 'minify', ...minifyResult });
    }
    
    // Brotli
    if (performance.brotli) {
      const brotliResult = await this.makeApiRequest('PATCH', `/zones/${this.zoneId}/settings/brotli`, {
        value: 'on'
      });
      results.push({ setting: 'brotli', ...brotliResult });
    }
    
    return { success: true, results };
  }

  // Deploy Cloudflare Worker
  async deployWorker(worker) {
    // First, upload the worker script
    const scriptResult = await this.makeApiRequest('PUT', `/accounts/${this.accountId}/workers/scripts/${worker.name}`, 
      worker.content,
      { 'Content-Type': 'application/javascript' }
    );
    
    // Then create routes
    if (worker.routes && worker.routes.length > 0) {
      for (const route of worker.routes) {
        await this.makeApiRequest('POST', `/zones/${this.zoneId}/workers/routes`, {
          pattern: route,
          script: worker.name
        });
      }
    }
    
    return scriptResult;
  }

  // Make Cloudflare API request
  async makeApiRequest(method, path, data = null, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
      const postData = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null;
      
      const options = {
        hostname: 'api.cloudflare.com',
        port: 443,
        path: `/client/v4${path}`,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          ...extraHeaders
        }
      };
      
      if (postData) {
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            if (result.success) {
              resolve(result);
            } else {
              reject(new Error(`API error: ${result.errors?.map(e => e.message).join(', ') || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        });
      });
      
      req.on('error', reject);
      
      if (postData) {
        req.write(postData);
      }
      
      req.end();
    });
  }

  // Health check
  async healthCheck() {
    try {
      await this.testApiConnection();
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      throw new Error(`Cloudflare health check failed: ${error.message}`);
    }
  }

  // Monitor Cloudflare zone
  async monitor() {
    try {
      const zoneData = await this.makeApiRequest('GET', `/zones/${this.zoneId}`);
      const analytics = await this.makeApiRequest('GET', `/zones/${this.zoneId}/analytics/dashboard`);
      
      return {
        status: 'active',
        zone: zoneData.result.name,
        plan: zoneData.result.plan.name,
        analytics: analytics.result,
        lastCheck: Date.now()
      };
    } catch (error) {
      throw new Error(`Cloudflare monitoring failed: ${error.message}`);
    }
  }
}

module.exports = new CloudflareCDNProvider();