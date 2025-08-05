/**
 * Fastly CDN Provider Configuration
 * Handles Fastly-specific CDN setup, security, and optimization
 */

const https = require('https');
const fs = require('fs');

class FastlyCDNProvider {
  constructor() {
    this.name = 'fastly';
    this.apiToken = process.env.FASTLY_API_TOKEN;
    this.serviceId = process.env.FASTLY_SERVICE_ID;
    this.baseUrl = 'https://api.fastly.com';
  }

  // Generate Fastly service configuration
  generateConfig({ headers, cacheRules, optimization, fallback }) {
    const fastlyConfig = {
      service: {
        name: 'MBR Water Management CDN',
        comment: 'Production CDN for MBR Water Management Application'
      },
      
      // Backends (origins)
      backends: [
        {
          name: 'primary_origin',
          address: process.env.ORIGIN_HOST || 'origin.example.com',
          port: 443,
          use_ssl: true,
          ssl_cert_hostname: process.env.ORIGIN_HOST || 'origin.example.com',
          ssl_sni_hostname: process.env.ORIGIN_HOST || 'origin.example.com',
          min_tls_version: '1.2',
          max_tls_version: '1.3',
          ssl_check_cert: true,
          connect_timeout: 5000,
          first_byte_timeout: 15000,
          between_bytes_timeout: 10000,
          auto_loadbalance: false,
          weight: 100,
          healthcheck: 'health_check_primary'
        },
        {
          name: 'fallback_origin',
          address: process.env.FALLBACK_HOST || 'fallback.example.com',
          port: 443,
          use_ssl: true,
          ssl_cert_hostname: process.env.FALLBACK_HOST || 'fallback.example.com',
          weight: 0, // Only used when primary fails
          healthcheck: 'health_check_fallback'
        }
      ],

      // Health checks
      healthchecks: [
        {
          name: 'health_check_primary',
          method: 'GET',
          path: '/health',
          host: process.env.ORIGIN_HOST || 'origin.example.com',
          http_version: '1.1',
          timeout: 5000,
          check_interval: 10000,
          expected_response: 200,
          window: 5,
          threshold: 3,
          initial: 2
        },
        {
          name: 'health_check_fallback',
          method: 'GET', 
          path: '/health',
          host: process.env.FALLBACK_HOST || 'fallback.example.com',
          http_version: '1.1',
          timeout: 5000,
          check_interval: 10000,
          expected_response: 200,
          window: 5,
          threshold: 3,
          initial: 2
        }
      ],

      // Domains
      domains: [
        {
          name: process.env.CUSTOM_DOMAIN || 'cdn.example.com',
          comment: 'Primary CDN domain'
        }
      ],

      // Headers for security and performance
      headers: [
        {
          name: 'Add Security Headers',
          action: 'set',
          type: 'response',
          dst: 'http.X-Frame-Options',
          src: '"DENY"',
          priority: 100
        },
        {
          name: 'Add Content Type Options',
          action: 'set',
          type: 'response',
          dst: 'http.X-Content-Type-Options',
          src: '"nosniff"',
          priority: 100
        },
        {
          name: 'Add XSS Protection',
          action: 'set',
          type: 'response',
          dst: 'http.X-XSS-Protection',
          src: '"1; mode=block"',
          priority: 100
        },
        {
          name: 'Add HSTS',
          action: 'set',
          type: 'response',
          dst: 'http.Strict-Transport-Security',
          src: '"max-age=31536000; includeSubDomains; preload"',
          priority: 100
        },
        {
          name: 'Add CSP',
          action: 'set',
          type: 'response',
          dst: 'http.Content-Security-Policy',
          src: `"${headers['Content-Security-Policy']}"`,
          priority: 100
        },
        {
          name: 'Add Referrer Policy',
          action: 'set',
          type: 'response',
          dst: 'http.Referrer-Policy',
          src: '"strict-origin-when-cross-origin"',
          priority: 100
        },
        {
          name: 'Add Permissions Policy',
          action: 'set',
          type: 'response',
          dst: 'http.Permissions-Policy',
          src: '"geolocation=(), microphone=(), camera=()"',
          priority: 100
        },
        {
          name: 'Add CDN Identifier',
          action: 'set',
          type: 'response',
          dst: 'http.X-Served-By',
          src: '"Fastly-CDN"',
          priority: 100
        },
        {
          name: 'Add Cache Status',
          action: 'set',
          type: 'response',
          dst: 'http.X-Cache-Status',
          src: 'if(fastly_info.state == "HIT", "HIT", "MISS")',
          priority: 100
        },
        {
          name: 'CORS Headers',
          action: 'set',
          type: 'response',
          dst: 'http.Access-Control-Allow-Origin',
          src: `"${headers['Access-Control-Allow-Origin'] || '*'}"`,
          priority: 100
        }
      ],

      // Request settings for different asset types
      request_settings: [
        {
          name: 'Force TLS',
          force_ssl: true,
          force_miss: false,
          bypass_busy_wait: false,
          max_stale_age: 300
        }
      ],

      // Cache settings
      cache_settings: [
        {
          name: 'Static Assets Cache',
          action: 'cache',
          cache_condition: 'static_assets',
          ttl: 31536000, // 1 year
          stale_ttl: 86400 // 1 day stale
        },
        {
          name: 'HTML Cache',
          action: 'pass', // Don't cache HTML files
          cache_condition: 'html_files'
        },
        {
          name: 'API No Cache',
          action: 'pass',
          cache_condition: 'api_requests'
        }
      ],

      // Conditions for cache rules
      conditions: [
        {
          name: 'static_assets',
          statement: 'req.url ~ "\\.(js|css|woff|woff2|ttf|otf|eot|jpg|jpeg|png|gif|webp|svg|ico)$"',
          type: 'REQUEST',
          priority: 10
        },
        {
          name: 'html_files',
          statement: 'req.url ~ "\\.html$" || req.url == "/"',
          type: 'REQUEST',
          priority: 10
        },
        {
          name: 'api_requests',
          statement: 'req.url ~ "^/api/"',
          type: 'REQUEST',
          priority: 10
        },
        {
          name: 'primary_healthy',
          statement: 'backend.primary_origin.healthy',
          type: 'REQUEST',
          priority: 10
        }
      ],

      // VCL snippets for advanced logic
      snippets: [
        {
          name: 'recv_logic',
          type: 'recv',
          content: `
# Redirect HTTP to HTTPS
if (!req.http.Fastly-SSL) {
  error 801 "Force SSL";
}

# Handle SPA routing
if (req.url !~ "\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|eot|json|xml|txt)$" && req.url !~ "^/api/") {
  set req.url = "/";
}

# Add custom headers for origin
set req.http.X-Forwarded-Proto = "https";
set req.http.X-Real-IP = client.ip;

# Normalize query parameters
set req.url = querystring.sort(req.url);
`,
          priority: 100
        },
        {
          name: 'deliver_logic',
          type: 'deliver',
          content: `
# Add performance headers
set resp.http.X-Cache-Hits = obj.hits;
set resp.http.X-Served-By = server.identity;

# Remove server headers for security
unset resp.http.Server;
unset resp.http.Via;
unset resp.http.X-Varnish;

# Set appropriate cache headers based on content type
if (resp.http.Content-Type ~ "text/html") {
  set resp.http.Cache-Control = "public, max-age=0, must-revalidate";
} else if (resp.http.Content-Type ~ "(javascript|css)") {
  set resp.http.Cache-Control = "public, max-age=31536000, immutable";
} else if (resp.http.Content-Type ~ "image/") {
  set resp.http.Cache-Control = "public, max-age=2592000";
}
`,
          priority: 100
        },
        {
          name: 'error_logic',
          type: 'error',
          content: `
# Custom error pages
if (obj.status == 801) {
  set obj.status = 301;
  set obj.response = "Moved Permanently";
  set obj.http.Location = "https://" + req.http.Host + req.url;
  synthetic {""};
  return(deliver);
}

# Fallback for 5xx errors
if (obj.status >= 500 && obj.status < 600) {
  if (req.restarts < 3 && backend.fallback_origin.healthy) {
    set req.backend = backend.fallback_origin;
    return(restart);
  }
  
  # Serve maintenance page
  set obj.status = 503;
  set obj.response = "Service Unavailable";
  synthetic {"
    <!DOCTYPE html>
    <html>
      <head><title>Service Temporarily Unavailable</title></head>
      <body>
        <h1>Service Temporarily Unavailable</h1>
        <p>We're working to restore service. Please try again shortly.</p>
      </body>
    </html>
  "};
  return(deliver);
}
`,
          priority: 100
        }
      ],

      // Gzip compression settings
      gzip: {
        name: 'Default Gzip',
        content_types: 'text/html text/css application/javascript application/json text/plain text/xml application/xml application/xml+rss text/javascript',
        extensions: 'css js html htm json xml'
      }
    };

    return fastlyConfig;
  }

  // Validate Fastly configuration
  async validate() {
    const results = { valid: true, errors: [], warnings: [] };
    
    if (!this.apiToken) {
      results.errors.push('FASTLY_API_TOKEN is required');
      results.valid = false;
    }
    
    if (!this.serviceId) {
      results.warnings.push('FASTLY_SERVICE_ID not set - will create new service');
    }
    
    // Test API connectivity
    if (this.apiToken) {
      try {
        await this.testApiConnection();
      } catch (error) {
        results.warnings.push(`API connection test failed: ${error.message}`);
      }
    }
    
    return results;
  }

  // Test Fastly API connection
  async testApiConnection() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.fastly.com',
        port: 443,
        path: '/tokens/self',
        method: 'GET',
        headers: {
          'Fastly-Token': this.apiToken,
          'Accept': 'application/json'
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

  // Deploy to Fastly
  async deploy(config) {
    try {
      const fastlyConfig = this.generateConfig(config);
      let serviceId = this.serviceId;
      
      // Create service if it doesn't exist
      if (!serviceId) {
        const service = await this.createService(fastlyConfig.service);
        serviceId = service.id;
        console.log(`Created new Fastly service: ${serviceId}`);
      }
      
      // Get latest version
      const versions = await this.makeApiRequest('GET', `/service/${serviceId}/version`);
      const latestVersion = Math.max(...versions.map(v => v.number));
      
      // Clone version for editing
      const newVersion = await this.makeApiRequest('PUT', `/service/${serviceId}/version/${latestVersion}/clone`);
      const versionNumber = newVersion.number;
      
      console.log(`Working with version ${versionNumber}`);
      
      // Deploy backends
      for (const backend of fastlyConfig.backends) {
        await this.createBackend(serviceId, versionNumber, backend);
      }
      
      // Deploy health checks
      for (const healthcheck of fastlyConfig.healthchecks) {
        await this.createHealthcheck(serviceId, versionNumber, healthcheck);
      }
      
      // Deploy domains
      for (const domain of fastlyConfig.domains) {
        await this.createDomain(serviceId, versionNumber, domain);
      }
      
      // Deploy headers
      for (const header of fastlyConfig.headers) {
        await this.createHeader(serviceId, versionNumber, header);
      }
      
      // Deploy cache settings
      for (const cacheSetting of fastlyConfig.cache_settings) {
        await this.createCacheSetting(serviceId, versionNumber, cacheSetting);
      }
      
      // Deploy conditions
      for (const condition of fastlyConfig.conditions) {
        await this.createCondition(serviceId, versionNumber, condition);
      }
      
      // Deploy VCL snippets
      for (const snippet of fastlyConfig.snippets) {
        await this.createSnippet(serviceId, versionNumber, snippet);
      }
      
      // Deploy gzip settings
      await this.createGzip(serviceId, versionNumber, fastlyConfig.gzip);
      
      // Activate the version
      const activatedVersion = await this.makeApiRequest('PUT', `/service/${serviceId}/version/${versionNumber}/activate`);
      
      return {
        success: true,
        serviceId: serviceId,
        version: activatedVersion.number,
        status: activatedVersion.active ? 'active' : 'inactive'
      };
      
    } catch (error) {
      console.error('Fastly deployment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create Fastly service
  async createService(serviceConfig) {
    return await this.makeApiRequest('POST', '/service', serviceConfig);
  }

  // Create backend
  async createBackend(serviceId, version, backend) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/backend`, backend);
  }

  // Create health check
  async createHealthcheck(serviceId, version, healthcheck) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/healthcheck`, healthcheck);
  }

  // Create domain
  async createDomain(serviceId, version, domain) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/domain`, domain);
  }

  // Create header
  async createHeader(serviceId, version, header) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/header`, header);
  }

  // Create cache setting
  async createCacheSetting(serviceId, version, cacheSetting) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/cache_settings`, cacheSetting);
  }

  // Create condition
  async createCondition(serviceId, version, condition) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/condition`, condition);
  }

  // Create VCL snippet
  async createSnippet(serviceId, version, snippet) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/snippet`, snippet);
  }

  // Create gzip configuration
  async createGzip(serviceId, version, gzip) {
    return await this.makeApiRequest('POST', `/service/${serviceId}/version/${version}/gzip`, gzip);
  }

  // Make Fastly API request
  async makeApiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const postData = data ? JSON.stringify(data) : null;
      
      const options = {
        hostname: 'api.fastly.com',
        port: 443,
        path: path,
        method: method,
        headers: {
          'Fastly-Token': this.apiToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const result = responseData ? JSON.parse(responseData) : {};
              resolve(result);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
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
      throw new Error(`Fastly health check failed: ${error.message}`);
    }
  }

  // Monitor Fastly service
  async monitor() {
    if (!this.serviceId) {
      throw new Error('Service ID required for monitoring');
    }
    
    try {
      const service = await this.makeApiRequest('GET', `/service/${this.serviceId}`);
      const stats = await this.makeApiRequest('GET', `/service/${this.serviceId}/stats`);
      
      return {
        status: 'active',
        serviceName: service.name,
        activeVersion: service.version,
        stats: stats.data || {},
        lastCheck: Date.now()
      };
    } catch (error) {
      throw new Error(`Fastly monitoring failed: ${error.message}`);
    }
  }
}

module.exports = new FastlyCDNProvider();