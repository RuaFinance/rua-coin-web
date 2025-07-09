// Copyright 2025 chenjjiaa
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import languageAnalyticsTracker from '../analytics/languageAnalytics';
import languageDetectionService from '../services/languageDetectionService';

import languageMiddleware, { 
  MIDDLEWARE_RESULTS,
  checkMiddlewareAccess 
} from './languageMiddleware';
import urlRedirectMiddleware, {
  shouldRedirect,
  getRedirectTarget
} from './urlRedirectMiddleware';


/**
 * 🔧 Middleware Integration Service
 * 
 * This service orchestrates all language middleware components to work together
 * with the AdvancedLanguageRouter and provides a unified interface for:
 * 
 * - Language validation and enforcement
 * - URL redirection logic
 * - Performance monitoring
 * - Analytics tracking
 * - Error handling and fallbacks
 * 
 * Integration Features:
 * - Middleware chain execution
 * - Result aggregation and decision making
 * - Performance optimization
 * - Error recovery mechanisms
 * - Analytics data collection
 * 
 * @module middlewareIntegration
 */

/**
 * Middleware execution pipeline
 */
class MiddlewarePipeline {
  constructor() {
    this.middlewares = [];
    this.analytics = languageAnalyticsTracker;
    this.performanceMetrics = {
      totalExecutions: 0,
      totalDuration: 0,
      errors: 0,
      cache: new Map()
    };
  }

  /**
   * Add middleware to the pipeline
   */
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Execute the middleware pipeline
   */
  async execute(context) {
    const startTime = performance.now();
    const results = [];
    
    try {
      this.performanceMetrics.totalExecutions++;

      // Create cache key for this execution
      const cacheKey = this.createCacheKey(context);
      
      // Check cache first
      if (this.performanceMetrics.cache.has(cacheKey)) {
        const cached = this.performanceMetrics.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
          return cached.result;
        }
      }

      // Execute middlewares in order
      for (const middleware of this.middlewares) {
        const result = await middleware.execute(context);
        results.push(result);
        
        // Break if middleware wants to block or redirect
        if (result.action === MIDDLEWARE_RESULTS.BLOCK || 
            result.action === MIDDLEWARE_RESULTS.REDIRECT) {
          break;
        }
      }

      const finalResult = this.aggregateResults(results, context);
      
      // Cache the result
      this.performanceMetrics.cache.set(cacheKey, {
        result: finalResult,
        timestamp: Date.now()
      });

      // Clean old cache entries
      this.cleanCache();

      return finalResult;
      
    } catch (error) {
      this.performanceMetrics.errors++;
      console.error('[MiddlewarePipeline] Execution error:', error);
      
      return {
        action: MIDDLEWARE_RESULTS.ERROR,
        error,
        fallback: true
      };
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.totalDuration += duration;
      
      // Track analytics
      this.analytics.trackPerformance('middleware_execution', duration, {
        pathname: context.pathname,
        results: results.length,
        errors: this.performanceMetrics.errors
      });
    }
  }

  createCacheKey(context) {
    return `${context.pathname}:${context.locale}:${context.userAgent || ''}`;
  }

  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.performanceMetrics.cache.entries()) {
      if (now - value.timestamp > 300000) { // 5 minutes
        this.performanceMetrics.cache.delete(key);
      }
    }
  }

  aggregateResults(results, context) {
    // Priority order: BLOCK > REDIRECT > CORRECT > PASS
    const prioritizedResult = results.find(r => r.action === MIDDLEWARE_RESULTS.BLOCK) ||
                             results.find(r => r.action === MIDDLEWARE_RESULTS.REDIRECT) ||
                             results.find(r => r.action === MIDDLEWARE_RESULTS.CORRECT) ||
                             results.find(r => r.action === MIDDLEWARE_RESULTS.PASS);

    return {
      ...prioritizedResult,
      metadata: {
        executedMiddlewares: results.length,
        totalDuration: this.performanceMetrics.totalDuration / this.performanceMetrics.totalExecutions,
        context
      }
    };
  }

  getStats() {
    return {
      totalExecutions: this.performanceMetrics.totalExecutions,
      averageDuration: this.performanceMetrics.totalDuration / this.performanceMetrics.totalExecutions,
      errorRate: this.performanceMetrics.errors / this.performanceMetrics.totalExecutions,
      cacheSize: this.performanceMetrics.cache.size
    };
  }
}

/**
 * Main middleware integration instance
 */
const middlewarePipeline = new MiddlewarePipeline();

// Register middleware components
middlewarePipeline
  .use(languageMiddleware)
  .use(urlRedirectMiddleware);

/**
 * Main integration function for AdvancedLanguageRouter
 */
export const executeLanguageMiddleware = async (pathname, options = {}) => {
  const context = {
    pathname,
    locale: options.locale,
    userAgent: navigator.userAgent,
    userPermissions: options.userPermissions || [],
    navigationOptions: options.navigationOptions || {},
    timestamp: Date.now()
  };

  const result = await middlewarePipeline.execute(context);
  
  return {
    shouldProceed: result.action === MIDDLEWARE_RESULTS.PASS,
    shouldRedirect: result.action === MIDDLEWARE_RESULTS.REDIRECT,
    shouldBlock: result.action === MIDDLEWARE_RESULTS.BLOCK,
    redirectTarget: result.redirectTarget,
    correctedPath: result.correctedPath,
    error: result.error,
    metadata: result.metadata
  };
};

/**
 * Quick validation function for route access
 */
export const validateRouteAccess = async (pathname, userPermissions = []) => {
  try {
    const result = await checkMiddlewareAccess(pathname, { userPermissions });
    return {
      allowed: result.action === MIDDLEWARE_RESULTS.PASS,
      reason: result.reason,
      suggestions: result.suggestions
    };
  } catch (error) {
    console.error('[MiddlewareIntegration] Route validation error:', error);
    return {
      allowed: true, // Graceful degradation
      reason: 'validation_error',
      error
    };
  }
};

/**
 * Check if URL needs redirection
 */
export const checkURLRedirection = async (pathname, options = {}) => {
  try {
    const needsRedirect = await shouldRedirect(pathname);
    if (needsRedirect) {
      const target = await getRedirectTarget(pathname);
      return {
        needsRedirect: true,
        target,
        reason: target.reason
      };
    }
    return { needsRedirect: false };
  } catch (error) {
    console.error('[MiddlewareIntegration] Redirect check error:', error);
    return { needsRedirect: false, error };
  }
};

/**
 * Initialize middleware system
 */
export const initializeMiddleware = async () => {
  try {
    // Initialize language detection service
    await languageDetectionService.initialize();
    
    // Warm up middleware caches
    await middlewarePipeline.execute({
      pathname: '/',
      locale: 'en',
      userAgent: navigator.userAgent,
      warmup: true
    });

    console.log('[MiddlewareIntegration] Middleware system initialized successfully');
    return true;
  } catch (error) {
    console.error('[MiddlewareIntegration] Initialization error:', error);
    return false;
  }
};

/**
 * Get comprehensive middleware statistics
 */
export const getMiddlewareStats = () => {
  return {
    pipeline: middlewarePipeline.getStats(),
    language: languageMiddleware.getStatistics(),
    redirect: urlRedirectMiddleware.getStatistics()
  };
};

/**
 * React hook for using middleware in components
 */
export const useMiddlewareIntegration = () => {
  return {
    executeMiddleware: executeLanguageMiddleware,
    validateRoute: validateRouteAccess,
    checkRedirect: checkURLRedirection,
    getStats: getMiddlewareStats
  };
};

export default {
  execute: executeLanguageMiddleware,
  validateRoute: validateRouteAccess,
  checkRedirect: checkURLRedirection,
  initialize: initializeMiddleware,
  getStats: getMiddlewareStats
}; 