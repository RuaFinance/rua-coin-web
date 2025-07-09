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

import {
  generateLocalizedPath,
  extractLocaleFromPath,
  hasValidLocalePrefix,
  removeLocaleFromPath
} from '../../router/languageRouter';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  BROWSER_LANGUAGE_PATTERNS
} from '../config/languageConfig';
import languageDetectionService, {
  DETECTION_SOURCES
} from '../services/languageDetectionService';

/**
 * 🔄 Advanced URL Redirect Middleware
 * 
 * This middleware provides comprehensive URL redirection logic for multi-language routing:
 * 
 * Core Features:
 * - Automatic language detection and redirection
 * - SEO-friendly URL normalization
 * - Geographic IP-based language suggestions
 * - Smart caching and performance optimization
 * - Analytics tracking for redirect patterns
 * - Fallback strategies for edge cases
 * 
 * Redirect Logic Flow:
 * 1. Check if URL has valid locale prefix
 * 2. If not, detect user's preferred language
 * 3. Generate appropriate redirect URL
 * 4. Track redirect for analytics
 * 5. Perform redirect with proper HTTP status codes
 * 
 * URL Patterns Handled:
 * ✅ /trading/BTCUSDT → /{detectedLanguage}/trading/BTCUSDT
 * ✅ /user/dashboard → /{detectedLanguage}/user/dashboard
 * ✅ /register → /{detectedLanguage}/register
 * ✅ /invalid-locale/path → /{detectedLanguage}/path
 * 
 * @module urlRedirectMiddleware
 */

/**
 * Redirect status codes
 */
export const REDIRECT_STATUS = {
  TEMPORARY: 302,
  PERMANENT: 301,
  SEE_OTHER: 303
};

/**
 * Redirect reason codes for analytics
 */
export const REDIRECT_REASONS = {
  NO_LOCALE: 'no_locale_prefix',
  INVALID_LOCALE: 'invalid_locale',
  DEPRECATED_LOCALE: 'deprecated_locale',
  GEO_SUGGESTION: 'geographic_suggestion',
  BROWSER_PREFERENCE: 'browser_preference',
  FALLBACK: 'fallback_redirect'
};

/**
 * Configuration for redirect behavior
 */
const REDIRECT_CONFIG = {
  enableGeographicDetection: true,
  enableBrowserDetection: true,
  enableCaching: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  maxRedirectHistory: 3, // Prevent redirect loops
  analyticsEnabled: true,
  performanceThreshold: 100 // ms
};

/**
 * Cache for storing redirect decisions
 */
class RedirectCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000;
  }

  get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < REDIRECT_CONFIG.cacheTimeout) {
      return cached.value;
    }
    this.cache.delete(key);
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const redirectCache = new RedirectCache();

/**
 * Analytics tracker for redirect events
 */
class RedirectAnalytics {
  constructor() {
    this.events = [];
    this.maxEvents = 100;
  }

  track(event) {
    if (!REDIRECT_CONFIG.analyticsEnabled) return;

    this.events.push({
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(event);
  }

  sendToAnalytics(event) {
    // Implementation for your analytics service
    // Examples: Google Analytics, Mixpanel, etc.
    console.debug('[URLRedirect] Analytics:', event);
    
    // Example GA4 tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'language_redirect', {
        redirect_reason: event.reason,
        from_locale: event.fromLocale || 'none',
        to_locale: event.toLocale,
        from_path: event.fromPath,
        to_path: event.toPath,
        detection_source: event.detectionSource
      });
    }
  }

  getStats() {
    const now = Date.now();
    const recent = this.events.filter(e => now - e.timestamp < 24 * 60 * 60 * 1000); // Last 24h

    return {
      totalRedirects: recent.length,
      reasonBreakdown: recent.reduce((acc, event) => {
        acc[event.reason] = (acc[event.reason] || 0) + 1;
        return acc;
      }, {}),
      languageBreakdown: recent.reduce((acc, event) => {
        acc[event.toLocale] = (acc[event.toLocale] || 0) + 1;
        return acc;
      }, {}),
      averageResponseTime: recent.reduce((sum, e) => sum + (e.responseTime || 0), 0) / recent.length
    };
  }
}

const redirectAnalytics = new RedirectAnalytics();

/**
 * Advanced URL redirect middleware
 */
class URLRedirectMiddleware {
  constructor() {
    this.redirectHistory = new Map();
  }

  /**
   * Check if redirect is needed
   * @param {string} pathname - Current URL pathname
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Redirect decision or null
   */
  async checkRedirectNeeded(pathname, options = {}) {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = `${pathname}_${JSON.stringify(options)}`;
      const cached = redirectCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const decision = await this._analyzeRedirect(pathname, options);
      
      // Cache the decision
      if (decision) {
        redirectCache.set(cacheKey, decision);
      }

      const responseTime = Date.now() - startTime;
      
      // Track performance
      if (responseTime > REDIRECT_CONFIG.performanceThreshold) {
        console.warn(`[URLRedirect] Slow redirect analysis: ${responseTime}ms for ${pathname}`);
      }

      return decision;
      
    } catch (error) {
      console.error('[URLRedirect] Error checking redirect:', error);
      return this._getErrorFallbackRedirect(pathname);
    }
  }

  /**
   * Analyze if redirect is needed and determine target
   * @private
   */
  async _analyzeRedirect(pathname, options) {
    const extractedLocale = extractLocaleFromPath(pathname);
    const hasValidPrefix = hasValidLocalePrefix(pathname);

    // Case 1: URL has valid locale prefix - no redirect needed
    if (hasValidPrefix && extractedLocale) {
      return null;
    }

    // Case 2: URL has invalid locale prefix
    if (extractedLocale && !SUPPORTED_LOCALES.includes(extractedLocale)) {
      const pathWithoutLocale = removeLocaleFromPath(pathname);
      const detectedLanguage = await this._detectBestLanguage(pathname, options);
      
      return {
        needed: true,
        reason: REDIRECT_REASONS.INVALID_LOCALE,
        fromPath: pathname,
        toPath: generateLocalizedPath(pathWithoutLocale, detectedLanguage),
        fromLocale: extractedLocale,
        toLocale: detectedLanguage,
        statusCode: REDIRECT_STATUS.PERMANENT,
        detectionSource: 'fallback'
      };
    }

    // Case 3: URL has no locale prefix - detect and redirect
    const detectionResult = await languageDetectionService.detectLanguage(pathname);
    const detectedLanguage = detectionResult.language;
    const newPath = generateLocalizedPath(pathname, detectedLanguage);

    return {
      needed: true,
      reason: REDIRECT_REASONS.NO_LOCALE,
      fromPath: pathname,
      toPath: newPath,
      fromLocale: null,
      toLocale: detectedLanguage,
      statusCode: REDIRECT_STATUS.SEE_OTHER,
      detectionSource: detectionResult.source
    };
  }

  /**
   * Detect best language for user
   * @private
   */
  async _detectBestLanguage(pathname, options) {
    try {
      // Use language detection service
      const result = await languageDetectionService.detectLanguage(pathname);
      return result.language;
    } catch (error) {
      console.warn('[URLRedirect] Language detection failed:', error);
      return DEFAULT_LANGUAGE;
    }
  }

  /**
   * Get error fallback redirect
   * @private
   */
  _getErrorFallbackRedirect(pathname) {
    const pathWithoutLocale = removeLocaleFromPath(pathname);
    
    return {
      needed: true,
      reason: REDIRECT_REASONS.FALLBACK,
      fromPath: pathname,
      toPath: generateLocalizedPath(pathWithoutLocale, DEFAULT_LANGUAGE),
      fromLocale: null,
      toLocale: DEFAULT_LANGUAGE,
      statusCode: REDIRECT_STATUS.SEE_OTHER,
      detectionSource: DETECTION_SOURCES.DEFAULT
    };
  }

  /**
   * Execute redirect with analytics tracking
   * @param {Object} redirectDecision - Decision from checkRedirectNeeded
   * @param {Function} navigate - Navigation function (React Router navigate)
   * @param {Object} options - Additional options
   */
  async executeRedirect(redirectDecision, navigate, options = {}) {
    if (!redirectDecision || !redirectDecision.needed) {
      return false;
    }

    const startTime = Date.now();

    try {
      // Check for redirect loops
      if (this._checkRedirectLoop(redirectDecision)) {
        console.warn('[URLRedirect] Redirect loop detected, aborting');
        return false;
      }

      // Track redirect history
      this._trackRedirectHistory(redirectDecision);

      // Perform the redirect
      const redirectOptions = {
        replace: true,
        state: {
          redirected: true,
          reason: redirectDecision.reason,
          originalPath: redirectDecision.fromPath
        },
        ...options
      };

      navigate(redirectDecision.toPath, redirectOptions);

      // Track analytics
      const responseTime = Date.now() - startTime;
      redirectAnalytics.track({
        ...redirectDecision,
        responseTime,
        success: true
      });

      return true;

    } catch (error) {
      console.error('[URLRedirect] Redirect execution failed:', error);
      
      // Track failed redirect
      redirectAnalytics.track({
        ...redirectDecision,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message
      });

      return false;
    }
  }

  /**
   * Check for redirect loops
   * @private
   */
  _checkRedirectLoop(redirectDecision) {
    const historyKey = `${redirectDecision.fromPath}_${redirectDecision.toPath}`;
    const history = this.redirectHistory.get(historyKey) || [];
    
    // Check if this redirect happened recently
    const recentRedirects = history.filter(time => 
      Date.now() - time < 10000 // 10 seconds
    );

    return recentRedirects.length >= REDIRECT_CONFIG.maxRedirectHistory;
  }

  /**
   * Track redirect history for loop detection
   * @private
   */
  _trackRedirectHistory(redirectDecision) {
    const historyKey = `${redirectDecision.fromPath}_${redirectDecision.toPath}`;
    const history = this.redirectHistory.get(historyKey) || [];
    
    history.push(Date.now());
    
    // Keep only recent redirects
    const filtered = history.filter(time => 
      Date.now() - time < 60000 // 1 minute
    );
    
    this.redirectHistory.set(historyKey, filtered);
  }

  /**
   * Get redirect statistics
   */
  getStatistics() {
    return {
      cache: {
        size: redirectCache.cache.size,
        maxSize: redirectCache.maxSize
      },
      analytics: redirectAnalytics.getStats(),
      redirectHistory: {
        activeLoops: this.redirectHistory.size,
        totalTracked: Array.from(this.redirectHistory.values())
          .reduce((sum, arr) => sum + arr.length, 0)
      }
    };
  }

  /**
   * Clear all caches and reset state
   */
  reset() {
    redirectCache.clear();
    this.redirectHistory.clear();
    redirectAnalytics.events = [];
  }
}

// Create singleton instance
const urlRedirectMiddleware = new URLRedirectMiddleware();

export default urlRedirectMiddleware;

/**
 * React Hook for URL redirect middleware
 */
export const useURLRedirect = () => {
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [redirectHistory, setRedirectHistory] = React.useState([]);

  const checkAndRedirect = React.useCallback(async (pathname, navigate, options = {}) => {
    setIsRedirecting(true);
    
    try {
      const decision = await urlRedirectMiddleware.checkRedirectNeeded(pathname, options);
      
      if (decision && decision.needed) {
        const success = await urlRedirectMiddleware.executeRedirect(decision, navigate, options);
        
        if (success) {
          setRedirectHistory(prev => [...prev.slice(-4), decision]); // Keep last 5
        }
        
        return success;
      }
      
      return false;
    } catch (error) {
      console.error('[useURLRedirect] Error:', error);
      return false;
    } finally {
      setIsRedirecting(false);
    }
  }, []);

  const getStatistics = React.useCallback(() => {
    return urlRedirectMiddleware.getStatistics();
  }, []);

  return {
    checkAndRedirect,
    isRedirecting,
    redirectHistory,
    getStatistics,
    reset: urlRedirectMiddleware.reset.bind(urlRedirectMiddleware)
  };
};

/**
 * Utility functions for external use
 */

/**
 * Quick check if URL needs redirect
 * @param {string} pathname - URL pathname to check
 * @returns {Promise<boolean>} True if redirect is needed
 */
export const shouldRedirect = async (pathname) => {
  const decision = await urlRedirectMiddleware.checkRedirectNeeded(pathname);
  return decision && decision.needed;
};

/**
 * Get redirect target for a given pathname
 * @param {string} pathname - Source pathname
 * @returns {Promise<string|null>} Target path or null
 */
export const getRedirectTarget = async (pathname) => {
  const decision = await urlRedirectMiddleware.checkRedirectNeeded(pathname);
  return decision && decision.needed ? decision.toPath : null;
};

/**
 * Normalize URL with proper locale prefix
 * @param {string} pathname - Source pathname
 * @param {string} preferredLocale - Preferred locale
 * @returns {string} Normalized pathname
 */
export const normalizeURL = (pathname, preferredLocale = DEFAULT_LANGUAGE) => {
  const hasValidPrefix = hasValidLocalePrefix(pathname);
  
  if (hasValidPrefix) {
    return pathname;
  }
  
  return generateLocalizedPath(pathname, preferredLocale);
};

export {
  urlRedirectMiddleware,
  redirectAnalytics,
  REDIRECT_CONFIG
}; 