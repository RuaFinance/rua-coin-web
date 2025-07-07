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
 * Sidebar Context
 * 
 * This context manages the sidebar's expand/collapse state and mobile responsive behavior.
 * Features:
 * - Global sidebar state management
 * - Mobile detection and auto-collapse on mobile devices
 * - Toggle functionality for sidebar expand/collapse
 * - Responsive breakpoint handling
 * 
 * @author chenjjiaa
 * @since 2025
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const { isMobile, isTablet, screenWidth } = useMobileDetection();
  
  // Sidebar状态：true为展开，false为收起
  const [isExpanded, setIsExpanded] = useState(true);
  
  // 是否为移动端模式（小于768px或移动设备）
  const isMobileMode = isMobile || screenWidth < 768;
  
  // 是否为平板模式（768px-1024px或平板设备）
  const isTabletMode = isTablet || (screenWidth >= 768 && screenWidth < 1024);
  
  // 移动端默认收起sidebar
  useEffect(() => {
    if (isMobileMode) {
      setIsExpanded(false);
    } else if (!isMobileMode && !isTabletMode) {
      // 桌面端默认展开
      setIsExpanded(true);
    }
  }, [isMobileMode, isTabletMode]);
  
  // 切换sidebar状态
  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };
  
  // 强制展开sidebar
  const expandSidebar = () => {
    setIsExpanded(true);
  };
  
  // 强制收起sidebar
  const collapseSidebar = () => {
    setIsExpanded(false);
  };
  
  // 获取sidebar宽度（用于CSS变量或计算）
  const getSidebarWidth = () => {
    if (!isExpanded) return 0;
    if (isMobileMode) return 280; // 移动端全宽
    if (isTabletMode) return 240; // 平板端适中宽度
    return 280; // 桌面端标准宽度
  };
  
  const value = {
    // 状态
    isExpanded,
    isMobileMode,
    isTabletMode,
    
    // 操作
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
    
    // 工具函数
    getSidebarWidth,
    
    // 设备信息
    screenWidth
  };
  
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext; 