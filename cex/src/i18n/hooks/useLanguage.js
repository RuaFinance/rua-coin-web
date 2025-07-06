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

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SUPPORTED_LANGUAGES, 
  changeLanguage, 
  getCurrentLanguage,
  getLanguageName,
  getLanguageNativeName,
  getLanguageFlag,
  isRTL 
} from '../index';

/**
 * 自定义语言 Hook
 * 
 * 提供语言相关的状态管理和操作函数，包括：
 * - 当前语言状态
 * - 语言切换函数
 * - 语言信息获取
 * - RTL 支持检测
 * 
 * @returns {Object} 语言相关的状态和方法
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const { 
 *     currentLanguage, 
 *     supportedLanguages, 
 *     changeLanguage, 
 *     isRTL,
 *     t 
 *   } = useLanguage();
 * 
 *   return (
 *     <div>
 *       <p>{t('welcome')}</p>
 *       <button onClick={() => changeLanguage('en')}>
 *         Switch to English
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getCurrentLanguage());
    };

    // 监听 i18n 语言变化事件
    i18n.on('languageChanged', handleLanguageChange);
    
    // 监听自定义语言变化事件
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // 语言切换函数
  const handleChangeLanguage = async (languageCode) => {
    if (isChanging) return false;
    
    setIsChanging(true);
    
    try {
      const success = await changeLanguage(languageCode);
      if (success) {
        setCurrentLanguage(languageCode);
      }
      return success;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    } finally {
      setIsChanging(false);
    }
  };

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.zh;
  };

  // 检查是否为支持的语言
  const isSupportedLanguage = (languageCode) => {
    return Boolean(SUPPORTED_LANGUAGES[languageCode]);
  };

  // 格式化语言显示名称
  const formatLanguageName = (languageCode, format = 'native') => {
    switch (format) {
      case 'native':
        return getLanguageNativeName(languageCode);
      case 'english':
        return getLanguageName(languageCode);
      case 'flag':
        return getLanguageFlag(languageCode);
      case 'full':
        return `${getLanguageFlag(languageCode)} ${getLanguageNativeName(languageCode)}`;
      default:
        return getLanguageNativeName(languageCode);
    }
  };

  return {
    // 状态
    currentLanguage,
    isChanging,
    isRTL: isRTL(currentLanguage),
    
    // 语言信息
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguageInfo: getCurrentLanguageInfo(),
    
    // 方法
    changeLanguage: handleChangeLanguage,
    isSupportedLanguage,
    formatLanguageName,
    
    // i18n 相关
    t,
    i18n,
    
    // 工具函数
    getLanguageName,
    getLanguageNativeName,
    getLanguageFlag,
  };
};

/**
 * 简化版语言 Hook
 * 
 * 提供最基本的语言功能，适用于简单场景
 * 
 * @returns {Object} 简化的语言状态和方法
 */
export const useSimpleLanguage = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  return {
    language: currentLanguage,
    setLanguage: changeLanguage,
    t,
  };
};

export default useLanguage; 