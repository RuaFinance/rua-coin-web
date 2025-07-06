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
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 导入语言资源
import zhCommon from './locales/zh/common.json';
import zhTrading from './locales/zh/trading.json';
import zhHeader from './locales/zh/header.json';
import zhFooter from './locales/zh/footer.json';
import zhAuth from './locales/zh/auth.json';
import zhHome from './locales/zh/home.json';
import zhPages from './locales/zh/pages.json';
import zhComponents from './locales/zh/components.json';
import enCommon from './locales/en/common.json';
import enTrading from './locales/en/trading.json';
import enHeader from './locales/en/header.json';
import enFooter from './locales/en/footer.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enPages from './locales/en/pages.json';
import enComponents from './locales/en/components.json';

// 语言资源整合
const resources = {
  zh: {
    common: zhCommon,
    trading: zhTrading,
    header: zhHeader,
    footer: zhFooter,
    auth: zhAuth,
    home: zhHome,
    pages: zhPages,
    components: zhComponents,
  },
  en: {
    common: enCommon,
    trading: enTrading,
    header: enHeader,
    footer: enFooter,
    auth: enAuth,
    home: enHome,
    pages: enPages,
    components: enComponents,
  },
};

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  zh: {
    code: 'zh',
    name: '中文',
    nativeName: '中文',
    flag: '🇨🇳',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
};

// 默认语言
export const DEFAULT_LANGUAGE = 'zh';

// 从 localStorage 获取用户语言偏好
const getUserLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem('ruacoin_language');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Failed to get language from localStorage:', error);
  }
  return DEFAULT_LANGUAGE;
};

// 保存用户语言偏好
export const saveUserLanguage = (language) => {
  try {
    localStorage.setItem('ruacoin_language', language);
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
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
    
    // 回退语言
    fallbackLng: DEFAULT_LANGUAGE,
    
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
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // localStorage 键名
      lookupLocalStorage: 'ruacoin_language',
      
      // 缓存用户语言选择
      caches: ['localStorage'],
      
      // 不自动检测语言，使用用户保存的偏好
      checkWhitelist: true,
    },
    
    // 后端配置（用于按需加载）
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // 响应式配置
    react: {
      useSuspense: false, // 避免 Suspense 问题
    },
  });

// 语言切换函数
export const changeLanguage = async (language) => {
  if (!SUPPORTED_LANGUAGES[language]) {
    console.warn(`Unsupported language: ${language}`);
    return false;
  }
  
  try {
    await i18n.changeLanguage(language);
    saveUserLanguage(language);
    
    // 更新 HTML lang 属性
    document.documentElement.lang = language;
    
    // 触发自定义事件，通知其他组件语言已改变
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language } 
    }));
    
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

// 获取当前语言
export const getCurrentLanguage = () => i18n.language;

// 获取语言显示名称
export const getLanguageName = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode]?.name || languageCode;
};

// 获取语言本地名称
export const getLanguageNativeName = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode]?.nativeName || languageCode;
};

// 获取语言国旗
export const getLanguageFlag = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode]?.flag || '🌐';
};

// 检查是否为 RTL 语言
export const isRTL = (language) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(language);
};

export default i18n; 