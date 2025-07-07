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

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserSidebar from '../components/UserSidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';
import '../styles/userDashboard.css';

const UserLayoutContent = () => {
  const { t } = useTranslation('common');
  const { isExpanded, isMobileMode, collapseSidebar, expandSidebar } = useSidebar();
  
  // 移动端点击overlay时收起sidebar
  const handleOverlayClick = () => {
    if (isMobileMode && isExpanded) {
      collapseSidebar();
    }
  };
  
  // 悬浮按钮点击事件
  const handleFabClick = () => {
    expandSidebar();
  };
  
  return (
    <div className="dashboard-container flex relative">
      {/* Sidebar */}
      <UserSidebar />
      
      {/* Mobile FAB - 只在移动端且sidebar收起时显示 */}
      {isMobileMode && !isExpanded && (
        <button
          onClick={handleFabClick}
          className={`mobile-sidebar-fab ${!isExpanded ? 'show' : 'hide'}`}
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