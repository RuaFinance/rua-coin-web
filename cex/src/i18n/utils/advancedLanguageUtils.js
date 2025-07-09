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
  generateLocalizedPath,
  extractLocaleFromPath,
  hasValidLocalePrefix,
  removeLocaleFromPath
} from '../../router/languageRouter';
import {
  ADVANCED_LANGUAGE_CONFIG,
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isLanguageSupported,
  getFallbackLanguage,
  SEO_CONFIG,
  NUMBER_FORMATS,
  DATE_FORMATS
} from '../config/languageConfig';


/**
 * 🛠️ Advanced Language Utility Functions
 * 
 * Comprehensive utility library for multi-language applications providing:
 * 
 * Core Features:
 * - URL generation and manipulation
 * - Language validation and normalization  
 * - Locale management and formatting
 * - Browser language detection
 * - SEO optimization helpers
 * - Performance-optimized caching
 * 
 * @module advancedLanguageUtils
 */

/**
 * Cache for expensive operations
 */
const utilsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cached wrapper for expensive functions
 * @param {string} key - Cache key
 * @param {Function} fn - Function to cache
 * @param {number} ttl - Time to live in ms
 * @returns {*} Cached or fresh result
 */
export const withCache = (key, fn, ttl = CACHE_TTL) => {
  const cached = utilsCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.value;
  }
  
  const result = fn();
  utilsCache.set(key, {
    value: result,
    timestamp: Date.now()
  });
  
  return result;
};

/**
 * URL Generation and Manipulation
 */

/**
 * Generate language-aware URL with query parameters and fragments
 * @param {string} path - Base path
 * @param {string} locale - Target locale
 * @param {Object} options - Additional options
 * @returns {string} Generated URL
 */
export const generateAdvancedLocalizedPath = (path, locale = DEFAULT_LANGUAGE, options = {}) => {
  const {
    preserveQuery = true,
    preserveFragment = true,
    query = {},
    fragment = '',
    absolute = false,
    protocol = 'https',
    host = window.location.host
  } = options;

  // Normalize inputs
  const normalizedLocale = normalizeLanguageCode(locale);
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove existing locale from path
  const pathWithoutLocale = removeLocaleFromPath(cleanPath);
  
  // Generate base localized path
  let localizedPath = generateLocalizedPath(pathWithoutLocale, normalizedLocale);
  
  // Handle query parameters
  if (preserveQuery || Object.keys(query).length > 0) {
    const urlParams = new URLSearchParams();
    
    // Add existing query parameters if preserving
    if (preserveQuery) {
      const existingParams = new URLSearchParams(window.location.search);
      existingParams.forEach((value, key) => {
        urlParams.set(key, value);
      });
    }
    
    // Add new query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlParams.set(key, value);
      }
    });
    
    const queryString = urlParams.toString();
    if (queryString) {
      localizedPath += `?${queryString}`;
    }
  }
  
  // Handle fragment
  if (preserveFragment && window.location.hash) {
    localizedPath += window.location.hash;
  } else if (fragment) {
    localizedPath += fragment.startsWith('#') ? fragment : `#${fragment}`;
  }
  
  // Return absolute URL if requested
  if (absolute) {
    return `${protocol}://${host}${localizedPath}`;
  }
  
  return localizedPath;
};

/**
 * Generate all language variants of a URL
 * @param {string} path - Base path
 * @param {Object} options - Generation options
 * @returns {Object} Language variant URLs
 */
export const generateAllLanguageVariants = (path, options = {}) => {
  const cacheKey = `variants_${path}_${JSON.stringify(options)}`;
  
  return withCache(cacheKey, () => {
    const variants = {};
    const pathWithoutLocale = removeLocaleFromPath(path);
    
    SUPPORTED_LOCALES.forEach(locale => {
      const config = getLanguageConfig(locale);
      variants[locale] = {
        url: generateAdvancedLocalizedPath(pathWithoutLocale, locale, options),
        hreflang: config.htmlLang,
        name: config.name,
        nativeName: config.nativeName,
        isDefault: locale === DEFAULT_LANGUAGE
      };
    });
    
    return variants;
  });
};

/**
 * Language Validation and Normalization
 */

/**
 * Comprehensive language code validation
 * @param {string} languageCode - Code to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateLanguageCode = (languageCode, options = {}) => {
  const {
    allowFallback = true,
    strict = false,
    checkFormat = true
  } = options;

  const result = {
    isValid: false,
    normalized: null,
    fallback: null,
    issues: []
  };

  // Basic type check
  if (typeof languageCode !== 'string') {
    result.issues.push('Language code must be a string');
    return result;
  }

  // Normalize the code
  const normalized = normalizeLanguageCode(languageCode);
  result.normalized = normalized;

  // Check if directly supported
  if (SUPPORTED_LOCALES.includes(normalized)) {
    result.isValid = true;
    return result;
  }

  // Check format if enabled
  if (checkFormat) {
    const formatRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!formatRegex.test(normalized)) {
      result.issues.push('Invalid BCP 47 format');
      if (strict) return result;
    }
  }

  // Try to find fallback
  if (allowFallback) {
    const fallback = getFallbackLanguage(normalized);
    if (fallback) {
      result.fallback = fallback;
      result.isValid = true;
      result.issues.push(`Using fallback: ${fallback}`);
    } else {
      result.fallback = DEFAULT_LANGUAGE;
      result.issues.push(`Using default fallback: ${DEFAULT_LANGUAGE}`);
    }
  }

  return result;
};

/**
 * Normalize language code to standard format
 * @param {string} languageCode - Code to normalize
 * @returns {string} Normalized code
 */
export const normalizeLanguageCode = (languageCode) => {
  if (typeof languageCode !== 'string') return DEFAULT_LANGUAGE;
  
  const trimmed = languageCode.trim();
  if (!trimmed) return DEFAULT_LANGUAGE;
  
  // Handle common formats
  if (trimmed.includes('_')) {
    // Convert underscore to dash (zh_CN -> zh-CN)
    return trimmed.replace('_', '-').toLowerCase();
  }
  
  if (trimmed.includes('-')) {
    // Normalize case (zh-cn -> zh-CN)
    const parts = trimmed.split('-');
    return parts[0].toLowerCase() + (parts[1] ? `-${parts[1].toUpperCase()}` : '');
  }
  
  return trimmed.toLowerCase();
};

/**
 * Browser Language Detection
 */

/**
 * Advanced browser language detection with scoring
 * @param {Object} options - Detection options
 * @returns {Array} Scored language preferences
 */
export const detectBrowserLanguages = (options = {}) => {
  const {
    includeUnsupported = false,
    maxResults = 5,
    scoreThreshold = 0.1
  } = options;

  const cacheKey = `browser_langs_${JSON.stringify(options)}`;
  
  return withCache(cacheKey, () => {
    const detected = [];
    const browserLanguages = navigator.languages || [navigator.language];
    
    browserLanguages.forEach((lang, index) => {
      const normalized = normalizeLanguageCode(lang);
      const validation = validateLanguageCode(normalized, { allowFallback: true });
      
      // Calculate score based on position and support
      let score = 1 / (index + 1); // Higher score for earlier preferences
      
      if (validation.isValid) {
        if (SUPPORTED_LOCALES.includes(validation.normalized)) {
          score *= 1.0; // Perfect match
        } else if (validation.fallback) {
          score *= 0.7; // Fallback match
        }
        
        if (score >= scoreThreshold) {
          detected.push({
            original: lang,
            normalized: validation.normalized,
            fallback: validation.fallback,
            score,
            supported: SUPPORTED_LOCALES.includes(validation.normalized),
            config: getLanguageConfig(validation.fallback || validation.normalized)
          });
        }
      } else if (includeUnsupported) {
        detected.push({
          original: lang,
          normalized,
          score: score * 0.3,
          supported: false,
          issues: validation.issues
        });
      }
    });
    
    return detected
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  });
};

/**
 * Locale Management
 */

/**
 * Get comprehensive locale information
 * @param {string} locale - Target locale
 * @returns {Object} Locale information
 */
export const getLocaleInfo = (locale) => {
  const cacheKey = `locale_info_${locale}`;
  
  return withCache(cacheKey, () => {
    const config = getLanguageConfig(locale);
    if (!config) return null;
    
    return {
      ...config,
      isSupported: SUPPORTED_LOCALES.includes(locale),
      isDefault: locale === DEFAULT_LANGUAGE,
      numberFormat: NUMBER_FORMATS[locale] || NUMBER_FORMATS[DEFAULT_LANGUAGE],
      dateFormat: DATE_FORMATS[locale] || DATE_FORMATS[DEFAULT_LANGUAGE],
      variants: getLanguageVariants(locale),
      seoInfo: getSEOInfo(locale)
    };
  });
};

/**
 * Get language variants (e.g., zh-CN has zh-TC variant)
 * @param {string} locale - Base locale
 * @returns {Array} Related variants
 */
export const getLanguageVariants = (locale) => {
  const baseLanguage = locale.split('-')[0];
  return SUPPORTED_LOCALES
    .filter(l => l.startsWith(baseLanguage) && l !== locale)
    .map(variant => ({
      locale: variant,
      config: getLanguageConfig(variant),
      relationship: 'variant'
    }));
};

/**
 * Get SEO information for locale
 * @param {string} locale - Target locale
 * @returns {Object} SEO information
 */
export const getSEOInfo = (locale) => {
  const config = getLanguageConfig(locale);
  if (!config) return null;
  
  return {
    hreflang: config.htmlLang,
    htmlLang: config.htmlLang,
    dir: config.dir,
    isRTL: config.dir === 'rtl',
    seoCode: config.seoCode,
    region: config.region,
    currency: config.currency
  };
};

/**
 * Formatting Utilities
 */

/**
 * Format number according to locale
 * @param {number} number - Number to format
 * @param {string} locale - Target locale
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number
 */
export const formatNumber = (number, locale = DEFAULT_LANGUAGE, options = {}) => {
  try {
    const localeInfo = getLocaleInfo(locale);
    const formatOptions = {
      ...localeInfo?.numberFormat,
      ...options
    };
    
    return new Intl.NumberFormat(localeInfo?.htmlLang || locale, formatOptions).format(number);
  } catch (error) {
    console.warn(`[AdvancedLanguageUtils] Number formatting failed for ${locale}:`, error);
    return number.toString();
  }
};

/**
 * Format currency according to locale
 * @param {number} amount - Amount to format
 * @param {string} locale - Target locale
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, locale = DEFAULT_LANGUAGE, currency = null) => {
  try {
    const localeInfo = getLocaleInfo(locale);
    const currencyCode = currency || localeInfo?.currency || 'USD';
    
    return new Intl.NumberFormat(localeInfo?.htmlLang || locale, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  } catch (error) {
    console.warn(`[AdvancedLanguageUtils] Currency formatting failed:`, error);
    return `${currency || '$'}${amount}`;
  }
};

/**
 * Format date according to locale
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Target locale
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = DEFAULT_LANGUAGE, options = {}) => {
  try {
    const dateObj = new Date(date);
    const localeInfo = getLocaleInfo(locale);
    const formatOptions = {
      ...localeInfo?.dateFormat,
      ...options
    };
    
    return new Intl.DateTimeFormat(localeInfo?.htmlLang || locale, formatOptions).format(dateObj);
  } catch (error) {
    console.warn(`[AdvancedLanguageUtils] Date formatting failed:`, error);
    return date.toString();
  }
};

/**
 * Performance and Analytics
 */

/**
 * Get utility performance statistics
 * @returns {Object} Performance stats
 */
export const getPerformanceStats = () => {
  return {
    cacheSize: utilsCache.size,
    cacheHitRate: getCacheHitRate(),
    supportedLocales: SUPPORTED_LOCALES.length,
    defaultLanguage: DEFAULT_LANGUAGE,
    lastCacheClean: getLastCacheClean()
  };
};

/**
 * Clear utility cache
 */
export const clearUtilsCache = () => {
  utilsCache.clear();
  console.debug('[AdvancedLanguageUtils] Cache cleared');
};

/**
 * Internal helper functions
 */

let cacheHits = 0;
let cacheMisses = 0;
let lastCacheClean = Date.now();

const getCacheHitRate = () => {
  const total = cacheHits + cacheMisses;
  return total > 0 ? (cacheHits / total * 100).toFixed(2) : 0;
};

const getLastCacheClean = () => lastCacheClean;

// Cache management
setInterval(() => {
  const now = Date.now();
  const entriesToDelete = [];
  
  utilsCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      entriesToDelete.push(key);
    }
  });
  
  entriesToDelete.forEach(key => utilsCache.delete(key));
  
  if (entriesToDelete.length > 0) {
    lastCacheClean = now;
    console.debug(`[AdvancedLanguageUtils] Cleaned ${entriesToDelete.length} expired cache entries`);
  }
}, CACHE_TTL);

/**
 * React Hooks
 */

/**
 * Hook for language utilities in React components
 * @param {string} currentLocale - Current locale
 * @returns {Object} Utility functions and data
 */
export const useAdvancedLanguageUtils = (currentLocale = DEFAULT_LANGUAGE) => {
  const React = window.React;
  
  const localeInfo = React.useMemo(() => {
    return getLocaleInfo(currentLocale);
  }, [currentLocale]);

  const formatters = React.useMemo(() => ({
    number: (value, options) => formatNumber(value, currentLocale, options),
    currency: (value, currency) => formatCurrency(value, currentLocale, currency),
    date: (value, options) => formatDate(value, currentLocale, options)
  }), [currentLocale]);

  const urlGenerators = React.useMemo(() => ({
    localized: (path, options) => generateAdvancedLocalizedPath(path, currentLocale, options),
    variants: (path, options) => generateAllLanguageVariants(path, options)
  }), [currentLocale]);

  return {
    localeInfo,
    formatters,
    urlGenerators,
    currentLocale,
    isSupported: SUPPORTED_LOCALES.includes(currentLocale),
    isDefault: currentLocale === DEFAULT_LANGUAGE
  };
};
