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

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../index';

/**
 * 语言工具函数集合
 * 
 * 提供语言相关的实用工具函数，包括：
 * - 语言检测和验证
 * - 语言格式化
 * - URL 语言处理
 * - 浏览器语言检测
 * 
 * @module LanguageUtils
 */

/**
 * 检测浏览器首选语言
 * 
 * @returns {string} 检测到的语言代码
 */
export const detectBrowserLanguage = () => {
  // 获取浏览器语言列表
  const browserLanguages = navigator.languages || [navigator.language];
  
  // 遍历浏览器语言，找到第一个支持的语言
  for (const lang of browserLanguages) {
    const langCode = lang.split('-')[0]; // 提取主要语言代码
    if (SUPPORTED_LANGUAGES[langCode]) {
      return langCode;
    }
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * 验证语言代码是否支持
 * 
 * @param {string} languageCode - 语言代码
 * @returns {boolean} 是否支持该语言
 */
export const isValidLanguage = (languageCode) => {
  return Boolean(SUPPORTED_LANGUAGES[languageCode]);
};

/**
 * 获取语言的安全代码（如果不支持则返回默认语言）
 * 
 * @param {string} languageCode - 语言代码
 * @returns {string} 安全的语言代码
 */
export const getSafeLanguageCode = (languageCode) => {
  return isValidLanguage(languageCode) ? languageCode : DEFAULT_LANGUAGE;
};

/**
 * 从 URL 路径中提取语言代码
 * 
 * @param {string} pathname - URL 路径
 * @returns {string|null} 提取的语言代码，如果没有则返回 null
 * 
 * @example
 * extractLanguageFromPath('/en/trading') // 'en'
 * extractLanguageFromPath('/zh/markets') // 'zh'
 * extractLanguageFromPath('/trading') // null
 */
export const extractLanguageFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  return isValidLanguage(firstSegment) ? firstSegment : null;
};

/**
 * 构建带语言前缀的 URL 路径
 * 
 * @param {string} path - 原始路径
 * @param {string} languageCode - 语言代码
 * @returns {string} 带语言前缀的路径
 * 
 * @example
 * buildLanguagePath('/trading', 'en') // '/en/trading'
 * buildLanguagePath('/markets', 'zh') // '/zh/markets'
 */
export const buildLanguagePath = (path, languageCode) => {
  const safeLang = getSafeLanguageCode(languageCode);
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `/${safeLang}/${cleanPath}`;
};

/**
 * 移除路径中的语言前缀
 * 
 * @param {string} pathname - 包含语言前缀的路径
 * @returns {string} 移除语言前缀后的路径
 * 
 * @example
 * removeLanguagePrefix('/en/trading') // '/trading'
 * removeLanguagePrefix('/zh/markets') // '/markets'
 * removeLanguagePrefix('/trading') // '/trading'
 */
export const removeLanguagePrefix = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (isValidLanguage(firstSegment)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
};

/**
 * 格式化数字显示（考虑语言环境）
 * 
 * @param {number} number - 要格式化的数字
 * @param {string} languageCode - 语言代码
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的数字字符串
 */
export const formatNumber = (number, languageCode, options = {}) => {
  const locale = languageCode === 'zh' ? 'zh-CN' : 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.warn('Number formatting failed:', error);
    return number.toString();
  }
};

/**
 * 格式化货币显示（考虑语言环境）
 * 
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @param {string} languageCode - 语言代码
 * @returns {string} 格式化后的货币字符串
 */
export const formatCurrency = (amount, currency = 'USD', languageCode) => {
  const locale = languageCode === 'zh' ? 'zh-CN' : 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.warn('Currency formatting failed:', error);
    return `${amount} ${currency}`;
  }
};

/**
 * 格式化日期显示（考虑语言环境）
 * 
 * @param {Date|string|number} date - 日期
 * @param {string} languageCode - 语言代码
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, languageCode, options = {}) => {
  const locale = languageCode === 'zh' ? 'zh-CN' : 'en-US';
  const dateObj = new Date(date);
  
  try {
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * 获取语言的文字方向
 * 
 * @param {string} languageCode - 语言代码
 * @returns {string} 文字方向 ('ltr' 或 'rtl')
 */
export const getTextDirection = (languageCode) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
};

/**
 * 生成语言选择器的选项数据
 * 
 * @returns {Array} 语言选项数组
 */
export const generateLanguageOptions = () => {
  return Object.values(SUPPORTED_LANGUAGES).map(lang => ({
    value: lang.code,
    label: lang.nativeName,
    flag: lang.flag,
    englishName: lang.name,
  }));
};

/**
 * 语言代码映射到完整的 locale 代码
 * 
 * @param {string} languageCode - 语言代码
 * @returns {string} 完整的 locale 代码
 */
export const getLocaleCode = (languageCode) => {
  const localeMap = {
    'zh': 'zh-CN',
    'en': 'en-US',
  };
  
  return localeMap[languageCode] || localeMap[DEFAULT_LANGUAGE];
};

/**
 * 检查当前环境是否支持 Intl API
 * 
 * @returns {boolean} 是否支持 Intl API
 */
export const isIntlSupported = () => {
  return typeof Intl !== 'undefined';
};

export default {
  detectBrowserLanguage,
  isValidLanguage,
  getSafeLanguageCode,
  extractLanguageFromPath,
  buildLanguagePath,
  removeLanguagePrefix,
  formatNumber,
  formatCurrency,
  formatDate,
  getTextDirection,
  generateLanguageOptions,
  getLocaleCode,
  isIntlSupported,
}; 