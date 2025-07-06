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

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  changeLanguage, 
  getCurrentLanguage,
  getLanguageFlag,
  getLanguageNativeName 
} from '../../i18n';

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
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // 切换语言
  const handleLanguageChange = async (languageCode) => {
    try {
      const success = await changeLanguage(languageCode);
      if (success) {
        setCurrentLanguage(languageCode);
        setIsOpen(false);
        
        // 显示切换成功提示（可选）
        console.log(`Language switched to: ${getLanguageNativeName(languageCode)}`);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
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
          className="absolute right-0 mt-2 w-48 bg-[#1d1d1d] rounded-lg shadow-lg border border-[#424242] z-50 animate-in fade-in-0 zoom-in-95 duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="pt-2">
            {/* 弹窗标题 */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#424242]">
              {t('header:language')}
            </div>
            
            {/* 语言选项列表 */}
            {Object.values(SUPPORTED_LANGUAGES).map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                onKeyDown={(e) => handleKeyDown(e, language.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#3a3a3a] transition-colors duration-150 focus:outline-none focus:bg-[#3a3a3a] ${
                  currentLanguage === language.code 
                    ? 'bg-[#3a3a3a] text-white' 
                    : 'text-gray-300'
                }`}
                role="menuitem"
                aria-selected={currentLanguage === language.code}
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
                    <span className="text-xs text-gray-500">
                      {language.name}
                    </span>
                  </div>
                </div>
                
                {/* 选中状态指示器 */}
                {currentLanguage === language.code && (
                  <Check size={16} className="text-blue-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 