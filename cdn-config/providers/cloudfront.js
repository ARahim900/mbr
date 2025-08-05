/**
 * Amazon CloudFront CDN Provider Configuration
 * Handles CloudFront-specific CDN setup, security, and optimization
 */

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

class CloudFrontCDNProvider {
  constructor() {
    this.name = 'cloudfront';
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
    this.s3Bucket = process.env.S3_BUCKET_NAME;
  }

  // Generate CloudFront distribution configuration
  generateConfig({ headers, cacheRules, optimization, fallback }) {
    const cloudfrontConfig = {
      CallerReference: `mbr-cdn-${Date.now()}`,
      Comment: 'MBR Water Management CDN Distribution',
      Enabled: true,
      PriceClass: 'PriceClass_All',
      
      // Origins configuration
      Origins: {
        Quantity: 2,
        Items: [
          {
            Id: 'S3-Primary',
            DomainName: `${this.s3Bucket}.s3.${this.region}.amazonaws.com`,
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${process.env.OAI_ID || ''}`
            },
            CustomHeaders: {
              Quantity: 0,
              Items: []
            }
          },
          {
            Id: 'S3-Fallback', 
            DomainName: `${this.s3Bucket}-fallback.s3.${this.region}.amazonaws.com`,
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${process.env.OAI_FALLBACK_ID || ''}`
            }
          }
        ]
      },

      // Default cache behavior
      DefaultCacheBehavior: {
        TargetOriginId: 'S3-Primary',
        ViewerProtocolPolicy: 'redirect-to-https',
        MinTTL: 0,
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: 'none'
          },
          Headers: {
            Quantity: 4,
            Items: [
              'Access-Control-Request-Headers',
              'Access-Control-Request-Method', 
              'Origin',
              'Authorization'
            ]
          }
        },
        TrustedSigners: {
          Enabled: false,
          Quantity: 0
        },
        Compress: true,
        ResponseHeadersPolicy: {
          ResponseHeadersPolicyId: 'security-headers-policy'
        },
        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad', // Managed-CachingDisabled
        OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf' // Managed-CORS-S3Origin
      },

      // Additional cache behaviors for different asset types
      CacheBehaviors: {
        Quantity: 4,
        Items: [
          {
            PathPattern: '/assets/*',
            TargetOriginId: 'S3-Primary',
            ViewerProtocolPolicy: 'redirect-to-https',
            MinTTL: 31536000, // 1 year
            DefaultTTL: 31536000,
            MaxTTL: 31536000,
            ForwardedValues: {
              QueryString: false,
              Cookies: { Forward: 'none' }
            },
            Compress: true,
            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6' // Managed-CachingOptimized
          },
          {
            PathPattern: '*.{js,css}',
            TargetOriginId: 'S3-Primary',
            ViewerProtocolPolicy: 'redirect-to-https',
            MinTTL: 31536000,
            DefaultTTL: 31536000,
            MaxTTL: 31536000,
            ForwardedValues: {
              QueryString: false,
              Cookies: { Forward: 'none' }
            },
            Compress: true
          },
          {
            PathPattern: '*.{jpg,jpeg,png,gif,webp,svg,ico}',
            TargetOriginId: 'S3-Primary',
            ViewerProtocolPolicy: 'redirect-to-https',
            MinTTL: 2592000, // 30 days
            DefaultTTL: 2592000,
            MaxTTL: 2592000,
            ForwardedValues: {
              QueryString: false,
              Cookies: { Forward: 'none' }
            },
            Compress: true
          },
          {
            PathPattern: '/api/*',
            TargetOriginId: 'S3-Primary',
            ViewerProtocolPolicy: 'redirect-to-https',
            MinTTL: 0,
            DefaultTTL: 0,
            MaxTTL: 0,
            ForwardedValues: {
              QueryString: true,
              Cookies: { Forward: 'all' },
              Headers: { Quantity: 1, Items: ['*'] }
            },
            Compress: false
          }
        ]
      },

      // Custom error pages
      CustomErrorResponses: {
        Quantity: 3,
        Items: [
          {
            ErrorCode: 404,
            ResponsePagePath: '/index.html',
            ResponseCode: '200',
            ErrorCachingMinTTL: 300
          },
          {
            ErrorCode: 403,
            ResponsePagePath: '/index.html', 
            ResponseCode: '200',
            ErrorCachingMinTTL: 300
          },
          {
            ErrorCode: 500,
            ResponsePagePath: '/error.html',
            ResponseCode: '500',
            ErrorCachingMinTTL: 60
          }
        ]
      },

      // Geographic restrictions
      Restrictions: {
        GeoRestriction: {
          RestrictionType: 'none',
          Quantity: 0
        }
      },

      // SSL/TLS configuration
      ViewerCertificate: {
        CloudFrontDefaultCertificate: false,
        ACMCertificateArn: process.env.SSL_CERTIFICATE_ARN,
        SSLSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2021',
        CertificateSource: 'acm'
      },

      // Web ACL for security
      WebACLId: process.env.WEB_ACL_ID || '',

      // HTTP version
      HttpVersion: 'http2',

      // IPv6 support
      IsIPV6Enabled: true,

      // Aliases (custom domains)
      Aliases: {
        Quantity: process.env.CUSTOM_DOMAINS ? process.env.CUSTOM_DOMAINS.split(',').length : 0,
        Items: process.env.CUSTOM_DOMAINS ? process.env.CUSTOM_DOMAINS.split(',') : []
      }
    };

    return cloudfrontConfig;
  }

  // Generate Response Headers Policy
  generateResponseHeadersPolicy(headers) {
    return {
      ResponseHeadersPolicyConfig: {
        Name: 'MBR-Security-Headers-Policy',
        Comment: 'Security and performance headers for MBR application',
        
        SecurityHeadersConfig: {
          StrictTransportSecurity: {
            AccessControlMaxAgeSec: 31536000,
            IncludeSubdomains: true,
            Preload: true,
            Override: true
          },
          ContentTypeOptions: {
            Override: true
          },
          FrameOptions: {
            FrameOption: 'DENY',
            Override: true
          },
          ReferrerPolicy: {
            ReferrerPolicy: 'strict-origin-when-cross-origin',
            Override: true
          },
          ContentSecurityPolicy: {
            ContentSecurityPolicy: headers['Content-Security-Policy'],
            Override: true
          }
        },

        CustomHeadersConfig: {
          Quantity: 3,
          Items: [
            {
              Header: 'X-Served-By',
              Value: 'CloudFront-CDN',
              Override: true
            },
            {
              Header: 'X-Cache-Status',
              Value: 'HIT',
              Override: false
            },
            {
              Header: 'Permissions-Policy',
              Value: 'geolocation=(), microphone=(), camera=()',
              Override: true
            }
          ]
        },

        CorsConfig: {
          AccessControlAllowCredentials: false,
          AccessControlAllowHeaders: {
            Quantity: 4,
            Items: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
          },
          AccessControlAllowMethods: {
            Quantity: 5,
            Items: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          },
          AccessControlAllowOrigins: {
            Quantity: 1,
            Items: [process.env.ALLOWED_ORIGINS || '*']
          },
          AccessControlMaxAgeSec: 86400,
          OriginOverride: true
        }
      }
    };
  }

  // Generate Lambda@Edge function for advanced logic
  generateEdgeFunction(functionType) {
    const functions = {
      'viewer-request': `
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    
    // Add security headers
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload'
    }];
    
    // Handle SPA routing
    if (!request.uri.includes('.') && !request.uri.includes('/api/')) {
        request.uri = '/index.html';
    }
    
    callback(null, request);
};`,

      'origin-response': `
exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;
    
    // Add custom headers
    headers['x-served-by'] = [{ key: 'X-Served-By', value: 'CloudFront-CDN' }];
    headers['x-cache-status'] = [{ key: 'X-Cache-Status', value: 'HIT' }];
    
    // Handle 404s for SPA
    if (response.status === '404' && !event.Records[0].cf.request.uri.includes('/api/')) {
        response.status = '200';
        response.statusDescription = 'OK';
        response.body = ''; // Will be replaced by index.html
    }
    
    callback(null, response);
};`
    };

    return functions[functionType] || null;
  }

  // Validate CloudFront configuration
  async validate() {
    const results = { valid: true, errors: [], warnings: [] };
    
    // Check AWS credentials
    if (!this.accessKeyId || !this.secretAccessKey) {
      results.errors.push('AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are required');
      results.valid = false;
    }
    
    if (!this.s3Bucket) {
      results.warnings.push('S3_BUCKET_NAME not set - origin configuration may be incomplete');
    }
    
    if (!this.distributionId) {
      results.warnings.push('CLOUDFRONT_DISTRIBUTION_ID not set - updates will create new distribution');
    }
    
    // Test AWS connectivity
    if (this.accessKeyId && this.secretAccessKey) {
      try {
        await this.testAwsConnection();
      } catch (error) {
        results.warnings.push(`AWS connection test failed: ${error.message}`);
      }
    }
    
    return results;
  }

  // Test AWS connection
  async testAwsConnection() {
    // Simple test to list CloudFront distributions
    const params = {
      MaxItems: '1'
    };
    
    try {
      await this.makeAwsRequest('GET', '/2020-05-31/distribution', null, params);
      return true;
    } catch (error) {
      throw new Error(`AWS API test failed: ${error.message}`);
    }
  }

  // Deploy to CloudFront
  async deploy(config) {
    try {
      let result;
      
      if (this.distributionId) {
        // Update existing distribution
        result = await this.updateDistribution(config);
      } else {
        // Create new distribution
        result = await this.createDistribution(config);
      }
      
      // Create invalidation to clear cache
      if (result.success && result.distributionId) {
        const invalidationResult = await this.createInvalidation(result.distributionId);
        result.invalidation = invalidationResult;
      }
      
      return result;
      
    } catch (error) {
      console.error('CloudFront deployment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create CloudFront distribution
  async createDistribution(config) {
    const distributionConfig = this.generateConfig(config);
    
    const result = await this.makeAwsRequest('POST', '/2020-05-31/distribution', {
      DistributionConfig: distributionConfig
    });
    
    return {
      success: true,
      distributionId: result.Distribution.Id,
      domainName: result.Distribution.DomainName,
      status: result.Distribution.Status
    };
  }

  // Update existing CloudFront distribution
  async updateDistribution(config) {
    // First get current config
    const current = await this.makeAwsRequest('GET', `/2020-05-31/distribution/${this.distributionId}/config`);
    const etag = current.ETag;
    
    // Update with new configuration
    const distributionConfig = {
      ...current.DistributionConfig,
      ...this.generateConfig(config)
    };
    
    const result = await this.makeAwsRequest(
      'PUT', 
      `/2020-05-31/distribution/${this.distributionId}/config`,
      { DistributionConfig: distributionConfig },
      null,
      { 'If-Match': etag }
    );
    
    return {
      success: true,
      distributionId: this.distributionId,
      domainName: result.Distribution.DomainName,
      status: result.Distribution.Status
    };
  }

  // Create cache invalidation
  async createInvalidation(distributionId) {
    const invalidationConfig = {
      InvalidationBatch: {
        Paths: {
          Quantity: 1,
          Items: ['/*']
        },
        CallerReference: `invalidation-${Date.now()}`
      }
    };
    
    const result = await this.makeAwsRequest(
      'POST',
      `/2020-05-31/distribution/${distributionId}/invalidation`,
      invalidationConfig
    );
    
    return {
      invalidationId: result.Invalidation.Id,
      status: result.Invalidation.Status
    };
  }

  // Make AWS API request with proper signing
  async makeAwsRequest(method, path, data = null, queryParams = null, extraHeaders = {}) {
    const hostname = 'cloudfront.amazonaws.com';
    const region = 'us-east-1'; // CloudFront is always us-east-1
    const service = 'cloudfront';
    
    // Build query string
    let queryString = '';
    if (queryParams) {
      queryString = '?' + Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    }
    
    const url = `https://${hostname}${path}${queryString}`;
    const body = data ? JSON.stringify(data) : '';
    
    // AWS Signature Version 4
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeString = now.toISOString().slice(0, 19).replace(/[-:]/g, '');
    
    const headers = {
      'Host': hostname,
      'X-Amz-Date': timeString,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
    
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(body);
    }
    
    // Create signature
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map(key => `${key.toLowerCase()}:${headers[key]}\n`)
      .join('');
    
    const signedHeaders = Object.keys(headers)
      .map(key => key.toLowerCase())
      .sort()
      .join(';');
    
    const payloadHash = crypto.createHash('sha256').update(body).digest('hex');
    
    const canonicalRequest = [
      method,
      path,
      queryString.slice(1), // Remove leading '?' 
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');
    
    const credentialScope = `${dateString}/${region}/${service}/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timeString,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');
    
    // Calculate signature
    const kDate = crypto.createHmac('sha256', `AWS4${this.secretAccessKey}`).update(dateString).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
    
    headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    // Make request
    return new Promise((resolve, reject) => {
      const options = {
        hostname,
        port: 443,
        path: `${path}${queryString}`,
        method,
        headers
      };
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const result = responseData ? JSON.parse(responseData) : {};
              result.ETag = res.headers.etag; // Preserve ETag for updates
              resolve(result);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });
      
      req.on('error', reject);
      
      if (body) {
        req.write(body);
      }
      
      req.end();
    });
  }

  // Health check
  async healthCheck() {
    try {
      await this.testAwsConnection();
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      throw new Error(`CloudFront health check failed: ${error.message}`);
    }
  }

  // Monitor CloudFront distribution
  async monitor() {
    if (!this.distributionId) {
      throw new Error('Distribution ID required for monitoring');
    }
    
    try {
      const distribution = await this.makeAwsRequest('GET', `/2020-05-31/distribution/${this.distributionId}`);
      
      return {
        status: distribution.Distribution.Status,
        domainName: distribution.Distribution.DomainName,
        enabled: distribution.Distribution.DistributionConfig.Enabled,
        priceClass: distribution.Distribution.DistributionConfig.PriceClass,
        lastModified: distribution.Distribution.LastModifiedTime,
        inProgressInvalidationBatches: distribution.Distribution.InProgressInvalidationBatches
      };
    } catch (error) {
      throw new Error(`CloudFront monitoring failed: ${error.message}`);
    }
  }
}

module.exports = new CloudFrontCDNProvider();