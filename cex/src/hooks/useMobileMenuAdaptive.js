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

import { useState, useEffect, useCallback, useRef } from 'react';
import useScreenSize from './useScreenSize';

/**
 * 自定义Hook用于管理移动端菜单的自适应功能
 * @param {boolean} isMenuOpen - 菜单是否打开
 * @param {Array} allMenuItems - 所有菜单项配置
 * @returns {Object} 包含自适应相关状态和方法的对象
 */
const useMobileMenuAdaptive = (isMenuOpen, allMenuItems) => {
  const screenSize = useScreenSize();
  
  // 自适应状态
  const [availableMenuHeight, setAvailableMenuHeight] = useState(0);
  const [visibleMenuItems, setVisibleMenuItems] = useState([]);
  const [isMenuScrollable, setIsMenuScrollable] = useState(false);
  const [menuContainerHeight, setMenuContainerHeight] = useState(0);
  
  // DOM引用
  const mobileMenuRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileHeaderRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileFooterRef = useRef(null);

  // 计算可用菜单高度
  const calculateAvailableHeight = useCallback(() => {
    if (!mobileMenuRef.current) return;
    
    const headerHeight = mobileHeaderRef.current?.offsetHeight || 0;
    const searchHeight = mobileSearchRef.current?.offsetHeight || 0;
    const footerHeight = mobileFooterRef.current?.offsetHeight || 0;
    
    // 预留空间给padding、border和间距
    const reservedSpace = 48; // 24px * 2 for padding and borders
    const availableHeight = screenSize.height - headerHeight - searchHeight - footerHeight - reservedSpace;
    
    const calculatedHeight = Math.max(availableHeight, 200); // 最小高度200px
    setAvailableMenuHeight(calculatedHeight);
    setMenuContainerHeight(screenSize.height - 64); // 64px是header高度
  }, [screenSize.height]);

  // 动态调整可见菜单项
  const adjustVisibleMenuItems = useCallback(() => {
    if (availableMenuHeight <= 0) return;
    
    let totalHeight = 0;
    const visibleItems = [];
    
    // 估算每个菜单项的高度
    const estimatedItemHeight = 48; // 基础菜单项高度
    const estimatedSubItemHeight = 36; // 子菜单项高度
    const estimatedSpacing = 4; // 菜单项间距
    
    for (let i = 0; i < allMenuItems.length; i++) {
      const item = allMenuItems[i];
      let itemHeight = estimatedItemHeight + estimatedSpacing;
      
      // 如果是可展开的菜单项且当前是展开状态，加上子菜单高度
      if (item.isExpandable && item.isExpanded) {
        const subItemsHeight = (item.subItems?.length || 0) * estimatedSubItemHeight;
        itemHeight += subItemsHeight;
      }
      
      if (totalHeight + itemHeight <= availableMenuHeight) {
        visibleItems.push(item);
        totalHeight += itemHeight;
      } else {
        // 如果空间不够，标记为可滚动
        setIsMenuScrollable(true);
        break;
      }
    }
    
    setVisibleMenuItems(visibleItems);
    
    // 如果所有菜单项都能显示，则不需要滚动
    if (visibleItems.length === allMenuItems.length) {
      setIsMenuScrollable(false);
    }
  }, [availableMenuHeight, allMenuItems]);

  // 监听屏幕尺寸和菜单状态变化
  useEffect(() => {
    if (isMenuOpen) {
      // 延迟计算以确保DOM已更新
      const timer = setTimeout(() => {
        calculateAvailableHeight();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen, screenSize.height]);

  // 当可用高度变化时调整可见菜单项
  useEffect(() => {
    if (isMenuOpen && availableMenuHeight > 0) {
      adjustVisibleMenuItems();
    }
  }, [availableMenuHeight, isMenuOpen, allMenuItems]);

  // 获取菜单项高度估算
  const getEstimatedItemHeight = useCallback((item) => {
    const baseHeight = 48;
    const spacing = 4;
    
    if (item.isExpandable && item.isExpanded) {
      const subItemsHeight = (item.subItems?.length || 0) * 36;
      return baseHeight + subItemsHeight + spacing;
    }
    
    return baseHeight + spacing;
  }, []);

  // 检查菜单是否需要滚动
  const checkMenuScrollability = useCallback(() => {
    if (!mobileNavRef.current) return false;
    
    const navContainer = mobileNavRef.current;
    const scrollHeight = navContainer.scrollHeight;
    const clientHeight = navContainer.clientHeight;
    
    return scrollHeight > clientHeight;
  }, []);

  // 强制重新计算（用于外部调用）
  const recalculateMenu = useCallback(() => {
    if (isMenuOpen) {
      calculateAvailableHeight();
    }
  }, [isMenuOpen, calculateAvailableHeight]);

  return {
    // 状态
    availableMenuHeight,
    visibleMenuItems,
    isMenuScrollable,
    menuContainerHeight,
    screenSize,
    
    // 引用
    mobileMenuRef,
    mobileNavRef,
    mobileHeaderRef,
    mobileSearchRef,
    mobileFooterRef,
    
    // 方法
    calculateAvailableHeight,
    adjustVisibleMenuItems,
    getEstimatedItemHeight,
    checkMenuScrollability,
    recalculateMenu,
  };
};

export default useMobileMenuAdaptive; 