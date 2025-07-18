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

import { Globe, Check, ChevronDown, Search } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { 
  SUPPORTED_LANGUAGES, 
  changeLanguage, 
  getCurrentLanguage,
  getLanguageFlag,
  getLanguageNativeName
} from '../../i18n';
import { extractLocaleFromPath, removeLocaleFromPath } from '../../router/languageRouter';

/**
 * 语言切换组件
 * 
 * 功能特性：
 * - 支持 icon + 弹窗方式切换语言
 * - 运行时动态切换语言
 * - 语言设置持久化到 localStorage
 * - 响应式设计，适配移动端
 * - 支持键盘导航
 * - 平滑的动画效果
 * 
 * @component
 * @example
 * // 基本使用
 * <LanguageSwitcher />
 * 
 * // 自定义样式
 * <LanguageSwitcher className="custom-class" />
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { t, i18n } = useTranslation(['common', 'header']);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionRefs = useRef([]);

  // 从URL路径中获取当前语言，而不是从i18n状态
  const getCurrentLanguageFromURL = () => {
    const langFromURL = extractLocaleFromPath(location.pathname);
    return langFromURL || getCurrentLanguage();
  };

  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguageFromURL());

  // 监听URL变化来更新当前语言
  useEffect(() => {
    const newLanguage = getCurrentLanguageFromURL();
    if (newLanguage !== currentLanguage) {
      setCurrentLanguage(newLanguage);
    }
  }, [location.pathname]);

  // 监听语言变化事件
  useEffect(() => {
    const handleLanguageChange = () => {
      // 从URL获取最新语言，而不是从i18n状态
      const newLanguage = getCurrentLanguageFromURL();
      setCurrentLanguage(newLanguage);
    };

    // 监听 i18n 语言变化事件
    i18n.on('languageChanged', handleLanguageChange);
    
    // 监听自定义语言变化事件
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [i18n, location.pathname]);

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // ESC 键关闭弹窗
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm(''); // 清空搜索
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // 聚焦搜索框
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // 关闭下拉框时清空搜索
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // 搜索词改变时重置高亮索引
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // 过滤语言列表
  const getFilteredLanguages = () => {
    if (!searchTerm.trim()) {
      return Object.values(SUPPORTED_LANGUAGES);
    }
    
    const term = searchTerm.toLowerCase();
    return Object.values(SUPPORTED_LANGUAGES).filter(language =>
      (language.name && language.name.toLowerCase().includes(term)) ||
      (language.nativeName && language.nativeName.toLowerCase().includes(term)) ||
      (language.region && language.region.toLowerCase().includes(term)) ||
      (language.code && language.code.toLowerCase().includes(term))
    );
  };

  // 切换语言
  const handleLanguageChange = async (languageCode) => {
    try {
      // 防止重复切换
      if (languageCode === currentLanguage) {
        setIsOpen(false);
        return;
      }

      // 获取当前路径信息
      const currentPath = location.pathname;
      const pathWithoutLocale = removeLocaleFromPath(currentPath);
      
      const success = await changeLanguage(languageCode);
      if (success) {
        setCurrentLanguage(languageCode);
        setIsOpen(false);
        setSearchTerm(''); // 清空搜索
        
        // 触发包含路径信息的语言切换事件
        window.dispatchEvent(new CustomEvent('languageSwitcherChanged', {
          detail: {
            language: languageCode,
            currentPath: currentPath,
            pathWithoutLocale: pathWithoutLocale,
            source: 'language_switcher'
          }
        }));
        
        console.log(`Language switched to: ${getLanguageNativeName(languageCode)}`);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // 搜索框键盘导航支持
  const handleSearchKeyDown = (event) => {
    const filteredLanguages = getFilteredLanguages();
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = prev < filteredLanguages.length - 1 ? prev + 1 : 0;
          // 滚动到视图内
          setTimeout(() => {
            optionRefs.current[newIndex]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }, 0);
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : filteredLanguages.length - 1;
          // 滚动到视图内
          setTimeout(() => {
            optionRefs.current[newIndex]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }, 0);
          return newIndex;
        });
        break;
        
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredLanguages.length) {
          handleLanguageChange(filteredLanguages[highlightedIndex].code);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
        
      default:
        // 对于其他键，重置高亮索引
        if (event.key.length === 1) {
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  // 键盘导航支持
  const handleKeyDown = (event, languageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(languageCode);
    }
  };

  // 获取当前语言信息
  const currentLangInfo = SUPPORTED_LANGUAGES[currentLanguage];

  return (
    <>
      {/* 自定义滚动条样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .language-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .language-scrollbar::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 3px;
          }
          .language-scrollbar::-webkit-scrollbar-thumb {
            background: #4a4a4a;
            border-radius: 3px;
          }
          .language-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #5a5a5a;
          }
        `
      }} />
      
      <div className={`relative ${className}`}>
        {/* 语言切换按钮 */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 rounded-md hover:bg-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label={t('header:language')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* 地球图标 */}
        <Globe size={18} className="text-gray-400" />
        
        {/* 当前语言标识 */}
        <span className="hidden sm:inline-block text-sm font-medium">
          {currentLangInfo?.flag} {currentLangInfo?.nativeName}
        </span>
        
        {/* 仅在移动端显示旗帜 */}
        <span className="sm:hidden text-lg">
          {currentLangInfo?.flag}
        </span>
        
        {/* 下拉箭头 */}
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 语言选择弹窗 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 bg-[#1d1d1d] rounded-lg shadow-lg border border-[#424242] z-50 animate-in fade-in-0 zoom-in-95 duration-200"
          style={{ width: '220px' }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="pt-2">
            {/* 弹窗标题 */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#424242]">
              {t('header:language')}
            </div>
            
            {/* 搜索框 */}
            <div className="p-3 border-b border-[#424242]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t('header:searchLanguages')}
                  className="block pl-10 pr-3 text-sm bg-white border 
                  border-[#424242] rounded-md text-black placeholder-gray-400 focus:outline-none"
                  style={{ width: '195px', height: '30px' }}
                />
              </div>
            </div>
            
            {/* 语言选项列表 */}
            <div 
              className="max-h-48 overflow-y-auto language-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4a4a4a #2a2a2a'
              }}
            >
              {(() => {
                // 清理旧的refs
                optionRefs.current = [];
                const filteredLanguages = getFilteredLanguages();
                return filteredLanguages.length > 0 ? (
                filteredLanguages.map((language, index) => (
                  <button
                    key={language.code}
                    ref={(el) => (optionRefs.current[index] = el)}
                    onClick={() => handleLanguageChange(language.code)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onKeyDown={(e) => handleKeyDown(e, language.code)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors duration-150 focus:outline-none ${
                      currentLanguage === language.code
                        ? 'bg-[#1d1d1d] text-[#efb90b]' 
                        : highlightedIndex === index
                        ? 'bg-[#3a3a3a] text-white'
                        : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                    }`}
                    role="menuitem"
                    aria-selected={currentLanguage === language.code}
                    aria-highlighted={highlightedIndex === index}
                  >
                    <div className="flex items-center space-x-3">
                      {/* 语言旗帜 */}
                      <span className="text-lg flex-shrink-0">
                        {language.flag}
                      </span>
                      
                      {/* 语言名称 */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {language.nativeName}
                        </span>
                        <span className={`text-xs ${
                          currentLanguage === language.code
                            ? 'text-[#efb90b] opacity-75'
                            : 'text-gray-500'
                        }`}>
                          {language.name}
                        </span>
                      </div>
                    </div>
                    
                    {/* 选中状态指示器 */}
                    {currentLanguage === language.code && (
                      <Check size={16} className="text-[#efb90b] flex-shrink-0" />
                    )}
                  </button>
                ))
                ) : (
                  <div className="px-4 py-3 text-center text-sm text-gray-400">
                    {t('header:noLanguagesFound')}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default LanguageSwitcher; 