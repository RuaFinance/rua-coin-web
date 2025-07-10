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

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Import advanced language configuration
import {
  ADVANCED_LANGUAGE_CONFIG,
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  getFallbackLanguage
} from './config/languageConfig';

// 导入英文语言资源
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enComponents from './locales/en/components.json';
import enFooter from './locales/en/footer.json';
import enHeader from './locales/en/header.json';
import enHome from './locales/en/home.json';
import enPages from './locales/en/pages.json';
import enTrading from './locales/en/trading.json';

// 导入英文印度语言资源
import enINAuth from './locales/en-IN/auth.json';
import enINCommon from './locales/en-IN/common.json';
import enINComponents from './locales/en-IN/components.json';
import enINFooter from './locales/en-IN/footer.json';
import enINHeader from './locales/en-IN/header.json';
import enINHome from './locales/en-IN/home.json';
import enINPages from './locales/en-IN/pages.json';
import enINTrading from './locales/en-IN/trading.json';

// 导入日文语言资源
import jaAuth from './locales/ja/auth.json';
import jaCommon from './locales/ja/common.json';
import jaComponents from './locales/ja/components.json';
import jaFooter from './locales/ja/footer.json';
import jaHeader from './locales/ja/header.json';
import jaHome from './locales/ja/home.json';
import jaPages from './locales/ja/pages.json';
import jaTrading from './locales/ja/trading.json';

// 导入韩文语言资源
import koAuth from './locales/ko/auth.json';
import koCommon from './locales/ko/common.json';
import koComponents from './locales/ko/components.json';
import koFooter from './locales/ko/footer.json';
import koHeader from './locales/ko/header.json';
import koHome from './locales/ko/home.json';
import koPages from './locales/ko/pages.json';
import koTrading from './locales/ko/trading.json';

// 导入简体中文语言资源
import ruAuth from './locales/ru/auth.json';
import ruCommon from './locales/ru/common.json';
import ruComponents from './locales/ru/components.json';
import ruFooter from './locales/ru/footer.json';
import ruHeader from './locales/ru/header.json';
import ruHome from './locales/ru/home.json';
import ruPages from './locales/ru/pages.json';
import ruTrading from './locales/ru/trading.json';
import zhCNAuth from './locales/zh-CN/auth.json';
import zhCNCommon from './locales/zh-CN/common.json';
import zhCNComponents from './locales/zh-CN/components.json';
import zhCNFooter from './locales/zh-CN/footer.json';
import zhCNHeader from './locales/zh-CN/header.json';
import zhCNHome from './locales/zh-CN/home.json';
import zhCNPages from './locales/zh-CN/pages.json';
import zhCNTrading from './locales/zh-CN/trading.json';

// 导入繁体中文语言资源
import zhTCAuth from './locales/zh-TC/auth.json';
import zhTCCommon from './locales/zh-TC/common.json';
import zhTCComponents from './locales/zh-TC/components.json';
import zhTCFooter from './locales/zh-TC/footer.json';
import zhTCHeader from './locales/zh-TC/header.json';
import zhTCHome from './locales/zh-TC/home.json';
import zhTCPages from './locales/zh-TC/pages.json';
import zhTCTrading from './locales/zh-TC/trading.json';

// 导入俄文语言资源

// 导入语言检测服务
import languageDetectionService, {
  initializeLanguageDetection,
  getCurrentLanguagePreference
} from './services/languageDetectionService';

// 语言资源整合 - 使用 BCP 47 标准
const resources = {
  // 简体中文 (中国)
  'zh-CN': {
    common: zhCNCommon,
    trading: zhCNTrading,
    header: zhCNHeader,
    footer: zhCNFooter,
    auth: zhCNAuth,
    home: zhCNHome,
    pages: zhCNPages,
    components: zhCNComponents,
  },
  
  // 繁体中文 (台湾/香港)
  'zh-TC': {
    common: zhTCCommon,
    trading: zhTCTrading,
    header: zhTCHeader,
    footer: zhTCFooter,
    auth: zhTCAuth,
    home: zhTCHome,
    pages: zhTCPages,
    components: zhTCComponents,
  },
  
  // 英文 (全球)
  'en': {
    common: enCommon,
    trading: enTrading,
    header: enHeader,
    footer: enFooter,
    auth: enAuth,
    home: enHome,
    pages: enPages,
    components: enComponents,
  },
  
  // 英文 (印度)
  'en-IN': {
    common: enINCommon,
    trading: enINTrading,
    header: enINHeader,
    footer: enINFooter,
    auth: enINAuth,
    home: enINHome,
    pages: enINPages,
    components: enINComponents,
  },
  
  // 日文
  'ja': {
    common: jaCommon,
    trading: jaTrading,
    header: jaHeader,
    footer: jaFooter,
    auth: jaAuth,
    home: jaHome,
    pages: jaPages,
    components: jaComponents,
  },
  
  // 韩文
  'ko': {
    common: koCommon,
    trading: koTrading,
    header: koHeader,
    footer: koFooter,
    auth: koAuth,
    home: koHome,
    pages: koPages,
    components: koComponents,
  },
  
  // 俄文
  'ru': {
    common: ruCommon,
    trading: ruTrading,
    header: ruHeader,
    footer: ruFooter,
    auth: ruAuth,
    home: ruHome,
    pages: ruPages,
    components: ruComponents,
  },
};

// 从 localStorage 获取用户语言偏好
const getUserLanguage = () => {
  try {
    const savedLanguage = getCurrentLanguagePreference();
    if (savedLanguage && SUPPORTED_LOCALES.includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Failed to get language from storage:', error);
  }
  return DEFAULT_LANGUAGE;
};

// 保存用户语言偏好
const saveUserLanguage = async (language) => {
  try {
    await languageDetectionService.saveLanguagePreference(language, 'manual');
    console.debug('Language preference saved:', language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

// i18n 配置
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 语言资源
    resources,
    
    // 默认语言
    lng: getUserLanguage(),
    
    // 回退语言链
    fallbackLng: {
      'zh-TC': ['zh-CN', 'en'],
      'en-IN': ['en'],
      'default': [DEFAULT_LANGUAGE]
    },
    
    // 调试模式（开发环境）
    debug: process.env.NODE_ENV === 'development',
    
    // 插值配置
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    
    // 命名空间配置
    defaultNS: 'common',
    ns: ['common', 'trading', 'header', 'footer', 'auth', 'home', 'pages', 'components'],
    
    // 语言检测配置
    detection: {
      // 检测顺序
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      
      // localStorage 键名 (使用新版本)
      lookupLocalStorage: 'ruacoin_language_v2',
      
      // 查询参数名称
      lookupQuerystring: 'lng',
      
      // 缓存用户语言选择
      caches: ['localStorage'],
      
      // 检查白名单
      checkWhitelist: true,
      
      // 白名单
      whitelist: SUPPORTED_LOCALES,
    },
    
    // 后端配置（用于按需加载）
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // 响应式配置
    react: {
      useSuspense: false, // 避免 Suspense 问题
      bindI18n: 'languageChanged',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    },
  });

// 语言切换函数
export const changeLanguage = async (language) => {
  if (!SUPPORTED_LOCALES.includes(language)) {
    console.warn(`Unsupported language: ${language}`);
    return false;
  }
  
  try {
    await i18n.changeLanguage(language);
    await saveUserLanguage(language);
    
    // 获取语言配置
    const config = getLanguageConfig(language);
    
    // 更新 HTML lang 属性
    document.documentElement.lang = config.htmlLang;
    
    // 更新 HTML dir 属性
    document.documentElement.dir = config.dir;
    
    // 触发自定义事件，通知其他组件语言已改变
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language, config } 
    }));
    
    // 触发高级语言变更事件
    window.dispatchEvent(new CustomEvent('advancedLanguageChanged', {
      detail: { language, config, timestamp: Date.now() }
    }));
    
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

// 获取当前语言
export const getCurrentLanguage = () => i18n.language || DEFAULT_LANGUAGE;

// 获取语言名称
export const getLanguageName = (languageCode) => {
  const config = getLanguageConfig(languageCode);
  return config.name;
};

// 获取本地语言名称
export const getLanguageNativeName = (languageCode) => {
  const config = getLanguageConfig(languageCode);
  return config.nativeName;
};

// 获取语言图标
export const getLanguageFlag = (languageCode) => {
  const config = getLanguageConfig(languageCode);
  return config.flag;
};

// 检查是否为 RTL 语言
export const isRTL = (language) => {
  const config = getLanguageConfig(language);
  return config.dir === 'rtl';
};

// 格式化数字（根据语言）
export const formatNumber = (number, language = getCurrentLanguage()) => {
  const config = getLanguageConfig(language);
  try {
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat(config.htmlLang.replace('_', '-')).format(number);
    }
  } catch (error) {
    console.warn('Number formatting failed:', error);
  }
  return number.toString();
};

// 格式化货币（根据语言和地区）
export const formatCurrency = (amount, language = getCurrentLanguage()) => {
  const config = getLanguageConfig(language);
  try {
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat(config.htmlLang.replace('_', '-'), {
        style: 'currency',
        currency: config.currency
      }).format(amount);
    }
  } catch (error) {
    console.warn('Currency formatting failed:', error);
  }
  return `${amount} ${config.currency}`;
};

// 格式化日期（根据语言）
export const formatDate = (date, language = getCurrentLanguage()) => {
  const config = getLanguageConfig(language);
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return new Intl.DateTimeFormat(config.htmlLang.replace('_', '-')).format(new Date(date));
    }
  } catch (error) {
    console.warn('Date formatting failed:', error);
  }
  return new Date(date).toLocaleDateString();
};

// 初始化语言检测服务
const initializeLanguageSystem = async () => {
  try {
    await initializeLanguageDetection();
    console.debug('Advanced language system initialized');
  } catch (error) {
    console.warn('Language system initialization failed:', error);
  }
};

// 在模块加载时初始化
initializeLanguageSystem();

// 导出配置和函数
export {
  ADVANCED_LANGUAGE_CONFIG as SUPPORTED_LANGUAGES,
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  getFallbackLanguage,
  languageDetectionService
};

export default i18n; 