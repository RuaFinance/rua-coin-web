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
 * User Dashboard Sidebar Component
 * 
 * This component provides the navigation sidebar for the user dashboard.
 * Features expandable menu items with smooth animations and active state management.
 * 
 * @author chenjjiaa
 * @since 2025
 */

import {
  LayoutDashboard,
  Wallet,
  History,
  Settings,
  Shield,
  Key,
  Gift,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  CreditCard,
  FileText,
  User,
  Bell,
  ChevronLeft,
  ChevronsLeft,
  Menu
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useSidebar } from '../contexts/SidebarContext';

import LanguageAwareLink from './LanguageAware/LanguageAwareLink';


const UserSidebar = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(new Set(['assets', 'orders']));
  const { isExpanded, isMobileMode, toggleSidebar } = useSidebar();

  const toggleMenu = (menuId) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  const menuItems = [
    {
      id: 'overview',
      label: t('userDashboard.overview'),
      icon: LayoutDashboard,
      path: '/user/dashboard',
      isMain: true
    },
    {
      id: 'assets',
      label: t('userDashboard.assets'),
      icon: Wallet,
      isExpandable: true,
      subItems: [
        { label: t('userDashboard.spotAccount'), path: '/user/assets/spot', icon: TrendingUp },
        { label: t('userDashboard.futuresAccount'), path: '/user/assets/futures', icon: TrendingUp },
        { label: t('userDashboard.earnAccount'), path: '/user/assets/earn', icon: CreditCard },
        { label: t('userDashboard.fundHistory'), path: '/user/assets/history', icon: FileText }
      ]
    },
    {
      id: 'orders',
      label: t('userDashboard.orders'),
      icon: History,
      isExpandable: true,
      subItems: [
        { label: t('userDashboard.spotOrders'), path: '/user/orders/spot', icon: TrendingUp },
        { label: t('userDashboard.futuresOrders'), path: '/user/orders/futures', icon: TrendingUp },
        { label: t('userDashboard.orderHistory'), path: '/user/orders/history', icon: FileText }
      ]
    },
    {
      id: 'account',
      label: t('userDashboard.account'),
      icon: User,
      path: '/user/account',
      isMain: true
    },
    {
      id: 'security',
      label: t('userDashboard.security'),
      icon: Shield,
      path: '/user/security',
      isMain: true
    },
    {
      id: 'api',
      label: t('userDashboard.api'),
      icon: Key,
      path: '/user/api',
      isMain: true
    },
    {
      id: 'rewards',
      label: t('userDashboard.rewards'),
      icon: Gift,
      path: '/user/rewards',
      isMain: true
    },
    {
      id: 'settings',
      label: t('userDashboard.settings'),
      icon: Settings,
      isExpandable: true,
      subItems: [
        { label: t('userDashboard.preferences'), path: '/user/settings/preferences', icon: Settings },
        { label: t('userDashboard.notifications'), path: '/user/settings/notifications', icon: Bell }
      ]
    },
    {
      id: 'help',
      label: t('userDashboard.help'),
      icon: HelpCircle,
      path: '/user/help',
      isMain: true
    }
  ];

  const renderMenuItem = (item) => {
    if (item.isMain) {
      return (
        <li key={item.id} className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}>
          <LanguageAwareLink 
            to={item.path} 
            className="sidebar-nav-link"
            title={!isExpanded ? item.label : ''}
          >
            <item.icon className="sidebar-nav-icon" />
            {isExpanded && <span>{item.label}</span>}
          </LanguageAwareLink>
        </li>
      );
    }

    if (item.isExpandable) {
      const isMenuExpanded = expandedMenus.has(item.id);
      const hasActiveChild = isParentActive(item.subItems.map(sub => sub.path));
      
      // 在sidebar收起状态下，不显示可展开菜单的子项
      const shouldShowSubmenu = isExpanded && isMenuExpanded;

      return (
        <li key={item.id} className={`sidebar-nav-item ${hasActiveChild ? 'active' : ''}`}>
          <button
            onClick={() => isExpanded ? toggleMenu(item.id) : null}
            className="sidebar-nav-link w-full text-left"
            title={!isExpanded ? item.label : ''}
            disabled={!isExpanded}
          >
            <item.icon className="sidebar-nav-icon" />
            {isExpanded && (
              <>
                <span className="flex-1">{item.label}</span>
                {isMenuExpanded ? (
                  <ChevronDown className="w-4 h-4 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform" />
                )}
              </>
            )}
          </button>
          
          {shouldShowSubmenu && (
            <ul className="sidebar-submenu expanded">
              {item.subItems.map((subItem, index) => (
                <li key={index}>
                  <LanguageAwareLink
                    to={subItem.path}
                    className={`sidebar-submenu-item block ${isActive(subItem.path) ? 'active' : ''}`}
                  >
                    {subItem.label}
                  </LanguageAwareLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }
  };

  return (
    <aside className={`dashboard-sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isMobileMode ? 'mobile' : 'desktop'}`}>
      <div className="sidebar-content">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <h2 className="sidebar-title">
                {t('userDashboard.userCenter')}
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle-btn"
              title={isExpanded ? t('userDashboard.collapseSidebar') : t('userDashboard.expandSidebar')}
              aria-label={isExpanded ? t('userDashboard.collapseSidebar') : t('userDashboard.expandSidebar')}
            >
              {isExpanded ? (
                <ChevronsLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="space-y-2">
            {menuItems.map(renderMenuItem)}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="sidebar-nav-item w-full logout-btn">
            <div className="sidebar-nav-link">
              <LogOut className="sidebar-nav-icon" />
              {isExpanded && <span>{t('userDashboard.logout')}</span>}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar; 