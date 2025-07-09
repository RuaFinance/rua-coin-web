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

/**
 * 🌍 Advanced Language Configuration
 * 
 * Following BCP 47 language-region standards used by major global platforms like Binance.
 * Supports multi-regional language variants for enhanced localization.
 * 
 * @see https://tools.ietf.org/html/bcp47
 * @see https://www.binance.com (Reference implementation)
 */

/**
 * BCP 47 Language Configuration
 * 
 * Each language entry includes:
 * - code: BCP 47 language-region code
 * - name: English name for the language
 * - nativeName: Native name in the language itself
 * - region: Region-specific name
 * - flag: Unicode flag emoji
 * - dir: Text direction (ltr/rtl)
 * - currency: Default currency for the region
 * - timezone: Default timezone
 * - isMainVariant: Whether this is the primary variant for the language
 * - fallback: Fallback language code
 * - seoCode: SEO-friendly URL code
 * - htmlLang: HTML lang attribute value
 */
export const ADVANCED_LANGUAGE_CONFIG = {
  // English (Global)
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global',
    flag: '🇺🇸',
    dir: 'ltr',
    currency: 'USD',
    timezone: 'UTC',
    isMainVariant: true,
    fallback: null,
    seoCode: 'en',
    htmlLang: 'en',
    priority: 1,
    regions: ['US', 'GB', 'AU', 'CA'],
    markets: ['global', 'americas', 'europe', 'oceania']
  },

  // Simplified Chinese (China)
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    region: 'China',
    flag: '🇨🇳',
    dir: 'ltr',
    currency: 'CNY',
    timezone: 'Asia/Shanghai',
    isMainVariant: true,
    fallback: null,
    seoCode: 'zh-cn',
    htmlLang: 'zh-CN',
    priority: 2,
    regions: ['CN', 'SG'],
    markets: ['asia', 'china']
  },

  // Traditional Chinese (Taiwan/Hong Kong)
  'zh-TC': {
    code: 'zh-TC',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    region: 'Taiwan/Hong Kong',
    flag: '🇨🇳',
    dir: 'ltr',
    currency: 'TWD',
    timezone: 'Asia/Taipei',
    isMainVariant: false,
    fallback: 'zh-CN',
    seoCode: 'zh-tc',
    htmlLang: 'zh-TW',
    priority: 5,
    regions: ['TW', 'HK', 'MO'],
    markets: ['asia', 'taiwan', 'hongkong']
  },

  // Japanese
  'ja': {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    flag: '🇯🇵',
    dir: 'ltr',
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
    isMainVariant: true,
    fallback: 'en',
    seoCode: 'ja',
    htmlLang: 'ja',
    priority: 3,
    regions: ['JP'],
    markets: ['asia', 'japan']
  },

  // Korean
  'ko': {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    region: 'Korea',
    flag: '🇰🇷',
    dir: 'ltr',
    currency: 'KRW',
    timezone: 'Asia/Seoul',
    isMainVariant: true,
    fallback: 'en',
    seoCode: 'ko',
    htmlLang: 'ko',
    priority: 6,
    regions: ['KR'],
    markets: ['asia', 'korea']
  },

  // English (India) - Large market with specific terminology
  'en-IN': {
    code: 'en-IN',
    name: 'English (India)',
    nativeName: 'English (India)',
    region: 'India',
    flag: '🇮🇳',
    dir: 'ltr',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    isMainVariant: false,
    fallback: 'en',
    seoCode: 'en-in',
    htmlLang: 'en-IN',
    priority: 4,
    regions: ['IN'],
    markets: ['asia', 'india']
  },

  // Russian
  'ru': {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Russia',
    flag: '🇷🇺',
    dir: 'ltr',
    currency: 'RUB',
    timezone: 'Europe/Moscow',
    isMainVariant: true,
    fallback: 'en',
    seoCode: 'ru',
    htmlLang: 'ru',
    priority: 7,
    regions: ['RU'],
    markets: ['europe', 'russia']
  },
};

/**
 * Supported Languages List (for routing and validation)
 */
export const SUPPORTED_LOCALES = Object.keys(ADVANCED_LANGUAGE_CONFIG);

/**
 * Default language configuration
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Language priority order for fallback detection
 */
export const LANGUAGE_PRIORITY_ORDER = Object.values(ADVANCED_LANGUAGE_CONFIG)
  .sort((a, b) => a.priority - b.priority)
  .map(lang => lang.code);

/**
 * Locale to SEO URL mapping
 */
export const LOCALE_TO_SEO_MAP = Object.fromEntries(
  Object.values(ADVANCED_LANGUAGE_CONFIG).map(lang => [lang.code, lang.seoCode])
);

/**
 * SEO URL to locale mapping
 */
export const SEO_TO_LOCALE_MAP = Object.fromEntries(
  Object.values(ADVANCED_LANGUAGE_CONFIG).map(lang => [lang.seoCode, lang.code])
);

/**
 * Regional market groupings
 */
export const MARKET_REGIONS = {
  americas: ['en'],
  europe: ['en', 'ru'],
  asia: ['zh-CN', 'zh-TC', 'ja', 'ko', 'en-IN'],
  russia: ['ru'],
  global: ['en', 'zh-CN', 'ja', 'ru']
};

/**
 * Language detection patterns for browser language matching
 */
export const BROWSER_LANGUAGE_PATTERNS = {
  'en': ['en', 'en-US', 'en-GB', 'en-AU', 'en-CA'],
  'en-IN': ['en-IN'],
  'zh-CN': ['zh', 'zh-CN', 'zh-Hans', 'zh-Hans-CN'],
  'zh-TC': ['zh-TW', 'zh-HK', 'zh-Hant', 'zh-Hant-TW', 'zh-Hant-HK'],
  'ja': ['ja', 'ja-JP'],
  'ko': ['ko', 'ko-KR'],
  'ru': ['ru', 'ru-RU']
};

/**
 * RTL Language Support
 */
export const RTL_LANGUAGES = []; // Currently no RTL languages, but prepared for Arabic, Hebrew, etc.

/**
 * Language-specific number formatting
 */
export const NUMBER_FORMATS = {
  'en': { locale: 'en-US', currency: 'USD' },
  'en-IN': { locale: 'en-IN', currency: 'INR' },
  'zh-CN': { locale: 'zh-CN', currency: 'CNY' },
  'zh-TC': { locale: 'zh-TW', currency: 'TWD' },
  'ja': { locale: 'ja-JP', currency: 'JPY' },
  'ko': { locale: 'ko-KR', currency: 'KRW' },
  'ru': { locale: 'ru-RU', currency: 'RUB' }
};

/**
 * Language-specific date formatting
 */
export const DATE_FORMATS = {
  'en': 'MM/DD/YYYY',
  'en-IN': 'DD/MM/YYYY',
  'zh-CN': 'YYYY年MM月DD日',
  'zh-TC': 'YYYY年MM月DD日',
  'ja': 'YYYY年MM月DD日',
  'ko': 'YYYY년 MM월 DD일',
  'ru': 'DD.MM.YYYY'
};

/**
 * SEO Configuration
 */
export const SEO_CONFIG = {
  defaultLanguage: DEFAULT_LANGUAGE,
  alternateLanguages: SUPPORTED_LOCALES,
  sitemapLanguages: SUPPORTED_LOCALES,
  hreflangMapping: Object.fromEntries(
    Object.values(ADVANCED_LANGUAGE_CONFIG).map(lang => [
      lang.code, 
      lang.htmlLang
    ])
  )
};

/**
 * Get language configuration by code
 */
export const getLanguageConfig = (languageCode) => {
  return ADVANCED_LANGUAGE_CONFIG[languageCode] || ADVANCED_LANGUAGE_CONFIG[DEFAULT_LANGUAGE];
};

/**
 * Check if language is supported
 */
export const isLanguageSupported = (languageCode) => {
  return SUPPORTED_LOCALES.includes(languageCode);
};

/**
 * Get main variant for a language family
 */
export const getMainVariant = (languageFamily) => {
  const variants = Object.values(ADVANCED_LANGUAGE_CONFIG)
    .filter(lang => lang.code.startsWith(languageFamily));
  
  return variants.find(lang => lang.isMainVariant)?.code || variants[0]?.code;
};

/**
 * Get fallback language for a given language
 */
export const getFallbackLanguage = (languageCode) => {
  const config = getLanguageConfig(languageCode);
  return config.fallback || DEFAULT_LANGUAGE;
};

export default {
  ADVANCED_LANGUAGE_CONFIG,
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  LANGUAGE_PRIORITY_ORDER,
  LOCALE_TO_SEO_MAP,
  SEO_TO_LOCALE_MAP,
  MARKET_REGIONS,
  BROWSER_LANGUAGE_PATTERNS,
  RTL_LANGUAGES,
  NUMBER_FORMATS,
  DATE_FORMATS,
  SEO_CONFIG,
  getLanguageConfig,
  isLanguageSupported,
  getMainVariant,
  getFallbackLanguage
}; 