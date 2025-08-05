/**
 * CDN Security Scanner
 * Comprehensive security testing and vulnerability assessment for CDN configurations
 */

const https = require('https');
const crypto = require('crypto');
const { URL } = require('url');

class CDNSecurityScanner {
  constructor(domain) {
    this.domain = domain;
    this.results = {
      domain,
      timestamp: new Date().toISOString(),
      score: 0,
      maxScore: 0,
      checks: [],
      vulnerabilities: [],
      recommendations: []
    };
  }

  // Run comprehensive security scan
  async runFullScan() {
    console.log(`Starting security scan for: ${this.domain}`);
    
    try {
      await Promise.all([
        this.checkSSL(),
        this.checkSecurityHeaders(),
        this.checkContentSecurityPolicy(),
        this.checkCacheHeaders(),
        this.checkCORSConfiguration(),
        this.checkRedirectSecurity(),
        this.checkInformationDisclosure(),
        this.checkDDOSProtection(),
        this.checkRateLimiting(),
        this.checkCompressionSecurity()
      ]);
      
      this.calculateOverallScore();
      this.generateRecommendations();
      
      return this.results;
      
    } catch (error) {
      console.error('Security scan failed:', error);
      this.results.error = error.message;
      return this.results;
    }
  }

  // Check SSL/TLS configuration
  async checkSSL() {
    const test = {
      name: 'SSL/TLS Configuration',
      category: 'encryption',
      passed: false,
      score: 0,
      maxScore: 25,
      details: {}
    };

    try {
      const sslInfo = await this.getSSLInfo();
      
      // Check TLS version
      if (sslInfo.protocol.includes('TLSv1.3')) {
        test.details.tlsVersion = 'TLSv1.3 ✓';
        test.score += 10;
      } else if (sslInfo.protocol.includes('TLSv1.2')) {
        test.details.tlsVersion = 'TLSv1.2 ✓';
        test.score += 8;
      } else {
        test.details.tlsVersion = `${sslInfo.protocol} ⚠️ (Upgrade recommended)`;
        this.addVulnerability('weak_tls', 'Using outdated TLS version', 'medium');
      }
      
      // Check certificate validity
      const now = new Date();
      const validFrom = new Date(sslInfo.valid_from);
      const validTo = new Date(sslInfo.valid_to);
      
      if (now >= validFrom && now <= validTo) {
        test.details.certificateValid = 'Valid ✓';
        test.score += 5;
      } else {
        test.details.certificateValid = 'Invalid/Expired ❌';
        this.addVulnerability('invalid_cert', 'SSL certificate is invalid or expired', 'high');
      }
      
      // Check certificate chain
      if (sslInfo.issuer) {
        test.details.issuer = sslInfo.issuer;
        test.score += 3;
      }
      
      // Check for weak ciphers
      if (sslInfo.cipher && !this.isWeakCipher(sslInfo.cipher.name)) {
        test.details.cipher = `${sslInfo.cipher.name} ✓`;
        test.score += 4;
      } else {
        test.details.cipher = `${sslInfo.cipher?.name || 'Unknown'} ⚠️`;
        this.addVulnerability('weak_cipher', 'Using weak cipher suite', 'medium');
      }
      
      // Check HSTS
      const headers = await this.getHeaders('/');
      if (headers['strict-transport-security']) {
        test.details.hsts = 'Enabled ✓';
        test.score += 3;
      } else {
        test.details.hsts = 'Not configured ❌';
        this.addVulnerability('missing_hsts', 'HSTS header not configured', 'medium');
      }
      
      test.passed = test.score > 15;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check security headers
  async checkSecurityHeaders() {
    const test = {
      name: 'Security Headers',
      category: 'headers',
      passed: false,
      score: 0,
      maxScore: 30,
      details: {}
    };

    try {
      const headers = await this.getHeaders('/');
      
      // Required security headers
      const requiredHeaders = {
        'x-frame-options': { score: 5, name: 'X-Frame-Options' },
        'x-content-type-options': { score: 4, name: 'X-Content-Type-Options' },
        'x-xss-protection': { score: 3, name: 'X-XSS-Protection' },
        'referrer-policy': { score: 4, name: 'Referrer-Policy' },
        'permissions-policy': { score: 3, name: 'Permissions-Policy' },
        'strict-transport-security': { score: 6, name: 'Strict-Transport-Security' },
        'content-security-policy': { score: 5, name: 'Content-Security-Policy' }
      };
      
      for (const [headerKey, config] of Object.entries(requiredHeaders)) {
        const headerValue = headers[headerKey.toLowerCase()];
        if (headerValue) {
          test.details[config.name] = `${headerValue} ✓`;
          test.score += config.score;
        } else {
          test.details[config.name] = 'Missing ❌';
          this.addVulnerability(
            `missing_${headerKey}`,
            `${config.name} header is missing`,
            'medium'
          );
        }
      }
      
      // Check for information disclosure headers
      const sensitiveHeaders = ['server', 'x-powered-by', 'x-aspnet-version'];
      for (const header of sensitiveHeaders) {
        if (headers[header]) {
          test.details[`info_disclosure_${header}`] = `${header}: ${headers[header]} ⚠️`;
          this.addVulnerability(
            `info_disclosure_${header}`,
            `${header} header reveals server information`,
            'low'
          );
        }
      }
      
      test.passed = test.score > 20;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check Content Security Policy
  async checkContentSecurityPolicy() {
    const test = {
      name: 'Content Security Policy',
      category: 'csp',
      passed: false,
      score: 0,
      maxScore: 20,
      details: {}
    };

    try {
      const headers = await this.getHeaders('/');
      const csp = headers['content-security-policy'];
      
      if (!csp) {
        test.details.status = 'Not configured ❌';
        this.addVulnerability('missing_csp', 'Content Security Policy not configured', 'high');
        this.results.checks.push(test);
        this.results.maxScore += test.maxScore;
        return;
      }
      
      test.details.policy = csp;
      test.score += 5; // Base score for having CSP
      
      // Parse CSP directives
      const directives = this.parseCSP(csp);
      
      // Check for unsafe directives
      const unsafeDirectives = ['unsafe-inline', 'unsafe-eval'];
      for (const [directive, sources] of Object.entries(directives)) {
        for (const source of sources) {
          if (unsafeDirectives.some(unsafe => source.includes(unsafe))) {
            test.details[`unsafe_${directive}`] = `Contains ${source} ⚠️`;
            this.addVulnerability(
              `unsafe_csp_${directive}`,
              `CSP ${directive} contains unsafe source: ${source}`,
              'medium'
            );
          }
        }
      }
      
      // Check for important directives
      const importantDirectives = {
        'default-src': 4,
        'script-src': 3,
        'style-src': 2,
        'img-src': 2,
        'frame-ancestors': 2,
        'base-uri': 2
      };
      
      for (const [directive, points] of Object.entries(importantDirectives)) {
        if (directives[directive]) {
          test.details[directive] = `Configured ✓`;
          test.score += points;
        } else {
          test.details[directive] = `Missing ❌`;
        }
      }
      
      test.passed = test.score > 12;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check cache headers for security
  async checkCacheHeaders() {
    const test = {
      name: 'Cache Security',
      category: 'caching',
      passed: false,
      score: 0,
      maxScore: 15,
      details: {}
    };

    try {
      // Check different types of resources
      const resources = [
        { path: '/', type: 'HTML' },
        { path: '/assets/app.js', type: 'Static Assets' },
        { path: '/api/data', type: 'API' }
      ];
      
      for (const resource of resources) {
        try {
          const headers = await this.getHeaders(resource.path);
          const cacheControl = headers['cache-control'];
          
          if (cacheControl) {
            test.details[`${resource.type}_cache`] = cacheControl;
            
            // Check for appropriate caching based on resource type
            if (resource.type === 'HTML' && cacheControl.includes('no-cache')) {
              test.score += 3;
            } else if (resource.type === 'Static Assets' && cacheControl.includes('max-age')) {
              test.score += 4;
            } else if (resource.type === 'API' && cacheControl.includes('no-store')) {
              test.score += 3;
            }
          } else {
            test.details[`${resource.type}_cache`] = 'No cache headers ⚠️';
          }
        } catch (err) {
          test.details[`${resource.type}_cache`] = `Error: ${err.message}`;
        }
      }
      
      test.passed = test.score > 8;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check CORS configuration
  async checkCORSConfiguration() {
    const test = {
      name: 'CORS Configuration',
      category: 'cors',
      passed: false,
      score: 0,
      maxScore: 10,
      details: {}
    };

    try {
      const headers = await this.getHeaders('/', 'OPTIONS');
      
      const corsHeaders = {
        'access-control-allow-origin': 'Allow Origin',
        'access-control-allow-methods': 'Allow Methods',
        'access-control-allow-headers': 'Allow Headers',
        'access-control-max-age': 'Max Age'
      };
      
      for (const [header, name] of Object.entries(corsHeaders)) {
        if (headers[header]) {
          test.details[name] = headers[header];
          test.score += 2;
          
          // Check for overly permissive CORS
          if (header === 'access-control-allow-origin' && headers[header] === '*') {
            test.details[`${name}_warning`] = 'Wildcard origin may be too permissive ⚠️';
            this.addVulnerability('permissive_cors', 'CORS allows all origins (*)', 'low');
          }
        } else {
          test.details[name] = 'Not configured';
        }
      }
      
      test.passed = test.score > 5;
      
    } catch (error) {
      test.details.note = 'CORS headers checked on standard request (OPTIONS may not be supported)';
      
      // Fallback to check CORS headers on normal request
      try {
        const fallbackHeaders = await this.getHeaders('/');
        if (fallbackHeaders['access-control-allow-origin']) {
          test.details['Allow Origin'] = fallbackHeaders['access-control-allow-origin'];
          test.score += 5;
          test.passed = true;
        }
      } catch (fallbackError) {
        test.details.error = error.message;
      }
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check for secure redirects
  async checkRedirectSecurity() {
    const test = {
      name: 'Redirect Security',
      category: 'redirects',
      passed: false,
      score: 0,
      maxScore: 10,
      details: {}
    };

    try {
      // Test HTTP to HTTPS redirect
      const httpResponse = await this.makeRequest(`http://${this.domain}/`, 'GET', false);
      
      if (httpResponse.statusCode >= 300 && httpResponse.statusCode < 400) {
        const location = httpResponse.headers.location;
        if (location && location.startsWith('https://')) {
          test.details.httpRedirect = 'HTTP redirects to HTTPS ✓';
          test.score += 5;
        } else {
          test.details.httpRedirect = 'HTTP does not redirect to HTTPS ❌';
          this.addVulnerability('no_https_redirect', 'HTTP traffic not redirected to HTTPS', 'medium');
        }
      } else {
        test.details.httpRedirect = 'HTTP not accessible (good) ✓';
        test.score += 5;
      }
      
      // Check for redirect loops
      try {
        await this.checkRedirectLoop();
        test.details.redirectLoop = 'No redirect loops detected ✓';
        test.score += 3;
      } catch (loopError) {
        test.details.redirectLoop = 'Redirect loop detected ❌';
        this.addVulnerability('redirect_loop', 'Redirect loop detected', 'high');
      }
      
      test.passed = test.score > 6;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check for information disclosure
  async checkInformationDisclosure() {
    const test = {
      name: 'Information Disclosure',
      category: 'disclosure',
      passed: true,
      score: 10,
      maxScore: 10,
      details: {}
    };

    try {
      const headers = await this.getHeaders('/');
      
      // Check for information disclosure in headers
      const sensitiveHeaders = {
        'server': 'Server software',
        'x-powered-by': 'Technology stack',
        'x-aspnet-version': 'ASP.NET version',
        'x-generator': 'Site generator',
        'x-drupal-cache': 'Drupal CMS'
      };
      
      for (const [header, description] of Object.entries(sensitiveHeaders)) {
        if (headers[header]) {
          test.details[header] = `${description}: ${headers[header]} ⚠️`;
          test.score -= 2;
          this.addVulnerability(
            `info_disclosure_${header}`,
            `Header reveals ${description.toLowerCase()}`,
            'low'
          );
        }
      }
      
      // Check for common sensitive files
      const sensitiveFiles = [
        '/.env',
        '/config.json',
        '/.git/config',
        '/package.json',
        '/.htaccess',
        '/web.config'
      ];
      
      for (const file of sensitiveFiles) {
        try {
          const response = await this.makeRequest(`https://${this.domain}${file}`);
          if (response.statusCode === 200) {
            test.details[`sensitive_file_${file}`] = `${file} accessible ❌`;
            test.score -= 3;
            this.addVulnerability(
              `sensitive_file_${file.replace(/[^a-zA-Z0-9]/g, '_')}`,
              `Sensitive file ${file} is publicly accessible`,
              'medium'
            );
          }
        } catch (err) {
          // File not accessible (good)
        }
      }
      
      test.passed = test.score > 5;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += Math.max(0, test.score);
  }

  // Check DDoS protection indicators
  async checkDDOSProtection() {
    const test = {
      name: 'DDoS Protection',
      category: 'ddos',
      passed: false,
      score: 0,
      maxScore: 15,
      details: {}
    };

    try {
      const headers = await this.getHeaders('/');
      
      // Check for CDN/DDoS protection headers
      const protectionHeaders = {
        'cf-ray': 'Cloudflare',
        'x-served-by': 'Fastly/Varnish',
        'x-cache': 'Generic CDN',
        'x-amz-cf-id': 'CloudFront',
        'server': 'CDN Server'
      };
      
      let protectionFound = false;
      for (const [header, provider] of Object.entries(protectionHeaders)) {
        if (headers[header]) {
          test.details[`protection_${header}`] = `${provider} detected ✓`;
          test.score += 5;
          protectionFound = true;
          break; // Only credit one protection service
        }
      }
      
      if (!protectionFound) {
        test.details.protection = 'No CDN/DDoS protection detected ⚠️';
        this.addVulnerability('no_ddos_protection', 'No apparent DDoS protection service detected', 'medium');
      }
      
      // Check rate limiting indicators
      try {
        const responses = await Promise.all([
          this.makeRequest(`https://${this.domain}/`),
          this.makeRequest(`https://${this.domain}/`),
          this.makeRequest(`https://${this.domain}/`)
        ]);
        
        const rateLimitHeaders = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'retry-after'];
        const hasRateLimit = responses.some(response => 
          rateLimitHeaders.some(header => response.headers[header])
        );
        
        if (hasRateLimit) {
          test.details.rateLimit = 'Rate limiting detected ✓';
          test.score += 5;
        } else {
          test.details.rateLimit = 'No rate limiting detected';
        }
      } catch (rateLimitError) {
        test.details.rateLimit = 'Could not test rate limiting';
      }
      
      test.passed = test.score > 8;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check rate limiting
  async checkRateLimiting() {
    const test = {
      name: 'Rate Limiting',
      category: 'rate_limiting',
      passed: false,
      score: 0,
      maxScore: 10,
      details: {}
    };

    try {
      // Make multiple rapid requests to test rate limiting
      const startTime = Date.now();
      const requests = [];
      
      for (let i = 0; i < 10; i++) {
        requests.push(this.makeRequest(`https://${this.domain}/`));
      }
      
      const responses = await Promise.allSettled(requests);
      const endTime = Date.now();
      
      // Check for rate limiting responses
      const rateLimitedResponses = responses.filter(result => 
        result.status === 'fulfilled' && 
        (result.value.statusCode === 429 || result.value.statusCode === 503)
      );
      
      if (rateLimitedResponses.length > 0) {
        test.details.rateLimitDetected = `${rateLimitedResponses.length} requests rate limited ✓`;
        test.score += 8;
        test.passed = true;
      } else {
        test.details.rateLimitDetected = 'No rate limiting detected in 10 rapid requests';
        
        // Check for rate limit headers even if not triggered
        const lastResponse = responses[responses.length - 1];
        if (lastResponse.status === 'fulfilled') {
          const headers = lastResponse.value.headers;
          const rateLimitHeaders = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset'];
          
          const hasRateLimitHeaders = rateLimitHeaders.some(header => headers[header]);
          if (hasRateLimitHeaders) {
            test.details.rateLimitHeaders = 'Rate limit headers present ✓';
            test.score += 5;
            test.passed = true;
          }
        }
      }
      
      test.details.requestDuration = `${endTime - startTime}ms for 10 requests`;
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Check compression security
  async checkCompressionSecurity() {
    const test = {
      name: 'Compression Security',
      category: 'compression',
      passed: false,
      score: 0,
      maxScore: 5,
      details: {}
    };

    try {
      const headers = await this.getHeaders('/', 'GET', {
        'Accept-Encoding': 'gzip, deflate, br'
      });
      
      const encoding = headers['content-encoding'];
      if (encoding) {
        test.details.compression = `${encoding} ✓`;
        test.score += 3;
        
        // Check for modern compression
        if (encoding.includes('br')) {
          test.details.brotli = 'Brotli compression enabled ✓';
          test.score += 2;
        }
        
        test.passed = true;
      } else {
        test.details.compression = 'No compression detected';
      }
      
    } catch (error) {
      test.details.error = error.message;
    }
    
    this.results.checks.push(test);
    this.results.maxScore += test.maxScore;
    this.results.score += test.score;
  }

  // Helper methods
  async getSSLInfo() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.domain,
        port: 443,
        path: '/',
        method: 'GET',
        timeout: 10000
      };
      
      const req = https.request(options, (res) => {
        const cert = res.connection.getPeerCertificate();
        const cipher = res.connection.getCipher();
        const protocol = res.connection.getProtocol();
        
        resolve({
          valid_from: cert.valid_from,
          valid_to: cert.valid_to,
          issuer: cert.issued_to?.CN || cert.subject?.CN,
          cipher: cipher,
          protocol: protocol
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => reject(new Error('SSL check timeout')));
      req.end();
    });
  }

  async getHeaders(path = '/', method = 'GET', extraHeaders = {}) {
    const response = await this.makeRequest(`https://${this.domain}${path}`, method, true, extraHeaders);
    return response.headers;
  }

  async makeRequest(url, method = 'GET', followRedirect = true, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        timeout: 10000,
        headers: {
          'User-Agent': 'CDN-Security-Scanner/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...extraHeaders
        }
      };
      
      const protocol = urlObj.protocol === 'https:' ? https : require('http');
      
      const req = protocol.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  async checkRedirectLoop(visited = new Set(), maxDepth = 10) {
    if (maxDepth <= 0) {
      throw new Error('Max redirect depth reached');
    }
    
    const url = `https://${this.domain}/`;
    if (visited.has(url)) {
      throw new Error('Redirect loop detected');
    }
    
    visited.add(url);
    
    const response = await this.makeRequest(url, 'GET', false);
    
    if (response.statusCode >= 300 && response.statusCode < 400) {
      const location = response.headers.location;
      if (location) {
        const nextUrl = new URL(location, url);
        return this.checkRedirectLoop(visited, maxDepth - 1);
      }
    }
    
    return true;
  }

  isWeakCipher(cipherName) {
    const weakCiphers = [
      'RC4', 'DES', '3DES', 'MD5', 'SHA1',
      'NULL', 'EXPORT', 'ANON'
    ];
    
    return weakCiphers.some(weak => 
      cipherName.toUpperCase().includes(weak.toUpperCase())
    );
  }

  parseCSP(csp) {
    const directives = {};
    const parts = csp.split(';');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      const [directive, ...sources] = trimmed.split(/\s+/);
      if (directive) {
        directives[directive.toLowerCase()] = sources;
      }
    }
    
    return directives;
  }

  addVulnerability(id, description, severity) {
    this.results.vulnerabilities.push({
      id,
      description,
      severity,
      timestamp: new Date().toISOString()
    });
  }

  calculateOverallScore() {
    this.results.scorePercentage = this.results.maxScore > 0 
      ? Math.round((this.results.score / this.results.maxScore) * 100)
      : 0;
    
    // Determine grade
    if (this.results.scorePercentage >= 90) {
      this.results.grade = 'A+';
    } else if (this.results.scorePercentage >= 80) {
      this.results.grade = 'A';
    } else if (this.results.scorePercentage >= 70) {
      this.results.grade = 'B';
    } else if (this.results.scorePercentage >= 60) {
      this.results.grade = 'C';
    } else if (this.results.scorePercentage >= 50) {
      this.results.grade = 'D';
    } else {
      this.results.grade = 'F';
    }
  }

  generateRecommendations() {
    const recommendations = [];
    
    // High priority vulnerabilities
    const highVulns = this.results.vulnerabilities.filter(v => v.severity === 'high');
    if (highVulns.length > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Critical Security Issues',
        description: 'Address high-severity vulnerabilities immediately',
        items: highVulns.map(v => v.description)
      });
    }
    
    // SSL/TLS recommendations
    const sslCheck = this.results.checks.find(c => c.name === 'SSL/TLS Configuration');
    if (sslCheck && sslCheck.score < 20) {
      recommendations.push({
        priority: 'high',
        title: 'SSL/TLS Improvements',
        description: 'Strengthen SSL/TLS configuration',
        items: [
          'Upgrade to TLS 1.3 if possible',
          'Configure HSTS header',
          'Use strong cipher suites',
          'Ensure certificate validity'
        ]
      });
    }
    
    // Security headers
    const headerCheck = this.results.checks.find(c => c.name === 'Security Headers');
    if (headerCheck && headerCheck.score < 25) {
      recommendations.push({
        priority: 'medium',
        title: 'Security Headers',
        description: 'Implement missing security headers',
        items: [
          'Add Content Security Policy',
          'Configure X-Frame-Options',
          'Set X-Content-Type-Options: nosniff',
          'Implement Referrer-Policy'
        ]
      });
    }
    
    // Performance and caching
    const cacheCheck = this.results.checks.find(c => c.name === 'Cache Security');
    if (cacheCheck && cacheCheck.score < 10) {
      recommendations.push({
        priority: 'medium',
        title: 'Caching Strategy',
        description: 'Optimize caching for security and performance',
        items: [
          'Configure appropriate cache headers for different resource types',
          'Ensure sensitive data is not cached',
          'Implement cache validation mechanisms'
        ]
      });
    }
    
    this.results.recommendations = recommendations;
  }

  // Generate detailed report
  generateReport() {
    const report = {
      summary: {
        domain: this.results.domain,
        scanDate: this.results.timestamp,
        overallScore: `${this.results.scorePercentage}% (${this.results.grade})`,
        vulnerabilitiesFound: this.results.vulnerabilities.length,
        checksPerformed: this.results.checks.length
      },
      
      scoreBreakdown: this.results.checks.map(check => ({
        category: check.name,
        score: `${check.score}/${check.maxScore}`,
        passed: check.passed,
        details: check.details
      })),
      
      vulnerabilities: this.results.vulnerabilities,
      recommendations: this.results.recommendations
    };
    
    return report;
  }
}

module.exports = CDNSecurityScanner;