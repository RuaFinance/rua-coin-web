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
 * User Dashboard Layout Component
 * 
 * This component provides the main layout structure for all user dashboard pages.
 * Features a collapsible sidebar navigation with mobile-responsive behavior
 * and overlay functionality for mobile devices.
 * 
 * @author chenjjiaa
 * @since 2025
 */

import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserSidebar from '../components/UserSidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';
import '../styles/userDashboard.css';

const UserLayoutContent = () => {
  const { t } = useTranslation('common');
  const { isExpanded, isMobileMode, collapseSidebar, expandSidebar } = useSidebar();
  
  // 悬浮球拖动相关状态
  const [fabPosition, setFabPosition] = useState({ x: 14, y: 72 }); // 初始位置
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 }); // 触摸起始位置
  const fabRef = useRef(null);
  
  // 移动端点击overlay时收起sidebar
  const handleOverlayClick = () => {
    if (isMobileMode && isExpanded) {
      collapseSidebar();
    }
  };
  
  // 悬浮按钮点击事件
  const handleFabClick = (e) => {
    // 如果发生了拖动，不触发点击
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // 检查是否有移动记录（表示可能发生了拖动）
    if (touchStart.x !== 0 || touchStart.y !== 0) {
      // 有移动记录但没有设置为拖动状态，说明是轻微移动或快速点击
      // 重置状态后正常处理点击
      setTouchStart({ x: 0, y: 0 });
      setDragStart({ x: 0, y: 0 });
    }
    
    expandSidebar();
  };
  
  // 鼠标按下
  const handleMouseDown = (e) => {
    // 只处理左键点击
    if (e.button !== 0) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = fabRef.current.getBoundingClientRect();
    
    // 记录鼠标起始位置
    setTouchStart({
      x: e.clientX,
      y: e.clientY
    });
    
    // 记录拖动偏移量
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // 触摸开始
  const handleTouchStart = (e) => {
    // 只处理单指触摸
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const rect = fabRef.current.getBoundingClientRect();
    
    // 记录触摸起始位置（屏幕坐标）
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    
    // 记录拖动偏移量
    setDragStart({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };
  
  // 拖动移动
  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const fabSize = 43; // 悬浮球大小
    
    // 计算新位置，确保不超出屏幕边界
    let newX = clientX - dragStart.x;
    let newY = clientY - dragStart.y;
    
    // 边界检查
    newX = Math.max(0, Math.min(newX, windowWidth - fabSize));
    newY = Math.max(0, Math.min(newY, windowHeight - fabSize));
    
    setFabPosition({ x: newX, y: newY });
  };
  

  
  // 拖动结束
  const handleDragEnd = () => {
    // 如果发生了拖动，自动吸附回左侧
    if (isDragging) {
      const windowHeight = window.innerHeight;
      const fabSize = 43;
      const leftMargin = 14; // 左侧边距
      
      setFabPosition(prev => ({
        x: leftMargin, // 始终回到左侧
        y: Math.max(0, Math.min(prev.y, windowHeight - fabSize))
      }));
    }
    
    // 重置所有状态
    setIsDragging(false);
    setTouchStart({ x: 0, y: 0 });
    setDragStart({ x: 0, y: 0 });
  };
  
  // 添加全局事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // 如果还未开始拖动，检查移动距离
      if (!isDragging) {
        const deltaX = Math.abs(e.clientX - touchStart.x);
        const deltaY = Math.abs(e.clientY - touchStart.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // 移动距离超过阈值才开始拖动
        if (distance > 5) {
          setIsDragging(true);
        } else {
          return;
        }
      }
      
      // 开始拖动后处理移动
      handleMove(e.clientX, e.clientY);
    };

    const handleGlobalTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      // 如果还未开始拖动，检查移动距离
      if (!isDragging) {
        const deltaX = Math.abs(touch.clientX - touchStart.x);
        const deltaY = Math.abs(touch.clientY - touchStart.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // 移动距离超过阈值才开始拖动
        if (distance > 10) {
          setIsDragging(true);
        } else {
          return;
        }
      }
      
      // 开始拖动后处理移动
      handleMove(touch.clientX, touch.clientY);
    };
    
    // 只有当鼠标/触摸按下时才添加移动监听
    if (touchStart.x !== 0 || touchStart.y !== 0) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleGlobalTouchMove);
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragStart, touchStart]);
  
  // 重置悬浮球位置（当屏幕旋转或窗口大小改变时）
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const fabSize = 43;
      
      setFabPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, windowWidth - fabSize)),
        y: Math.max(0, Math.min(prev.y, windowHeight - fabSize))
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="dashboard-container flex relative">
      {/* Sidebar */}
      <UserSidebar />
      
      {/* Mobile FAB - 只在移动端且sidebar收起时显示 */}
      {isMobileMode && !isExpanded && (
        <button
          ref={fabRef}
          onClick={handleFabClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleDragEnd}
          className={`mobile-sidebar-fab ${!isExpanded ? 'show' : 'hide'} ${isDragging ? 'dragging' : ''}`}
          style={{
            left: `${fabPosition.x}px`,
            top: `${fabPosition.y}px`,
            position: 'fixed'
          }}
          aria-label={t('userDashboard.expandSidebar')}
          title={t('userDashboard.expandSidebar')}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      
      {/* Mobile Overlay - 只在移动端且sidebar展开时显示 */}
      {isMobileMode && isExpanded && (
        <div 
          className="dashboard-mobile-overlay"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      {/* Main Content Area */}
      <main className={`dashboard-main ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const UserLayout = () => {
  return (
    <SidebarProvider>
      <UserLayoutContent />
    </SidebarProvider>
  );
};

export default UserLayout; 