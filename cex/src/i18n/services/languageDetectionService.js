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
  ADVANCED_LANGUAGE_CONFIG,
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  BROWSER_LANGUAGE_PATTERNS,
  getLanguageConfig,
  getFallbackLanguage,
  getMainVariant
} from '../config/languageConfig';

/**
 * 🔍 Advanced Language Detection Service
 * 
 * Implements a sophisticated language detection system following Binance's approach:
 * 1. URL-based detection (highest priority)
 * 2. localStorage persistence (medium priority)
 * 3. Browser language detection with BCP 47 mapping (low priority)
 * 4. Intelligent fallback with regional preferences
 * 
 * Features:
 * - BCP 47 standard compliance
 * - Regional variant detection
 * - Graceful fallback strategies
 * - Performance optimized caching
 * - Analytics tracking ready
 */

/**
 * Storage configuration
 */
const STORAGE_KEYS = {
  LANGUAGE: 'ruacoin_language_v2', // v2 to migrate from old system
  LANGUAGE_PREFERENCE: 'ruacoin_language_preference',
  DETECTION_SOURCE: 'ruacoin_language_source',
  LAST_DETECTION: 'ruacoin_last_detection'
};

/**
 * Detection source types
 */
export const DETECTION_SOURCES = {
  URL: 'url',
  LOCAL_STORAGE: 'localStorage',
  BROWSER: 'browser',
  DEFAULT: 'default',
  MANUAL: 'manual'
};

/**
 * Detection configuration
 */
const DETECTION_CONFIG = {
  cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
  fallbackChain: true,
  enableRegionalDetection: true,
  enableAnalytics: true
};

/**
 * Advanced Language Detection Service
 */
class LanguageDetectionService {
  constructor() {
    this.cache = new Map();
    this.listeners = new Set();
    this.isInitialized = false;
  }

  /**
   * Initialize the detection service
   */
  async initialize() {
    try {
      await this.migrateOldSettings();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Language detection service initialization failed:', error);
      return false;
    }
  }

  /**
   * Migrate from old language settings
   */
  async migrateOldSettings() {
    try {
      const oldLanguage = localStorage.getItem('ruacoin_language');
      if (oldLanguage && !localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
        // Map old language codes to new BCP 47 codes
        const migrationMap = {
          'zh': 'zh-CN',
          'en': 'en',
          'ja': 'ja',
          'ko': 'ko'
        };
        
        const newLanguage = migrationMap[oldLanguage] || DEFAULT_LANGUAGE;
        await this.saveLanguagePreference(newLanguage, DETECTION_SOURCES.LOCAL_STORAGE);
        
        // Clean up old storage
        localStorage.removeItem('ruacoin_language');
      }
    } catch (error) {
      console.warn('Language migration failed:', error);
    }
  }

  /**
   * Detect language with advanced fallback strategy
   * @param {string} currentUrl - Current URL for URL-based detection
   * @returns {Promise<Object>} Detection result with language and source
   */
  async detectLanguage(currentUrl = window.location.pathname) {
    const detectionSteps = [
      () => this.detectFromUrl(currentUrl),
      () => this.detectFromLocalStorage(),
      () => this.detectFromBrowser(),
      () => ({ language: DEFAULT_LANGUAGE, source: DETECTION_SOURCES.DEFAULT })
    ];

    for (const detectStep of detectionSteps) {
      try {
        const result = await detectStep();
        if (result && result.language) {
          await this.trackDetection(result);
          return result;
        }
      } catch (error) {
        console.warn('Detection step failed:', error);
      }
    }

    // Final fallback
    const fallbackResult = { 
      language: DEFAULT_LANGUAGE, 
      source: DETECTION_SOURCES.DEFAULT 
    };
    await this.trackDetection(fallbackResult);
    return fallbackResult;
  }

  /**
   * Detect language from URL path
   * @param {string} url - URL to analyze
   * @returns {Object|null} Detection result or null
   */
  detectFromUrl(url) {
    try {
      const pathSegments = url.split('/').filter(Boolean);
      const firstSegment = pathSegments[0];

      if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment)) {
        return {
          language: firstSegment,
          source: DETECTION_SOURCES.URL,
          confidence: 1.0
        };
      }

      // Check for SEO-friendly codes
      const languageConfig = Object.values(ADVANCED_LANGUAGE_CONFIG)
        .find(config => config.seoCode === firstSegment);
      
      if (languageConfig) {
        return {
          language: languageConfig.code,
          source: DETECTION_SOURCES.URL,
          confidence: 0.9
        };
      }

      return null;
    } catch (error) {
      console.warn('URL detection failed:', error);
      return null;
    }
  }

  /**
   * Detect language from localStorage
   * @returns {Object|null} Detection result or null
   */
  detectFromLocalStorage() {
    try {
      const storedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      const storedTimestamp = localStorage.getItem(STORAGE_KEYS.LAST_DETECTION);
      
      if (!storedLanguage) return null;

      // Check if stored preference is still valid
      if (storedTimestamp) {
        const timestamp = parseInt(storedTimestamp);
        const isExpired = Date.now() - timestamp > DETECTION_CONFIG.cacheExpiry;
        if (isExpired) {
          this.clearStoredPreferences();
          return null;
        }
      }

      if (SUPPORTED_LOCALES.includes(storedLanguage)) {
        return {
          language: storedLanguage,
          source: DETECTION_SOURCES.LOCAL_STORAGE,
          confidence: 0.8
        };
      }

      return null;
    } catch (error) {
      console.warn('localStorage detection failed:', error);
      return null;
    }
  }

  /**
   * Detect language from browser with advanced BCP 47 mapping
   * @returns {Object|null} Detection result or null
   */
  detectFromBrowser() {
    try {
      const browserLanguages = this.getBrowserLanguages();
      
      for (const browserLang of browserLanguages) {
        // Direct match
        if (SUPPORTED_LOCALES.includes(browserLang)) {
          return {
            language: browserLang,
            source: DETECTION_SOURCES.BROWSER,
            confidence: 0.7
          };
        }

        // Pattern matching
        for (const [supportedLang, patterns] of Object.entries(BROWSER_LANGUAGE_PATTERNS)) {
          if (patterns.includes(browserLang)) {
            return {
              language: supportedLang,
              source: DETECTION_SOURCES.BROWSER,
              confidence: 0.6,
              originalBrowserLanguage: browserLang
            };
          }
        }

        // Language family matching (e.g., 'zh-SG' -> 'zh-CN')
        const languageFamily = browserLang.split('-')[0];
        const mainVariant = getMainVariant(languageFamily);
        if (mainVariant && SUPPORTED_LOCALES.includes(mainVariant)) {
          return {
            language: mainVariant,
            source: DETECTION_SOURCES.BROWSER,
            confidence: 0.5,
            originalBrowserLanguage: browserLang,
            isLanguageFamilyMatch: true
          };
        }
      }

      return null;
    } catch (error) {
      console.warn('Browser detection failed:', error);
      return null;
    }
  }

  /**
   * Get browser languages in priority order
   * @returns {string[]} Array of language codes
   */
  getBrowserLanguages() {
    try {
      const languages = [];
      
      // Navigator.languages (most preferred)
      if (navigator.languages && navigator.languages.length > 0) {
        languages.push(...navigator.languages);
      }
      
      // Navigator.language (fallback)
      if (navigator.language) {
        languages.push(navigator.language);
      }
      
      // Navigator.userLanguage (IE fallback)
      if (navigator.userLanguage) {
        languages.push(navigator.userLanguage);
      }

      // Remove duplicates and normalize
      return [...new Set(languages)]
        .map(lang => lang.trim().toLowerCase())
        .filter(lang => lang.length > 0);
    } catch (error) {
      console.warn('Browser language extraction failed:', error);
      return [];
    }
  }

  /**
   * Save language preference with metadata
   * @param {string} language - Language code
   * @param {string} source - Detection source
   * @param {Object} metadata - Additional metadata
   */
  async saveLanguagePreference(language, source = DETECTION_SOURCES.MANUAL, metadata = {}) {
    try {
      if (!SUPPORTED_LOCALES.includes(language)) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const timestamp = Date.now();
      const preferenceData = {
        language,
        source,
        timestamp,
        metadata
      };

      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      localStorage.setItem(STORAGE_KEYS.DETECTION_SOURCE, source);
      localStorage.setItem(STORAGE_KEYS.LAST_DETECTION, timestamp.toString());
      localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, JSON.stringify(preferenceData));

      // Notify listeners
      this.notifyLanguageChange(language, source, metadata);

      return true;
    } catch (error) {
      console.error('Failed to save language preference:', error);
      return false;
    }
  }

  /**
   * Get stored language preference
   * @returns {Object|null} Stored preference data or null
   */
  getStoredPreference() {
    try {
      const preferenceJson = localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
      if (!preferenceJson) return null;

      const preference = JSON.parse(preferenceJson);
      
      // Validate preference
      if (!preference.language || !SUPPORTED_LOCALES.includes(preference.language)) {
        this.clearStoredPreferences();
        return null;
      }

      return preference;
    } catch (error) {
      console.warn('Failed to get stored preference:', error);
      this.clearStoredPreferences();
      return null;
    }
  }

  /**
   * Clear stored preferences
   */
  clearStoredPreferences() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear stored preferences:', error);
    }
  }

  /**
   * Track detection for analytics
   * @param {Object} result - Detection result
   */
  async trackDetection(result) {
    try {
      if (!DETECTION_CONFIG.enableAnalytics) return;

      const trackingData = {
        language: result.language,
        source: result.source,
        confidence: result.confidence || 0,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Store for analytics (could be sent to analytics service)
      console.debug('Language detection tracked:', trackingData);
      
      // TODO: Send to analytics service
      // await this.sendToAnalytics(trackingData);
      
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Add language change listener
   * @param {Function} listener - Callback function
   */
  addLanguageChangeListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Remove language change listener
   * @param {Function} listener - Callback function
   */
  removeLanguageChangeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify listeners of language change
   * @param {string} language - New language
   * @param {string} source - Detection source
   * @param {Object} metadata - Additional metadata
   */
  notifyLanguageChange(language, source, metadata) {
    try {
      const event = {
        language,
        source,
        metadata,
        timestamp: Date.now()
      };

      this.listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.warn('Language change listener error:', error);
        }
      });

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('advancedLanguageChanged', {
        detail: event
      }));
    } catch (error) {
      console.warn('Failed to notify language change:', error);
    }
  }

  /**
   * Get detection statistics
   * @returns {Object} Detection statistics
   */
  getDetectionStats() {
    try {
      const preference = this.getStoredPreference();
      const config = getLanguageConfig(preference?.language || DEFAULT_LANGUAGE);
      
      return {
        currentLanguage: preference?.language || DEFAULT_LANGUAGE,
        detectionSource: preference?.source || DETECTION_SOURCES.DEFAULT,
        lastDetection: preference?.timestamp || null,
        languageConfig: config,
        isInitialized: this.isInitialized,
        supportedLanguages: SUPPORTED_LOCALES,
        cacheSize: this.cache.size
      };
    } catch (error) {
      console.warn('Failed to get detection stats:', error);
      return null;
    }
  }
}

// Create singleton instance
const languageDetectionService = new LanguageDetectionService();

export default languageDetectionService;

/**
 * Utility functions for external use
 */

/**
 * Quick language detection
 * @param {string} url - URL to analyze
 * @returns {Promise<string>} Detected language code
 */
export const quickDetectLanguage = async (url) => {
  const result = await languageDetectionService.detectLanguage(url);
  return result.language;
};

/**
 * Initialize language detection
 * @returns {Promise<boolean>} Success status
 */
export const initializeLanguageDetection = async () => {
  return await languageDetectionService.initialize();
};

/**
 * Get current language preference
 * @returns {string} Current language code
 */
export const getCurrentLanguagePreference = () => {
  const preference = languageDetectionService.getStoredPreference();
  return preference?.language || DEFAULT_LANGUAGE;
};

export {
  languageDetectionService,
  STORAGE_KEYS
}; 