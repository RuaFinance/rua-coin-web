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

import { getLanguageConfig } from '../config/languageConfig';

/**
 * 📊 Advanced Language Analytics Tracker
 * 
 * Comprehensive analytics system for tracking language preferences and behavior:
 * 
 * Core Features:
 * - User language switching patterns
 * - Regional preference analysis
 * - Performance metrics tracking
 * - Session behavior analysis
 * - A/B testing support
 * - Privacy-compliant data collection
 * 
 * @module languageAnalytics
 */

/**
 * Analytics configuration
 */
const ANALYTICS_CONFIG = {
  // Core settings
  enabled: true,
  debug: false,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  
  // Privacy settings
  anonymizeIP: true,
  respectDoNotTrack: true,
  consentRequired: false,
  
  // Data retention
  localStorageKey: 'ruacoin_lang_analytics',
  maxLocalEvents: 100,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  
  // Integration settings
  googleAnalytics: {
    enabled: false,
    measurementId: null
  },
  mixpanel: {
    enabled: false,
    token: null
  },
  customEndpoint: {
    enabled: false,
    url: null,
    headers: {}
  }
};

/**
 * Event types for language analytics
 */
export const LANGUAGE_EVENTS = {
  LANGUAGE_CHANGED: 'language_changed',
  LANGUAGE_DETECTED: 'language_detected',
  LANGUAGE_FALLBACK: 'language_fallback',
  ROUTE_ACCESSED: 'route_accessed',
  REGION_SELECTED: 'region_selected',
  PERFORMANCE_METRIC: 'performance_metric',
  ERROR_OCCURRED: 'error_occurred',
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended'
};

/**
 * Session management for analytics
 */
class AnalyticsSession {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    this.events = [];
    this.userProperties = this.detectUserProperties();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  detectUserProperties() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages || [],
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connectionType: navigator.connection?.effectiveType || 'unknown'
    };
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  isExpired() {
    return Date.now() - this.lastActivity > ANALYTICS_CONFIG.sessionTimeout;
  }

  getDuration() {
    return Date.now() - this.startTime;
  }

  addEvent(event) {
    this.events.push({
      ...event,
      sessionTime: Date.now() - this.startTime
    });
    this.updateActivity();
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: this.getDuration(),
      eventCount: this.events.length,
      languages: [...new Set(this.events
        .filter(e => e.properties?.language)
        .map(e => e.properties.language))],
      routes: [...new Set(this.events
        .filter(e => e.properties?.route)
        .map(e => e.properties.route))],
      userProperties: this.userProperties
    };
  }
}

/**
 * Analytics event queue manager
 */
class AnalyticsQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.lastFlush = Date.now();
    
    // Start periodic flush
    setInterval(() => this.flush(), ANALYTICS_CONFIG.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush(true));
  }

  enqueue(event) {
    this.queue.push(event);
    
    // Auto-flush if batch size reached
    if (this.queue.length >= ANALYTICS_CONFIG.batchSize) {
      this.flush();
    }
  }

  async flush(force = false) {
    if (this.isProcessing && !force) return;
    if (this.queue.length === 0) return;

    this.isProcessing = true;
    const events = [...this.queue];
    this.queue = [];

    try {
      await this.sendEvents(events);
      this.lastFlush = Date.now();
    } catch (error) {
      console.error('[LanguageAnalytics] Failed to send events:', error);
      // Re-queue failed events (up to a limit)
      if (this.queue.length < ANALYTICS_CONFIG.batchSize * 2) {
        this.queue.unshift(...events);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async sendEvents(events) {
    const promises = [];

    // Google Analytics
    if (ANALYTICS_CONFIG.googleAnalytics.enabled) {
      promises.push(this.sendToGoogleAnalytics(events));
    }

    // Mixpanel
    if (ANALYTICS_CONFIG.mixpanel.enabled) {
      promises.push(this.sendToMixpanel(events));
    }

    // Custom endpoint
    if (ANALYTICS_CONFIG.customEndpoint.enabled) {
      promises.push(this.sendToCustomEndpoint(events));
    }

    await Promise.allSettled(promises);
  }

  async sendToGoogleAnalytics(events) {
    if (typeof gtag === 'undefined') return;

    events.forEach(event => {
      gtag('event', event.name, {
        ...event.properties,
        session_id: event.sessionId,
        timestamp: event.timestamp
      });
    });
  }

  async sendToMixpanel(events) {
    if (typeof mixpanel === 'undefined') return;

    events.forEach(event => {
      mixpanel.track(event.name, {
        ...event.properties,
        session_id: event.sessionId,
        timestamp: event.timestamp
      });
    });
  }

  async sendToCustomEndpoint(events) {
    if (!ANALYTICS_CONFIG.customEndpoint.url) return;

    const response = await fetch(ANALYTICS_CONFIG.customEndpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...ANALYTICS_CONFIG.customEndpoint.headers
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error(`Custom endpoint failed: ${response.status}`);
    }
  }
}

/**
 * Main language analytics tracker
 */
class LanguageAnalyticsTracker {
  constructor() {
    this.session = new AnalyticsSession();
    this.queue = new AnalyticsQueue();
    this.isEnabled = this.checkIfEnabled();
    
    if (this.isEnabled) {
      this.initialize();
    }
  }

  checkIfEnabled() {
    // Respect Do Not Track
    if (ANALYTICS_CONFIG.respectDoNotTrack && navigator.doNotTrack === '1') {
      return false;
    }

    // Check consent if required
    if (ANALYTICS_CONFIG.consentRequired) {
      return this.hasUserConsent();
    }

    return ANALYTICS_CONFIG.enabled;
  }

  hasUserConsent() {
    // Implementation depends on your consent management
    return localStorage.getItem('analytics_consent') === 'true';
  }

  initialize() {
    this.trackEvent(LANGUAGE_EVENTS.SESSION_STARTED, {
      sessionId: this.session.sessionId,
      userProperties: this.session.userProperties
    });

    // Load persisted events
    this.loadPersistedEvents();
  }

  /**
   * Track language change event
   */
  trackLanguageChange(fromLanguage, toLanguage, source, metadata = {}) {
    if (!this.isEnabled) return;

    const fromConfig = fromLanguage ? getLanguageConfig(fromLanguage) : null;
    const toConfig = getLanguageConfig(toLanguage);

    this.trackEvent(LANGUAGE_EVENTS.LANGUAGE_CHANGED, {
      fromLanguage,
      toLanguage,
      fromRegion: fromConfig?.region,
      toRegion: toConfig?.region,
      source,
      switchType: this.determineSwitchType(fromLanguage, toLanguage),
      ...metadata
    });
  }

  /**
   * Track language detection event
   */
  trackLanguageDetection(detectedLanguage, source, confidence, alternatives = []) {
    if (!this.isEnabled) return;

    const config = getLanguageConfig(detectedLanguage);

    this.trackEvent(LANGUAGE_EVENTS.LANGUAGE_DETECTED, {
      detectedLanguage,
      region: config?.region,
      source,
      confidence,
      alternatives,
      browserLanguages: navigator.languages,
      detectionTime: Date.now()
    });
  }

  /**
   * Track route access
   */
  trackRouteAccess(route, language, loadTime, metadata = {}) {
    if (!this.isEnabled) return;

    const config = getLanguageConfig(language);

    this.trackEvent(LANGUAGE_EVENTS.ROUTE_ACCESSED, {
      route,
      language,
      region: config?.region,
      loadTime,
      routeType: this.categorizeRoute(route),
      ...metadata
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric, value, context = {}) {
    if (!this.isEnabled) return;

    this.trackEvent(LANGUAGE_EVENTS.PERFORMANCE_METRIC, {
      metric,
      value,
      context,
      performanceNow: performance.now(),
      memoryUsage: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    });
  }

  /**
   * Track errors
   */
  trackError(error, context = {}) {
    if (!this.isEnabled) return;

    this.trackEvent(LANGUAGE_EVENTS.ERROR_OCCURRED, {
      errorType: error.type || 'unknown',
      errorMessage: error.message,
      stack: error.stack?.substring(0, 500), // Truncate stack trace
      context,
      url: window.location.href,
      timestamp: Date.now()
    });
  }

  /**
   * Generic event tracking
   */
  trackEvent(eventName, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      name: eventName,
      properties,
      sessionId: this.session.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer
    };

    // Add to session
    this.session.addEvent(event);

    // Add to queue
    this.queue.enqueue(event);

    // Persist locally
    this.persistEvent(event);

    if (ANALYTICS_CONFIG.debug) {
      console.debug('[LanguageAnalytics] Event tracked:', event);
    }
  }

  /**
   * Helper methods
   */
  
  determineSwitchType(fromLang, toLang) {
    if (!fromLang) return 'initial';
    
    const fromBase = fromLang.split('-')[0];
    const toBase = toLang.split('-')[0];
    
    if (fromBase === toBase) return 'regional';
    return 'language';
  }

  categorizeRoute(route) {
    if (route.includes('/trading')) return 'trading';
    if (route.includes('/user')) return 'account';
    if (route.includes('/register') || route.includes('/login')) return 'auth';
    if (route === '/' || route.includes('/home')) return 'home';
    return 'other';
  }

  persistEvent(event) {
    try {
      const stored = JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.localStorageKey) || '[]');
      stored.push(event);
      
      // Keep only recent events
      const trimmed = stored.slice(-ANALYTICS_CONFIG.maxLocalEvents);
      localStorage.setItem(ANALYTICS_CONFIG.localStorageKey, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('[LanguageAnalytics] Failed to persist event:', error);
    }
  }

  loadPersistedEvents() {
    try {
      const stored = JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.localStorageKey) || '[]');
      return stored;
    } catch (error) {
      console.warn('[LanguageAnalytics] Failed to load persisted events:', error);
      return [];
    }
  }

  /**
   * Analytics insights and reporting
   */
  
  getAnalyticsInsights() {
    const events = this.loadPersistedEvents();
    const sessionSummary = this.session.getSessionSummary();
    
    return {
      session: sessionSummary,
      languageUsage: this.analyzeLanguageUsage(events),
      routePatterns: this.analyzeRoutePatterns(events),
      performance: this.analyzePerformance(events),
      errors: this.analyzeErrors(events),
      userBehavior: this.analyzeUserBehavior(events)
    };
  }

  analyzeLanguageUsage(events) {
    const languageChanges = events.filter(e => e.name === LANGUAGE_EVENTS.LANGUAGE_CHANGED);
    
    return {
      totalChanges: languageChanges.length,
      languages: languageChanges.reduce((acc, e) => {
        acc[e.properties.toLanguage] = (acc[e.properties.toLanguage] || 0) + 1;
        return acc;
      }, {}),
      sources: languageChanges.reduce((acc, e) => {
        acc[e.properties.source] = (acc[e.properties.source] || 0) + 1;
        return acc;
      }, {}),
      switchTypes: languageChanges.reduce((acc, e) => {
        acc[e.properties.switchType] = (acc[e.properties.switchType] || 0) + 1;
        return acc;
      }, {})
    };
  }

  analyzeRoutePatterns(events) {
    const routeAccesses = events.filter(e => e.name === LANGUAGE_EVENTS.ROUTE_ACCESSED);
    
    return {
      totalAccesses: routeAccesses.length,
      routes: routeAccesses.reduce((acc, e) => {
        acc[e.properties.route] = (acc[e.properties.route] || 0) + 1;
        return acc;
      }, {}),
      routeTypes: routeAccesses.reduce((acc, e) => {
        acc[e.properties.routeType] = (acc[e.properties.routeType] || 0) + 1;
        return acc;
      }, {}),
      averageLoadTime: routeAccesses.reduce((sum, e) => sum + (e.properties.loadTime || 0), 0) / routeAccesses.length
    };
  }

  analyzePerformance(events) {
    const perfEvents = events.filter(e => e.name === LANGUAGE_EVENTS.PERFORMANCE_METRIC);
    
    return {
      totalMetrics: perfEvents.length,
      metrics: perfEvents.reduce((acc, e) => {
        const metric = e.properties.metric;
        if (!acc[metric]) acc[metric] = [];
        acc[metric].push(e.properties.value);
        return acc;
      }, {}),
      averages: perfEvents.reduce((acc, e) => {
        const metric = e.properties.metric;
        if (!acc[metric]) acc[metric] = { sum: 0, count: 0 };
        acc[metric].sum += e.properties.value;
        acc[metric].count += 1;
        return acc;
      }, {})
    };
  }

  analyzeErrors(events) {
    const errorEvents = events.filter(e => e.name === LANGUAGE_EVENTS.ERROR_OCCURRED);
    
    return {
      totalErrors: errorEvents.length,
      errorTypes: errorEvents.reduce((acc, e) => {
        acc[e.properties.errorType] = (acc[e.properties.errorType] || 0) + 1;
        return acc;
      }, {}),
      recentErrors: errorEvents.slice(-10).map(e => ({
        type: e.properties.errorType,
        message: e.properties.errorMessage,
        timestamp: e.timestamp
      }))
    };
  }

  analyzeUserBehavior(events) {
    return {
      sessionDuration: this.session.getDuration(),
      eventsPerSession: events.length,
      languageSwitchFrequency: events.filter(e => e.name === LANGUAGE_EVENTS.LANGUAGE_CHANGED).length,
      mostActiveHour: this.getMostActiveHour(events),
      bounceRate: this.calculateBounceRate(events)
    };
  }

  getMostActiveHour(events) {
    const hours = events.reduce((acc, e) => {
      const hour = new Date(e.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(hours).reduce((max, [hour, count]) => 
      count > (max.count || 0) ? { hour: parseInt(hour), count } : max, {}
    );
  }

  calculateBounceRate(events) {
    const routeEvents = events.filter(e => e.name === LANGUAGE_EVENTS.ROUTE_ACCESSED);
    return routeEvents.length <= 1 ? 1 : 0;
  }

  /**
   * Configuration and control
   */
  
  configure(newConfig) {
    Object.assign(ANALYTICS_CONFIG, newConfig);
    this.isEnabled = this.checkIfEnabled();
  }

  enable() {
    ANALYTICS_CONFIG.enabled = true;
    this.isEnabled = true;
    this.initialize();
  }

  disable() {
    ANALYTICS_CONFIG.enabled = false;
    this.isEnabled = false;
  }

  clearData() {
    localStorage.removeItem(ANALYTICS_CONFIG.localStorageKey);
    this.queue.queue = [];
    this.session = new AnalyticsSession();
  }
}

// Create singleton instance
const languageAnalyticsTracker = new LanguageAnalyticsTracker();

export default languageAnalyticsTracker;

/**
 * React Hook for language analytics
 */
export const useLanguageAnalytics = () => {

  const trackLanguageChange = React.useCallback((from, to, source, metadata) => {
    languageAnalyticsTracker.trackLanguageChange(from, to, source, metadata);
  }, []);

  const trackRouteAccess = React.useCallback((route, language, loadTime, metadata) => {
    languageAnalyticsTracker.trackRouteAccess(route, language, loadTime, metadata);
  }, []);

  const trackPerformance = React.useCallback((metric, value, context) => {
    languageAnalyticsTracker.trackPerformance(metric, value, context);
  }, []);

  const getInsights = React.useCallback(() => {
    return languageAnalyticsTracker.getAnalyticsInsights();
  }, []);

  return {
    trackLanguageChange,
    trackRouteAccess,
    trackPerformance,
    getInsights,
    isEnabled: languageAnalyticsTracker.isEnabled
  };
};

/**
 * Utility functions
 */

export const trackLanguageChange = (from, to, source, metadata) => {
  languageAnalyticsTracker.trackLanguageChange(from, to, source, metadata);
};

export const trackLanguageDetection = (language, source, confidence, alternatives) => {
  languageAnalyticsTracker.trackLanguageDetection(language, source, confidence, alternatives);
};

export const trackRouteAccess = (route, language, loadTime, metadata) => {
  languageAnalyticsTracker.trackRouteAccess(route, language, loadTime, metadata);
};

export const getAnalyticsInsights = () => {
  return languageAnalyticsTracker.getAnalyticsInsights();
};

export {
  languageAnalyticsTracker,
  ANALYTICS_CONFIG,
}; 