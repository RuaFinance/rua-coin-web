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

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { changeLanguage, getCurrentLanguage } from '../../i18n';
import { 
  extractLanguageFromPath, 
  removeLanguagePrefix, 
  getSafeLanguageCode,
  buildLanguagePath
} from '../../i18n/utils/languageUtils';

/**
 * 多语言路由增强组件
 * 
 * 功能特性：
 * - 支持多语言 URL 路径（如 /en/trading, /zh/trading）
 * - 自动检测 URL 中的语言代码
 * - 语言与路由同步
 * - 自动重定向到正确的语言路径
 * - 支持无语言前缀的默认路由
 * 
 * @component
 * @example
 * // 在 Router 中使用
 * <Router>
 *   <LanguageRouter>
 *     <Routes>
 *       <Route path="/" element={<HomePage />} />
 *       <Route path="/trading" element={<TradingPage />} />
 *     </Routes>
 *   </LanguageRouter>
 * </Router>
 */
const LanguageRouter = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageRouting = async () => {
      const currentPath = location.pathname;
      const urlLanguage = extractLanguageFromPath(currentPath);
      const currentLanguage = getCurrentLanguage();

      // 如果 URL 包含语言代码
      if (urlLanguage) {
        // 如果 URL 语言与当前语言不同，切换语言
        if (urlLanguage !== currentLanguage) {
          await changeLanguage(urlLanguage);
        }
      } else {
        // 如果 URL 不包含语言代码，根据当前语言重定向
        const newPath = buildLanguagePath(currentPath, currentLanguage);
        
        // 避免无限重定向
        if (newPath !== currentPath) {
          navigate(newPath, { replace: true });
        }
      }
    };

    handleLanguageRouting();
  }, [location.pathname, navigate, i18n]);

  // 监听语言变化，更新 URL
  useEffect(() => {
    const handleLanguageChange = (event) => {
      const newLanguage = event.detail?.language || getCurrentLanguage();
      const currentPath = location.pathname;
      const urlLanguage = extractLanguageFromPath(currentPath);
      
      // 如果当前路径已经包含语言代码
      if (urlLanguage && urlLanguage !== newLanguage) {
        const pathWithoutLanguage = removeLanguagePrefix(currentPath);
        const newPath = buildLanguagePath(pathWithoutLanguage, newLanguage);
        navigate(newPath, { replace: true });
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [location.pathname, navigate]);

  return children;
};

export default LanguageRouter; 