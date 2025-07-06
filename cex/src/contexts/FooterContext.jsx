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
 * FooterContext - Footer状态管理上下文
 * 
 * 提供Footer的全局状态管理，包括：
 * - 显示/隐藏状态控制
 * - Footer类型管理（完整版/简化版/隐藏）
 * - 基于路由的自动显示逻辑
 * - 手动控制接口
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { shouldHideFooter, shouldShowSimplifiedFooter } from '../config/FooterConfig';

const FooterContext = createContext();

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};

export const FooterProvider = ({ children }) => {
  const [showFooter, setShowFooter] = useState(true);
  const [footerType, setFooterType] = useState('full'); // 'full', 'simplified', 'hidden'
  const location = useLocation();

  useEffect(() => {
    const hideFooter = shouldHideFooter(location.pathname);
    const simplifiedFooter = shouldShowSimplifiedFooter(location.pathname);
    
    if (hideFooter) {
      setShowFooter(false);
      setFooterType('hidden');
    } else if (simplifiedFooter) {
      setShowFooter(true);
      setFooterType('simplified');
    } else {
      setShowFooter(true);
      setFooterType('full');
    }
  }, [location.pathname]);

  const value = {
    showFooter,
    setShowFooter,
    footerType,
    setFooterType,
    shouldHideFooter,
    shouldShowSimplifiedFooter
  };

  return (
    <FooterContext.Provider value={value}>
      {children}
    </FooterContext.Provider>
  );
}; 