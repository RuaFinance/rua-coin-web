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
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isLanguageSupported
} from '../config/languageConfig';

/**
 * 💾 Advanced Language Persistence Manager
 * 
 * Provides robust language preference storage and retrieval with multiple fallback strategies:
 * 
 * Storage Hierarchy (in order of preference):
 * 1. Memory cache (fastest, session-only)
 * 2. localStorage (persistent, preferred)
 * 3. sessionStorage (fallback for private/incognito)
 * 4. cookies (legacy fallback)
 * 5. URL parameters (temporary override)
 * 
 * Features:
 * - Multi-layer storage with automatic fallbacks
 * - Data validation and sanitization
 * - Automatic migration from legacy formats
 * - Comprehensive error handling
 * - Performance optimization with caching
 * - Analytics integration for usage tracking
 * 
 * @module languagePersistence
 */

/**
 * Storage keys configuration
 */
const STORAGE_KEYS = {
  // Primary storage keys (v3 format)
  LANGUAGE: 'ruacoin_language_v3',
  PREFERENCE: 'ruacoin_language_preference_v3',
  DETECTION_SOURCE: 'ruacoin_detection_source_v3',
  LAST_UPDATE: 'ruacoin_language_updated_v3',
  USER_OVERRIDE: 'ruacoin_user_override_v3',
  
  // Legacy keys for migration
  LEGACY_LANGUAGE: 'ruacoin_language',
  LEGACY_LANGUAGE_V2: 'ruacoin_language_v2',
  LEGACY_I18N: 'i18nextLng',
  
  // Cookie names
  COOKIE_LANGUAGE: 'ruacoin_lang',
  COOKIE_PREFERENCE: 'ruacoin_lang_pref'
};

/**
 * Storage sources
 */
export const STORAGE_SOURCES = {
  MEMORY: 'memory',
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage', 
  COOKIES: 'cookies',
  URL_PARAMS: 'urlParams',
  DEFAULT: 'default'
};

/**
 * Persistence configuration
 */
const PERSISTENCE_CONFIG = {
  // Cache settings
  enableMemoryCache: true,
  memoryCacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Storage settings
  preferLocalStorage: true,
  enableCookieFallback: true,
  cookieMaxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  cookiePath: '/',
  cookieDomain: window.location.hostname,
  
  // Migration settings
  enableLegacyMigration: true,
  migrationTimeout: 1000, // 1 second
  
  // Validation settings
  enableValidation: true,
  enableSanitization: true,
  
  // Analytics
  enableAnalytics: true
};

/**
 * Memory cache for language preferences
 */
class LanguageCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  get(key) {
    if (!PERSISTENCE_CONFIG.enableMemoryCache) return null;
    
    const value = this.cache.get(key);
    const timestamp = this.timestamps.get(key);
    
    if (value && timestamp && 
        Date.now() - timestamp < PERSISTENCE_CONFIG.memoryCacheTimeout) {
      return value;
    }
    
    // Clear expired entry
    this.delete(key);
    return null;
  }

  set(key, value) {
    if (!PERSISTENCE_CONFIG.enableMemoryCache) return;
    
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  size() {
    return this.cache.size;
  }
}

const languageCache = new LanguageCache();

/**
 * Storage abstraction layer
 */
class StorageAdapter {
  constructor() {
    this.capabilities = this._detectCapabilities();
  }

  /**
   * Detect storage capabilities
   * @private
   */
  _detectCapabilities() {
    const capabilities = {
      localStorage: false,
      sessionStorage: false,
      cookies: false
    };

    // Test localStorage
    try {
      const testKey = '__ruacoin_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      capabilities.localStorage = true;
    } catch (e) {
      console.warn('[LanguagePersistence] localStorage not available:', e.message);
    }

    // Test sessionStorage
    try {
      const testKey = '__ruacoin_session_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      capabilities.sessionStorage = true;
    } catch (e) {
      console.warn('[LanguagePersistence] sessionStorage not available:', e.message);
    }

    // Test cookies
    try {
      document.cookie = '__ruacoin_cookie_test__=test';
      capabilities.cookies = document.cookie.indexOf('__ruacoin_cookie_test__=test') !== -1;
      document.cookie = '__ruacoin_cookie_test__=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {
      console.warn('[LanguagePersistence] Cookies not available:', e.message);
    }

    return capabilities;
  }

  /**
   * Get value from storage with fallback strategy
   */
  get(key, source = null) {
    // Check memory cache first
    const cached = languageCache.get(key);
    if (cached) {
      return { value: cached, source: STORAGE_SOURCES.MEMORY };
    }

    // If specific source requested, try only that
    if (source) {
      const value = this._getFromSource(key, source);
      if (value !== null) {
        languageCache.set(key, value);
        return { value, source };
      }
      return null;
    }

    // Try storage sources in order of preference
    const sources = this._getStorageOrderOfPreference();
    
    for (const storageSource of sources) {
      const value = this._getFromSource(key, storageSource);
      if (value !== null) {
        languageCache.set(key, value);
        return { value, source: storageSource };
      }
    }

    return null;
  }

  /**
   * Set value to storage with fallback strategy
   */
  set(key, value, options = {}) {
    const { preferredSource = null } = options;

    // Update memory cache
    languageCache.set(key, value);

    // Determine target sources
    const targetSources = preferredSource 
      ? [preferredSource]
      : this._getStorageOrderOfPreference();

    const results = [];

    for (const source of targetSources) {
      try {
        const success = this._setToSource(key, value, source, options);
        results.push({ source, success });
        
        // If preferred source succeeds, we can stop here
        if (success && preferredSource) {
          break;
        }
      } catch (error) {
        console.warn(`[LanguagePersistence] Failed to set ${key} to ${source}:`, error);
        results.push({ source, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Remove value from all storage sources
   */
  remove(key) {
    // Remove from memory cache
    languageCache.delete(key);

    const results = [];
    const allSources = [
      STORAGE_SOURCES.LOCAL_STORAGE,
      STORAGE_SOURCES.SESSION_STORAGE,
      STORAGE_SOURCES.COOKIES
    ];

    for (const source of allSources) {
      try {
        const success = this._removeFromSource(key, source);
        results.push({ source, success });
      } catch (error) {
        console.warn(`[LanguagePersistence] Failed to remove ${key} from ${source}:`, error);
        results.push({ source, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get storage order of preference
   * @private
   */
  _getStorageOrderOfPreference() {
    const order = [];

    // Prefer localStorage if available and enabled
    if (this.capabilities.localStorage && PERSISTENCE_CONFIG.preferLocalStorage) {
      order.push(STORAGE_SOURCES.LOCAL_STORAGE);
    }

    // SessionStorage as fallback
    if (this.capabilities.sessionStorage) {
      order.push(STORAGE_SOURCES.SESSION_STORAGE);
    }

    // Cookies as last resort
    if (this.capabilities.cookies && PERSISTENCE_CONFIG.enableCookieFallback) {
      order.push(STORAGE_SOURCES.COOKIES);
    }

    return order;
  }

  /**
   * Get value from specific source
   * @private
   */
  _getFromSource(key, source) {
    switch (source) {
      case STORAGE_SOURCES.LOCAL_STORAGE:
        return this.capabilities.localStorage ? localStorage.getItem(key) : null;
        
      case STORAGE_SOURCES.SESSION_STORAGE:
        return this.capabilities.sessionStorage ? sessionStorage.getItem(key) : null;
        
      case STORAGE_SOURCES.COOKIES:
        return this.capabilities.cookies ? this._getCookie(key) : null;
        
      case STORAGE_SOURCES.URL_PARAMS:
        return this._getURLParam(key);
        
      default:
        return null;
    }
  }

  /**
   * Set value to specific source
   * @private
   */
  _setToSource(key, value, source, options = {}) {
    switch (source) {
      case STORAGE_SOURCES.LOCAL_STORAGE:
        if (this.capabilities.localStorage) {
          localStorage.setItem(key, value);
          return true;
        }
        return false;
        
      case STORAGE_SOURCES.SESSION_STORAGE:
        if (this.capabilities.sessionStorage) {
          sessionStorage.setItem(key, value);
          return true;
        }
        return false;
        
      case STORAGE_SOURCES.COOKIES:
        if (this.capabilities.cookies) {
          this._setCookie(key, value, options);
          return true;
        }
        return false;
        
      default:
        return false;
    }
  }

  /**
   * Remove value from specific source
   * @private
   */
  _removeFromSource(key, source) {
    switch (source) {
      case STORAGE_SOURCES.LOCAL_STORAGE:
        if (this.capabilities.localStorage) {
          localStorage.removeItem(key);
          return true;
        }
        return false;
        
      case STORAGE_SOURCES.SESSION_STORAGE:
        if (this.capabilities.sessionStorage) {
          sessionStorage.removeItem(key);
          return true;
        }
        return false;
        
      case STORAGE_SOURCES.COOKIES:
        if (this.capabilities.cookies) {
          this._deleteCookie(key);
          return true;
        }
        return false;
        
      default:
        return false;
    }
  }

  /**
   * Cookie utilities
   * @private
   */
  _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  _setCookie(name, value, options = {}) {
    const {
      maxAge = PERSISTENCE_CONFIG.cookieMaxAge,
      path = PERSISTENCE_CONFIG.cookiePath,
      domain = PERSISTENCE_CONFIG.cookieDomain,
      secure = window.location.protocol === 'https:',
      sameSite = 'Lax'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    if (maxAge) cookieString += `; Max-Age=${maxAge}`;
    if (path) cookieString += `; Path=${path}`;
    if (domain) cookieString += `; Domain=${domain}`;
    if (secure) cookieString += `; Secure`;
    if (sameSite) cookieString += `; SameSite=${sameSite}`;

    document.cookie = cookieString;
  }

  _deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${PERSISTENCE_CONFIG.cookiePath}`;
  }

  /**
   * URL parameter utilities
   * @private
   */
  _getURLParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  }

  /**
   * Get storage capabilities summary
   */
  getCapabilities() {
    return { ...this.capabilities };
  }
}

const storageAdapter = new StorageAdapter();

/**
 * Language persistence manager
 */
class LanguagePersistenceManager {
  constructor() {
    this.migrationPromise = null;
    this.initializeMigration();
  }

  /**
   * Initialize legacy migration
   * @private
   */
  async initializeMigration() {
    if (!PERSISTENCE_CONFIG.enableLegacyMigration) return;

    try {
      this.migrationPromise = this._migrateLegacyData();
      await Promise.race([
        this.migrationPromise,
        new Promise(resolve => setTimeout(resolve, PERSISTENCE_CONFIG.migrationTimeout))
      ]);
    } catch (error) {
      console.warn('[LanguagePersistence] Migration failed:', error);
    }
  }

  /**
   * Save language preference
   */
  async saveLanguagePreference(language, source = STORAGE_SOURCES.LOCAL_STORAGE, metadata = {}) {
    // Validate language
    if (!this._validateLanguage(language)) {
      throw new Error(`Invalid language code: ${language}`);
    }

    // Sanitize language
    const sanitizedLanguage = this._sanitizeLanguage(language);

    // Prepare data to store
    const preferenceData = {
      language: sanitizedLanguage,
      source,
      timestamp: Date.now(),
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...metadata
      }
    };

    try {
      // Store language preference
      const results = storageAdapter.set(
        STORAGE_KEYS.LANGUAGE, 
        sanitizedLanguage
      );

      // Store preference metadata
      storageAdapter.set(
        STORAGE_KEYS.PREFERENCE,
        JSON.stringify(preferenceData)
      );

      // Store detection source
      storageAdapter.set(
        STORAGE_KEYS.DETECTION_SOURCE,
        source
      );

      // Store last update timestamp
      storageAdapter.set(
        STORAGE_KEYS.LAST_UPDATE,
        Date.now().toString()
      );

      // Track analytics
      this._trackLanguageChange(sanitizedLanguage, source, metadata);

      return {
        success: true,
        language: sanitizedLanguage,
        storageResults: results
      };

    } catch (error) {
      console.error('[LanguagePersistence] Failed to save language preference:', error);
      throw error;
    }
  }

  /**
   * Load language preference
   */
  async loadLanguagePreference() {
    try {
      // Wait for migration to complete
      if (this.migrationPromise) {
        await this.migrationPromise;
      }

      // Try to load from storage
      const languageResult = storageAdapter.get(STORAGE_KEYS.LANGUAGE);
      
      if (languageResult && languageResult.value) {
        const language = languageResult.value;
        
        // Validate loaded language
        if (this._validateLanguage(language)) {
          // Load additional metadata
          const preferenceResult = storageAdapter.get(STORAGE_KEYS.PREFERENCE);
          const sourceResult = storageAdapter.get(STORAGE_KEYS.DETECTION_SOURCE);
          const updateResult = storageAdapter.get(STORAGE_KEYS.LAST_UPDATE);

          let metadata = {};
          try {
            if (preferenceResult && preferenceResult.value) {
              metadata = JSON.parse(preferenceResult.value);
            }
          } catch (e) {
            console.warn('[LanguagePersistence] Failed to parse preference metadata:', e);
          }

          return {
            language,
            source: sourceResult ? sourceResult.value : languageResult.source,
            lastUpdate: updateResult ? parseInt(updateResult.value) : null,
            metadata,
            storageSource: languageResult.source
          };
        } else {
          console.warn('[LanguagePersistence] Invalid stored language, removing:', language);
          await this.clearLanguagePreference();
        }
      }

      // No valid preference found
      return null;

    } catch (error) {
      console.error('[LanguagePersistence] Failed to load language preference:', error);
      return null;
    }
  }

  /**
   * Clear language preference
   */
  async clearLanguagePreference() {
    try {
      const keys = [
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.PREFERENCE,
        STORAGE_KEYS.DETECTION_SOURCE,
        STORAGE_KEYS.LAST_UPDATE,
        STORAGE_KEYS.USER_OVERRIDE
      ];

      const results = [];
      for (const key of keys) {
        const result = storageAdapter.remove(key);
        results.push({ key, result });
      }

      // Clear cache
      languageCache.clear();

      return {
        success: true,
        results
      };

    } catch (error) {
      console.error('[LanguagePersistence] Failed to clear language preference:', error);
      throw error;
    }
  }

  /**
   * Set user override (temporary preference)
   */
  async setUserOverride(language, options = {}) {
    const { temporary = false } = options;

    if (!this._validateLanguage(language)) {
      throw new Error(`Invalid language code: ${language}`);
    }

    const sanitizedLanguage = this._sanitizeLanguage(language);

    try {
      if (temporary) {
        // Store only in memory and session storage
        languageCache.set(STORAGE_KEYS.USER_OVERRIDE, sanitizedLanguage);
        storageAdapter.set(
          STORAGE_KEYS.USER_OVERRIDE,
          sanitizedLanguage,
          { preferredSource: STORAGE_SOURCES.SESSION_STORAGE }
        );
      } else {
        // Save as permanent preference
        await this.saveLanguagePreference(sanitizedLanguage, 'user_override', {
          isOverride: true,
          ...options
        });
      }

      return { success: true, language: sanitizedLanguage };

    } catch (error) {
      console.error('[LanguagePersistence] Failed to set user override:', error);
      throw error;
    }
  }

  /**
   * Get user override
   */
  getUserOverride() {
    const result = storageAdapter.get(STORAGE_KEYS.USER_OVERRIDE);
    return result ? result.value : null;
  }

  /**
   * Clear user override
   */
  clearUserOverride() {
    return storageAdapter.remove(STORAGE_KEYS.USER_OVERRIDE);
  }

  /**
   * Migrate legacy data
   * @private
   */
  async _migrateLegacyData() {
    const legacyKeys = [
      STORAGE_KEYS.LEGACY_LANGUAGE,
      STORAGE_KEYS.LEGACY_LANGUAGE_V2,
      STORAGE_KEYS.LEGACY_I18N
    ];

    for (const legacyKey of legacyKeys) {
      const result = storageAdapter.get(legacyKey);
      
      if (result && result.value && this._validateLanguage(result.value)) {
        console.log('[LanguagePersistence] Migrating from legacy key:', legacyKey);
        
        // Save to new format
        await this.saveLanguagePreference(result.value, 'migration', {
          migratedFrom: legacyKey,
          migrationDate: Date.now()
        });

        // Remove legacy key
        storageAdapter.remove(legacyKey);
        break;
      }
    }
  }

  /**
   * Validate language code
   * @private
   */
  _validateLanguage(language) {
    if (!PERSISTENCE_CONFIG.enableValidation) return true;
    
    return typeof language === 'string' && 
           language.length > 0 && 
           isLanguageSupported(language);
  }

  /**
   * Sanitize language code
   * @private
   */
  _sanitizeLanguage(language) {
    if (!PERSISTENCE_CONFIG.enableSanitization) return language;
    
    return language.trim().toLowerCase();
  }

  /**
   * Track language change for analytics
   * @private
   */
  _trackLanguageChange(language, source, metadata) {
    if (!PERSISTENCE_CONFIG.enableAnalytics) return;

    try {
      // Track with your analytics service
      console.debug('[LanguagePersistence] Language changed:', {
        language,
        source,
        metadata,
        timestamp: Date.now()
      });

      // Example GA4 tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'language_preference_saved', {
          language_code: language,
          detection_source: source,
          storage_method: metadata.storageMethod || 'unknown'
        });
      }

    } catch (error) {
      console.warn('[LanguagePersistence] Analytics tracking failed:', error);
    }
  }

  /**
   * Get persistence statistics
   */
  getStatistics() {
    return {
      capabilities: storageAdapter.getCapabilities(),
      cacheSize: languageCache.size(),
      lastMigration: this.migrationPromise ? 'completed' : 'not_needed',
      configuration: {
        enableMemoryCache: PERSISTENCE_CONFIG.enableMemoryCache,
        preferLocalStorage: PERSISTENCE_CONFIG.preferLocalStorage,
        enableCookieFallback: PERSISTENCE_CONFIG.enableCookieFallback
      }
    };
  }
}

// Create singleton instance
const languagePersistenceManager = new LanguagePersistenceManager();

export default languagePersistenceManager;

/**
 * Utility functions for external use
 */

/**
 * Save language preference (simple interface)
 * @param {string} language - Language code to save
 * @param {string} source - Detection source
 * @returns {Promise<Object>} Save result
 */
export const saveLanguage = async (language, source = 'manual') => {
  return await languagePersistenceManager.saveLanguagePreference(language, source);
};

/**
 * Load language preference (simple interface)
 * @returns {Promise<string|null>} Language code or null
 */
export const loadLanguage = async () => {
  const result = await languagePersistenceManager.loadLanguagePreference();
  return result ? result.language : null;
};

/**
 * Clear all language preferences
 * @returns {Promise<Object>} Clear result
 */
export const clearLanguage = async () => {
  return await languagePersistenceManager.clearLanguagePreference();
};

/**
 * Set temporary language override
 * @param {string} language - Language code
 * @returns {Promise<Object>} Set result
 */
export const setTemporaryLanguage = async (language) => {
  return await languagePersistenceManager.setUserOverride(language, { temporary: true });
};

export {
  languagePersistenceManager,
  storageAdapter,
  languageCache,
  STORAGE_KEYS,
  PERSISTENCE_CONFIG
}; 