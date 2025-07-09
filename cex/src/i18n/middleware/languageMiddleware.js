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

import React from 'react';

import {
  extractLocaleFromPath,
  hasValidLocalePrefix,
  removeLocaleFromPath,
  generateLocalizedPath
} from '../../router/languageRouter';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isLanguageSupported
} from '../config/languageConfig';
import { validateLanguageCode } from '../utils/advancedLanguageUtils';
import languagePersistenceManager from '../utils/languagePersistence';

import urlRedirectMiddleware from './urlRedirectMiddleware';

/**
 * 🛡️ Advanced Language Middleware
 * 
 * Provides comprehensive language middleware for route protection, validation, and management:
 * 
 * Core Features:
 * - Route-level language validation
 * - Automatic language enforcement
 * - Permission-based language access
 * - Fallback strategies for unsupported languages
 * - Analytics and performance monitoring
 * - Error handling and logging
 * 
 * Middleware Types:
 * 1. Route Protection - Validate language access
 * 2. Language Validation - Ensure valid language codes
 * 3. Auto-correction - Fix invalid language URLs
 * 4. Performance Monitoring - Track middleware performance
 * 
 * @module languageMiddleware
 */

/**
 * Middleware configuration
 */
const MIDDLEWARE_CONFIG = {
  // Route protection settings
  enableRouteProtection: true,
  protectedRoutes: ['/user', '/trading', '/admin'],
  publicRoutes: ['/', '/register', '/login', '/help'],
  
  // Language validation settings
  enableLanguageValidation: true,
  strictValidation: false,
  allowFallback: true,
  
  // Auto-correction settings
  enableAutoCorrection: true,
  correctionMode: 'redirect', // 'redirect' | 'replace' | 'none'
  
  // Performance settings
  enablePerformanceMonitoring: true,
  performanceThreshold: 50, // milliseconds
  
  // Error handling
  enableErrorLogging: true,
  errorMode: 'graceful', // 'graceful' | 'strict'
  
  // Analytics
  enableAnalytics: true
};

/**
 * Middleware error types
 */
export const MIDDLEWARE_ERRORS = {
  INVALID_LANGUAGE: 'invalid_language',
  UNSUPPORTED_LANGUAGE: 'unsupported_language',
  PROTECTED_ROUTE: 'protected_route_access',
  VALIDATION_FAILED: 'validation_failed',
  PERFORMANCE_THRESHOLD: 'performance_threshold_exceeded'
};

/**
 * Middleware result types
 */
export const MIDDLEWARE_RESULTS = {
  PASS: 'pass',
  REDIRECT: 'redirect',
  BLOCK: 'block',
  CORRECT: 'correct',
  ERROR: 'error'
};

/**
 * Performance monitor for middleware operations
 */
class MiddlewarePerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.maxMetrics = 100;
  }

  startTimer(operation) {
    return {
      operation,
      startTime: performance.now()
    };
  }

  endTimer(timer, result = {}) {
    const endTime = performance.now();
    const duration = endTime - timer.startTime;
    
    const metric = {
      operation: timer.operation,
      duration,
      timestamp: Date.now(),
      ...result
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (duration > MIDDLEWARE_CONFIG.performanceThreshold) {
      console.warn(`[LanguageMiddleware] Slow operation: ${timer.operation} took ${duration.toFixed(2)}ms`);
    }

    return metric;
  }

  getStats() {
    if (this.metrics.length === 0) return null;

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const avgDuration = totalDuration / this.metrics.length;
    const maxDuration = Math.max(...this.metrics.map(m => m.duration));
    const minDuration = Math.min(...this.metrics.map(m => m.duration));

    return {
      totalOperations: this.metrics.length,
      averageDuration: avgDuration.toFixed(2),
      maxDuration: maxDuration.toFixed(2),
      minDuration: minDuration.toFixed(2),
      slowOperations: this.metrics.filter(m => m.duration > MIDDLEWARE_CONFIG.performanceThreshold).length
    };
  }
}

const performanceMonitor = new MiddlewarePerformanceMonitor();

/**
 * Language middleware analytics
 */
class LanguageMiddlewareAnalytics {
  constructor() {
    this.events = [];
    this.maxEvents = 200;
  }

  track(event) {
    if (!MIDDLEWARE_CONFIG.enableAnalytics) return;

    this.events.push({
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Send to external analytics
    this.sendToAnalytics(event);
  }

  sendToAnalytics(event) {
    console.debug('[LanguageMiddleware] Analytics:', event);

    // Example GA4 tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'language_middleware', {
        middleware_type: event.type,
        middleware_result: event.result,
        language_code: event.language,
        route_path: event.path,
        error_type: event.error?.type
      });
    }
  }

  getAnalytics() {
    const recent = this.events.filter(e => 
      Date.now() - e.timestamp < 24 * 60 * 60 * 1000 // Last 24h
    );

    return {
      totalEvents: recent.length,
      resultBreakdown: recent.reduce((acc, event) => {
        acc[event.result] = (acc[event.result] || 0) + 1;
        return acc;
      }, {}),
      errorBreakdown: recent
        .filter(e => e.error)
        .reduce((acc, event) => {
          acc[event.error.type] = (acc[event.error.type] || 0) + 1;
          return acc;
        }, {}),
      languageBreakdown: recent.reduce((acc, event) => {
        if (event.language) {
          acc[event.language] = (acc[event.language] || 0) + 1;
        }
        return acc;
      }, {})
    };
  }
}

const middlewareAnalytics = new LanguageMiddlewareAnalytics();

/**
 * Core language middleware class
 */
class LanguageMiddleware {
  constructor() {
    this.routeProtectionCache = new Map();
    this.validationCache = new Map();
  }

  /**
   * Main middleware execution
   * @param {Object} context - Request context
   * @returns {Promise<Object>} Middleware result
   */
  async execute(context) {
    const timer = performanceMonitor.startTimer('middleware_execute');
    
    try {
      const {
        pathname,
        method = 'GET',
        userPermissions = [],
        skipProtection = false
      } = context;

      // Step 1: Language validation
      const validationResult = await this.validateLanguage(pathname);
      if (validationResult.result !== MIDDLEWARE_RESULTS.PASS) {
        const metric = performanceMonitor.endTimer(timer, { result: validationResult.result });
        middlewareAnalytics.track({
          type: 'validation',
          path: pathname,
          language: validationResult.language,
          result: validationResult.result,
          error: validationResult.error
        });
        return validationResult;
      }

      // Step 2: Route protection
      if (!skipProtection && MIDDLEWARE_CONFIG.enableRouteProtection) {
        const protectionResult = await this.checkRouteProtection(pathname, userPermissions);
        if (protectionResult.result !== MIDDLEWARE_RESULTS.PASS) {
          const metric = performanceMonitor.endTimer(timer, { result: protectionResult.result });
          middlewareAnalytics.track({
            type: 'protection',
            path: pathname,
            language: validationResult.language,
            result: protectionResult.result,
            error: protectionResult.error
          });
          return protectionResult;
        }
      }

      // Step 3: Auto-correction if needed
      if (MIDDLEWARE_CONFIG.enableAutoCorrection) {
        const correctionResult = await this.checkAutoCorrection(pathname);
        if (correctionResult.result !== MIDDLEWARE_RESULTS.PASS) {
          const metric = performanceMonitor.endTimer(timer, { result: correctionResult.result });
          middlewareAnalytics.track({
            type: 'correction',
            path: pathname,
            language: validationResult.language,
            result: correctionResult.result,
            correction: correctionResult.correction
          });
          return correctionResult;
        }
      }

      // All checks passed
      const metric = performanceMonitor.endTimer(timer, { result: MIDDLEWARE_RESULTS.PASS });
      middlewareAnalytics.track({
        type: 'success',
        path: pathname,
        language: validationResult.language,
        result: MIDDLEWARE_RESULTS.PASS
      });

      return {
        result: MIDDLEWARE_RESULTS.PASS,
        language: validationResult.language,
        config: validationResult.config,
        performance: metric
      };

    } catch (error) {
      const metric = performanceMonitor.endTimer(timer, { result: MIDDLEWARE_RESULTS.ERROR });
      console.error('[LanguageMiddleware] Execution error:', error);
      
      middlewareAnalytics.track({
        type: 'error',
        path: context.pathname,
        result: MIDDLEWARE_RESULTS.ERROR,
        error: {
          type: 'execution_error',
          message: error.message
        }
      });

      if (MIDDLEWARE_CONFIG.errorMode === 'strict') {
        throw error;
      }

      return {
        result: MIDDLEWARE_RESULTS.ERROR,
        error: {
          type: 'execution_error',
          message: error.message
        },
        performance: metric
      };
    }
  }

  /**
   * Validate language in URL
   * @private
   */
  async validateLanguage(pathname) {
    if (!MIDDLEWARE_CONFIG.enableLanguageValidation) {
      return { result: MIDDLEWARE_RESULTS.PASS };
    }

    const cacheKey = `validate_${pathname}`;
    const cached = this.validationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 60000) { // 1 minute cache
      return cached.result;
    }

    try {
      const extractedLocale = extractLocaleFromPath(pathname);
      
      if (!extractedLocale) {
        // No locale in path - this might be handled by redirect middleware
        const result = {
          result: MIDDLEWARE_RESULTS.PASS,
          language: null,
          warning: 'No locale prefix found'
        };
        
        this.validationCache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
        
        return result;
      }

      // Validate the extracted locale
      const validation = validateLanguageCode(extractedLocale, {
        allowFallback: MIDDLEWARE_CONFIG.allowFallback,
        strict: MIDDLEWARE_CONFIG.strictValidation
      });

      if (!validation.isValid) {
        const result = {
          result: MIDDLEWARE_RESULTS.BLOCK,
          language: extractedLocale,
          error: {
            type: MIDDLEWARE_ERRORS.INVALID_LANGUAGE,
            message: `Invalid language code: ${extractedLocale}`,
            issues: validation.issues
          }
        };
        
        this.validationCache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
        
        return result;
      }

      const targetLanguage = validation.fallback || validation.normalized;
      const config = getLanguageConfig(targetLanguage);

      const result = {
        result: MIDDLEWARE_RESULTS.PASS,
        language: targetLanguage,
        config,
        originalLanguage: extractedLocale,
        usedFallback: !!validation.fallback
      };

      this.validationCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error('[LanguageMiddleware] Language validation error:', error);
      
      const result = {
        result: MIDDLEWARE_RESULTS.ERROR,
        error: {
          type: MIDDLEWARE_ERRORS.VALIDATION_FAILED,
          message: error.message
        }
      };

      return result;
    }
  }

  /**
   * Check route protection
   * @private
   */
  async checkRouteProtection(pathname, userPermissions = []) {
    const cacheKey = `protect_${pathname}_${userPermissions.join(',')}`;
    const cached = this.routeProtectionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minute cache
      return cached.result;
    }

    try {
      const pathWithoutLocale = removeLocaleFromPath(pathname);
      
      // Check if route is explicitly public
      const isPublicRoute = MIDDLEWARE_CONFIG.publicRoutes.some(route => 
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
      );

      if (isPublicRoute) {
        const result = { result: MIDDLEWARE_RESULTS.PASS };
        this.routeProtectionCache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
        return result;
      }

      // Check if route is protected
      const isProtectedRoute = MIDDLEWARE_CONFIG.protectedRoutes.some(route =>
        pathWithoutLocale.startsWith(route)
      );

      if (isProtectedRoute) {
        // Check user permissions
        const hasAccess = await this.checkUserAccess(pathWithoutLocale, userPermissions);
        
        if (!hasAccess) {
          const result = {
            result: MIDDLEWARE_RESULTS.BLOCK,
            error: {
              type: MIDDLEWARE_ERRORS.PROTECTED_ROUTE,
              message: `Access denied to protected route: ${pathWithoutLocale}`,
              requiredPermissions: await this.getRequiredPermissions(pathWithoutLocale)
            }
          };
          
          this.routeProtectionCache.set(cacheKey, {
            result,
            timestamp: Date.now()
          });
          
          return result;
        }
      }

      const result = { result: MIDDLEWARE_RESULTS.PASS };
      this.routeProtectionCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });
      
      return result;

    } catch (error) {
      console.error('[LanguageMiddleware] Route protection error:', error);
      
      return {
        result: MIDDLEWARE_RESULTS.ERROR,
        error: {
          type: 'protection_error',
          message: error.message
        }
      };
    }
  }

  /**
   * Check if auto-correction is needed
   * @private
   */
  async checkAutoCorrection(pathname) {
    try {
      const redirectDecision = await urlRedirectMiddleware.checkRedirectNeeded(pathname);
      
      if (redirectDecision && redirectDecision.needed) {
        return {
          result: MIDDLEWARE_RESULTS.REDIRECT,
          correction: {
            from: redirectDecision.fromPath,
            to: redirectDecision.toPath,
            reason: redirectDecision.reason
          }
        };
      }

      return { result: MIDDLEWARE_RESULTS.PASS };

    } catch (error) {
      console.error('[LanguageMiddleware] Auto-correction error:', error);
      
      return {
        result: MIDDLEWARE_RESULTS.ERROR,
        error: {
          type: 'correction_error',
          message: error.message
        }
      };
    }
  }

  /**
   * Check user access to route
   * @private
   */
  async checkUserAccess(route, userPermissions) {
    // Simple permission check - extend based on your needs
    if (route.startsWith('/admin')) {
      return userPermissions.includes('admin');
    }
    
    if (route.startsWith('/user')) {
      return userPermissions.includes('user') || userPermissions.includes('admin');
    }
    
    if (route.startsWith('/trading')) {
      return userPermissions.includes('trading') || userPermissions.includes('user') || userPermissions.includes('admin');
    }

    return true; // Default allow
  }

  /**
   * Get required permissions for route
   * @private
   */
  async getRequiredPermissions(route) {
    if (route.startsWith('/admin')) {
      return ['admin'];
    }
    
    if (route.startsWith('/user')) {
      return ['user'];
    }
    
    if (route.startsWith('/trading')) {
      return ['trading'];
    }

    return [];
  }

  /**
   * Get middleware statistics
   */
  getStatistics() {
    return {
      performance: performanceMonitor.getStats(),
      analytics: middlewareAnalytics.getAnalytics(),
      cacheStats: {
        validationCacheSize: this.validationCache.size,
        protectionCacheSize: this.routeProtectionCache.size
      },
      configuration: MIDDLEWARE_CONFIG
    };
  }

  /**
   * Clear all caches
   */
  clearCaches() {
    this.validationCache.clear();
    this.routeProtectionCache.clear();
    console.debug('[LanguageMiddleware] Caches cleared');
  }
}

// Create singleton instance
const languageMiddleware = new LanguageMiddleware();

export default languageMiddleware;

/**
 * React Hook for language middleware
 */
export const useLanguageMiddleware = () => {
  const React = window.React;
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [lastResult, setLastResult] = React.useState(null);

  const executeMiddleware = React.useCallback(async (context) => {
    setIsProcessing(true);
    
    try {
      const result = await languageMiddleware.execute(context);
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('[useLanguageMiddleware] Error:', error);
      const errorResult = {
        result: MIDDLEWARE_RESULTS.ERROR,
        error: {
          type: 'hook_error',
          message: error.message
        }
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getStatistics = React.useCallback(() => {
    return languageMiddleware.getStatistics();
  }, []);

  return {
    executeMiddleware,
    isProcessing,
    lastResult,
    getStatistics,
    clearCaches: languageMiddleware.clearCaches.bind(languageMiddleware)
  };
};

/**
 * Utility functions for external use
 */

/**
 * Quick middleware check
 * @param {string} pathname - Path to check
 * @param {Object} options - Check options
 * @returns {Promise<boolean>} True if middleware allows access
 */
export const checkMiddlewareAccess = async (pathname, options = {}) => {
  const result = await languageMiddleware.execute({
    pathname,
    ...options
  });
  
  return result.result === MIDDLEWARE_RESULTS.PASS;
};

/**
 * Get middleware recommendation for path
 * @param {string} pathname - Path to analyze
 * @returns {Promise<Object>} Middleware recommendation
 */
export const getMiddlewareRecommendation = async (pathname) => {
  const result = await languageMiddleware.execute({
    pathname,
    skipProtection: true
  });
  
  return {
    allowed: result.result === MIDDLEWARE_RESULTS.PASS,
    language: result.language,
    suggestions: result.error ? [result.error.message] : [],
    performance: result.performance
  };
};

export {
  languageMiddleware,
  performanceMonitor,
  middlewareAnalytics,
  MIDDLEWARE_CONFIG,
}; 