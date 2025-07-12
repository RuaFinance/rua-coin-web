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

import { DownOutlined } from '@ant-design/icons';
import { Menu, X, User, Bell, Search, ChevronDown, ChevronRight, TrendingUp, CreditCard, FileText, Shield, Key, Gift, HelpCircle, LogOut } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LanguageAwareLink from './LanguageAware/LanguageAwareLink';
import { useLocalizedNavigation, useCurrentLocale } from './LanguageRouter/AdvancedLanguageRouter';
import LanguageSwitcher from './LanguageSwitcher';
import useMobileMenuAdaptive from '../hooks/useMobileMenuAdaptive';

const Header = () => {
  const { t } = useTranslation(['common', 'header']);
  
  // Header 间距配置 - 统一管理所有间距
  const headerSpacing = {
    // 主要导航区域间距
    navLeftMargin: 'md:ml-5',        // 导航与logo的间距 (从ml-8改为ml-6)
    navItemsSpacing: 'md:space-x-1', // 导航项之间的间距 (从space-x-8改为space-x-6)
    
    // 搜索框区域间距
    searchBoxMargin: 'ml-auto mr-4', // 搜索框左右margin (ml-auto让搜索框向右靠拢)
    searchBoxMaxWidth: 'max-w-[260px]', // 搜索框最大宽度设为270px
    searchClearButtonColor: 'text-gray-400 hover:text-gray-700', // 清除按钮颜色
    searchTextColor: 'text-white', // 搜索框文本颜色
    
    // 右侧区域间距
    rightSideSpacing: 'space-x-2',   // 右侧元素间距
    
    // 移动端间距
    mobileNavSpacing: 'space-y-1',   // 移动端导航项间距
    mobileButtonSpacing: 'space-x-2', // 移动端按钮间距
  };
  
  // 菜单状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSpotItemsMenuOpen, setIsSpotItemsMenuOpen] = useState(false);
  const [isTradeMenuOpen, setIsTradeMenuOpen] = useState(false);
  const [isEarnMenuOpen, setIsEarnMenuOpen] = useState(false); // 新增理财菜单状态
  const [isMobileTradeExpanded, setIsMobileTradeExpanded] = useState(true); // 移动端交易菜单展开状态
  const [isMobileAssetsExpanded, setIsMobileAssetsExpanded] = useState(false); // 移动端资产菜单展开状态
  const [isMobileOrdersExpanded, setIsMobileOrdersExpanded] = useState(false); // 移动端订单菜单展开状态

  // 现货交易对数据
  const [spotTradingPairs, setSpotTradingPairs] = useState([]);
  const [isLoadingSpotPairs, setIsLoadingSpotPairs] = useState(true);

  // 搜索功能相关
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hotSearches, setHotSearches] = useState([]);
  const [isLoadingHotSearches, setIsLoadingHotSearches] = useState(true);
  const [searchHistory, setSearchHistory] = useState(() => {
    // 初始化时从localStorage读取历史
    try {
      const data = localStorage.getItem('ruacoin_search_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // 路由导航
  const { navigateLocalized } = useLocalizedNavigation();
  const { locale } = useCurrentLocale();

  // 移动端菜单项配置 - 使用useMemo优化性能
  const mobileMenuItems = useMemo(() => [
    {
      id: 'trade',
      label: t('header:trade'),
      icon: TrendingUp,
      isExpandable: true,
      isExpanded: isMobileTradeExpanded,
      onToggle: () => setIsMobileTradeExpanded(!isMobileTradeExpanded),
      subItems: [
        { 
          label: t('header:spot'), 
          path: '/trading/BTCUSDT', 
          icon: TrendingUp,
          color: 'bg-blue-500'
        },
        { 
          label: '法币便捷买币', 
          path: `/${locale}/crypto/buy/USD/USDT`, 
          icon: CreditCard,
          color: 'bg-green-500'
        },
        { 
          label: 'C2C', 
          path: '/trade/c2c/USDT?fiat=USD', 
          icon: FileText,
          color: 'bg-purple-500'
        }
      ]
    },
    // {
    //   id: 'futures',
    //   label: t('header:futures'),
    //   icon: TrendingUp,
    //   path: '/todo'
    // },
    {
      id: 'assets',
      label: t('header:assets'),
      icon: CreditCard,
      path: '/user/assets/spot'
    },
    // {
    //   id: 'earn',
    //   label: t('header:earn'),
    //   icon: Gift,
    //   path: '/todo'
    // },
    {
      id: 'account',
      label: t('common:userDashboard.account'),
      icon: User,
      path: '/user/account'
    },
    // {
    //   id: 'security',
    //   label: t('common:userDashboard.security'),
    //   icon: Shield,
    //   path: '/user/security'
    // }
  ], [t, locale, isMobileTradeExpanded]);

  // 使用自适应Hook
  const {
    availableMenuHeight,
    visibleMenuItems,
    isMenuScrollable,
    menuContainerHeight,
    screenSize,
    mobileMenuRef,
    mobileNavRef,
    mobileHeaderRef,
    mobileSearchRef,
    mobileFooterRef,
    recalculateMenu,
  } = useMobileMenuAdaptive(isMenuOpen, mobileMenuItems);

  // Mock现货交易对数据
  const fetchSpotTradingPairs = async () => {
    try {
      setIsLoadingSpotPairs(true);
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock数据 - 这里将来会替换为真实的API调用
      const mockData = [
        { id: 1, symbol: 'BTC', baseCurrency: 'BTC', quoteCurrency: 'USDT', pair: 'BTC/USDT', isActive: true },
        { id: 2, symbol: 'ETH', baseCurrency: 'ETH', quoteCurrency: 'USDT', pair: 'ETH/USDT', isActive: true },
        { id: 3, symbol: 'BNB', baseCurrency: 'BNB', quoteCurrency: 'USDT', pair: 'BNB/USDT', isActive: true },
        { id: 4, symbol: 'ADA', baseCurrency: 'ADA', quoteCurrency: 'USDT', pair: 'ADA/USDT', isActive: true },
        { id: 5, symbol: 'SOL', baseCurrency: 'SOL', quoteCurrency: 'USDT', pair: 'SOL/USDT', isActive: true },
        { id: 6, symbol: 'DOT', baseCurrency: 'DOT', quoteCurrency: 'USDT', pair: 'DOT/USDT', isActive: true },
        { id: 7, symbol: 'MATIC', baseCurrency: 'MATIC', quoteCurrency: 'USDT', pair: 'MATIC/USDT', isActive: true },
        { id: 8, symbol: 'LINK', baseCurrency: 'LINK', quoteCurrency: 'USDT', pair: 'LINK/USDT', isActive: true },
      ];
      
      setSpotTradingPairs(mockData);
    } catch (error) {
      console.error('Failed to fetch spot trading pairs:', error);
      // 设置默认数据作为fallback
      setSpotTradingPairs([
        { id: 1, symbol: 'BTC', baseCurrency: 'BTC', quoteCurrency: 'USDT', pair: 'BTC/USDT', isActive: true },
        { id: 2, symbol: 'ETH', baseCurrency: 'ETH', quoteCurrency: 'USDT', pair: 'ETH/USDT', isActive: true },
      ]);
    } finally {
      setIsLoadingSpotPairs(false);
    }
  };

  // Mock热门搜索数据
  const fetchHotSearches = async () => {
    try {
      setIsLoadingHotSearches(true);
      
      // Mock热门搜索数据
      const mockHotSearches = [
        { id: 1, symbol: 'BTC', pair: 'BTC/USDT', type: 'spot', isHot: true },
        { id: 2, symbol: 'ETH', pair: 'ETH/USDT', type: 'spot', isHot: true },
        { id: 3, symbol: 'BNB', pair: 'BNB/USDT', type: 'spot', isHot: true },
        { id: 4, symbol: 'SOL', pair: 'SOL/USDT', type: 'spot', isHot: true },
        { id: 5, symbol: 'ADA', pair: 'ADA/USDT', type: 'spot', isHot: true },
        { id: 6, symbol: 'DOT', pair: 'DOT/USDT', type: 'spot', isHot: true },
        { id: 7, symbol: 'MATIC', pair: 'MATIC/USDT', type: 'spot', isHot: true },
        { id: 8, symbol: 'LINK', pair: 'LINK/USDT', type: 'spot', isHot: true },
      ];
      
      setHotSearches(mockHotSearches);
    } catch (error) {
      console.error('Failed to fetch hot searches:', error);
      setHotSearches([]);
    } finally {
      setIsLoadingHotSearches(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchSpotTradingPairs();
    fetchHotSearches();
  }, []);

  // 添加历史
  const addToSearchHistory = (keyword) => {
    if (!keyword) return;
    setSearchHistory(prev => {
      const newArr = [keyword, ...prev.filter(item => item !== keyword)].slice(0, 10);
      localStorage.setItem('ruacoin_search_history', JSON.stringify(newArr));
      return newArr;
    });
  };

  // 判断当前输入内容是否能匹配到热门搜索
  const isSearchValueMatch = (val) => {
    if (!val) return false;
    return hotSearches.some(item =>
      item.pair.toLowerCase().includes(val.toLowerCase()) ||
      item.symbol.toLowerCase().includes(val.toLowerCase())
    );
  };

  // 点击菜单栏外自动关闭菜单栏（现在有遮罩层，不需要额外处理）
  useEffect(() => {
    if (!isMenuOpen) return;
    
    // 阻止body滚动
    document.body.style.overflow = 'hidden';
    
    return () => {
      // 恢复body滚动
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // 点击外部区域关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen) {
        // 检查点击是否在用户菜单区域外
        const userMenuElement = event.target.closest('.user-menu-container');
        if (!userMenuElement) {
          setIsUserMenuOpen(false);
        }
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // 当菜单展开状态变化时重新计算
  useEffect(() => {
    if (isMenuOpen) {
      // 延迟重新计算以确保状态更新
      const timer = setTimeout(() => {
        recalculateMenu();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileTradeExpanded, isMenuOpen]);

  // 开发环境下的调试信息
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isMenuOpen) {
      console.log('🔍 Mobile Menu Debug Info:');
      console.log('📱 Screen Size:', screenSize);
      console.log('📏 Available Height:', availableMenuHeight);
      console.log('📋 Visible Items:', visibleMenuItems.length);
      console.log('🔄 Is Scrollable:', isMenuScrollable);
      console.log('📦 Menu Container Height:', menuContainerHeight);
    }
  }, [isMenuOpen, screenSize, availableMenuHeight, visibleMenuItems.length, isMenuScrollable, menuContainerHeight]);

  const renderMobileMenuItem = (item) => {
    if (item.isExpandable) {
      return (
        <div key={item.id} className="mobile-menu-item">
          <button
            className="mobile-menu-link w-full text-left"
            onClick={item.onToggle}
          >
            <item.icon className="mobile-menu-icon" />
            <span className="flex-1">{item.label}</span>
            {item.isExpanded ? (
              <ChevronDown className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            )}
          </button>
          
          {item.isExpanded && (
            <div className="mobile-submenu expanded">
              {item.subItems.map((subItem, index) => (
                <LanguageAwareLink
                  key={index}
                  to={subItem.path}
                  className="mobile-submenu-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`w-2 h-2 ${subItem.color} rounded-full mr-3`}></span>
                  {subItem.label}
                </LanguageAwareLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <LanguageAwareLink
        key={item.id}
        to={item.path}
        className="mobile-menu-item"
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="mobile-menu-link">
          <item.icon className="mobile-menu-icon" />
          <span className="flex-1">{item.label}</span>
        </div>
      </LanguageAwareLink>
    );
  };

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className="w-full pl-1 pr-2 sm:pl-2 sm:pr-2 lg:pl-2 lg:pr-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center ml-3">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">
                <LanguageAwareLink to="/">RuaCoin</LanguageAwareLink>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className={`hidden ${headerSpacing.navLeftMargin} md:flex ${headerSpacing.navItemsSpacing}`}>
              {/* 交易菜单 */}
              <div
                className="relative"
                onMouseEnter={() => setIsTradeMenuOpen(true)}
                onMouseLeave={() => setIsTradeMenuOpen(false)}
              >
                <button
                  onClick={() => setIsTradeMenuOpen((v) => !v)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 justify-center"
                >
                  <span>{t('header:trade')}</span>
                  <DownOutlined className="text-xs" />
                </button>
                {isTradeMenuOpen && (
                  <div className="absolute left-0 top-full mt-0 w-48 bg-[#1d1d1d] rounded-lg shadow-lg z-50">
                    <LanguageAwareLink 
                      to="/trading/BTCUSDT" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-t-lg transition-colors text-center"
                      onClick={() => setIsTradeMenuOpen(false)}
                    >
                      {t('header:spot')}
                    </LanguageAwareLink>
                    <LanguageAwareLink 
                      to="/trade/c2c/USDT?fiat=USD"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-b-lg transition-colors text-center"
                      onClick={() => setIsTradeMenuOpen(false)}
                    >
                      {t('header:c2cBuyCrypto')}
                    </LanguageAwareLink>
                    <LanguageAwareLink 
                      to={`/${locale}/crypto/buy/USD/USDT`} 
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-b-lg transition-colors text-center"
                      onClick={() => setIsTradeMenuOpen(false)}
                    >
                      {t('header:buyCrypto')}
                    </LanguageAwareLink>
                  </div>
                )}
              </div>

              {/* 现货菜单 */}
              <div
                className="relative"
                onMouseEnter={() => setIsSpotItemsMenuOpen(true)}
                onMouseLeave={() => setIsSpotItemsMenuOpen(false)}
              >
                <button
                  onClick={() => setIsSpotItemsMenuOpen((v) => !v)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 justify-center"
                >
                  <span>{t('header:spot')}</span>
                  <DownOutlined className="text-xs" />
                </button>
                {isSpotItemsMenuOpen && (
                  <div className="absolute left-0 top-full mt-0 w-48 bg-[#1d1d1d] rounded-lg shadow-lg z-50">
                    {isLoadingSpotPairs ? (
                      <div className="px-4 py-2 text-sm text-gray-400 text-center">
                        {t('common:loading')}
                      </div>
                    ) : spotTradingPairs.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-400 text-center">
                        {t('common:noData')}
                      </div>
                    ) : (
                      spotTradingPairs
                        .filter(pair => pair.isActive)
                        .map((pair, idx, arr) => (
                          <LanguageAwareLink 
                            key={pair.id}
                            to={`/trading/${pair.baseCurrency}`} 
                            className={`block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] transition-colors text-center ${idx === 0 ? 'rounded-t-lg' : ''} ${idx === arr.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => setIsSpotItemsMenuOpen(false)}
                          >
                            {pair.pair}
                          </LanguageAwareLink>
                        ))
                    )}
                  </div>
                )}
              </div>

              {/* 合约（注释保留） */}
              {/* <LanguageAwareLink to="/todo" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {t('header:futures')}
              </LanguageAwareLink> */}

              {/* 资产 */}
              <LanguageAwareLink to="/user/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {t('header:assets')}
              </LanguageAwareLink>

              {/* 理财菜单 */}
              <div
                className="relative"
                onMouseEnter={() => setIsEarnMenuOpen(true)}
                onMouseLeave={() => setIsEarnMenuOpen(false)}
              >
                <button
                  onClick={() => setIsEarnMenuOpen((v) => !v)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 justify-center"
                >
                  <span>{t('header:earn')}</span>
                  <DownOutlined className="text-xs" />
                </button>
                {isEarnMenuOpen && (
                  <div className="absolute left-0 top-full mt-0 w-48 bg-[#1d1d1d] rounded-lg shadow-lg z-50">
                    <div className="px-4 py-2 text-sm text-gray-400 text-center">
                      即将推出
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Search Bar */}
          <div className={`hidden md:flex flex-none ${headerSpacing.searchBoxMaxWidth} ${headerSpacing.searchBoxMargin}`}>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onClick={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setIsSearchFocused(false)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchValue.trim()) {
                    if (isSearchValueMatch(searchValue.trim())) {
                      addToSearchHistory(searchValue.trim());
                    }
                    setIsSearchFocused(false);
                  }
                }}
                className={`block w-full pl-10 pr-10 rounded-md bg-[#1d1d1d] ${headerSpacing.searchTextColor} placeholder-gray-400 focus:outline-none border border-transparent focus:border-[#efb90b] hover:border-[#efb90b]`}
                style={{ height: '33px' }}
                placeholder={t('header:searchPlaceholder')}
              />
              {/* 清除按钮 */}
              {searchValue && (
                <button
                  type="button"
                  className={`absolute inset-y-0 right-2 flex items-center ${headerSpacing.searchClearButtonColor}`}
                  onMouseDown={e => {
                    e.preventDefault();
                    setSearchValue('');
                  }}
                  aria-label="清除"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* 热门搜索下拉框 */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1d1d1d] rounded-lg shadow-lg z-50 border border-gray-700"
                  onMouseDown={e => e.preventDefault()}>
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">{t('header:hotSearches')}</h3>
                    {isLoadingHotSearches ? (
                      <div className="text-sm text-gray-400">{t('header:loading')}</div>
                    ) : (
                      <div className="space-y-1">
                        {hotSearches
                          .filter(item => {
                            if (!searchValue) return true;
                            return (
                              item.pair.toLowerCase().includes(searchValue.toLowerCase()) ||
                              item.symbol.toLowerCase().includes(searchValue.toLowerCase())
                            );
                          })
                          .slice(0, 6)
                          .map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {                            
                                setSearchValue(item.symbol);
                                if (isSearchValueMatch(item.symbol)) {
                                  addToSearchHistory(item.symbol);
                                }
                                navigateLocalized(`/trading/${item.symbol}`);
                                setIsSearchFocused(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-md transition-colors flex items-center justify-between"
                            >
                              <span>{item.pair}</span>
                              <span className="text-xs text-gray-500">{t('header:spotLabel')}</span>
                            </button>
                          ))
                        }
                        {/* 没有匹配项时提示 */}
                        {hotSearches.filter(item => {
                          if (!searchValue) return true;
                          return (
                            item.pair.toLowerCase().includes(searchValue.toLowerCase()) ||
                            item.symbol.toLowerCase().includes(searchValue.toLowerCase())
                          );
                        }).length === 0 && (
                          <div className="text-sm text-gray-400">{t('header:notFoundTradingPairs')}</div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* 搜索历史 */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">{t('header:searchHistory')}</h3>
                    {searchHistory.length === 0 ? (
                      <div className="text-sm text-gray-400">{t('header:noSearchHistory')}</div>
                    ) : (
                      <div className="space-y-1">
                        {searchHistory.map((item, idx) => (
                          <button
                            key={item + idx}
                            onClick={() => {                          
                              setSearchValue(item);
                              setIsSearchFocused(false);
                              navigateLocalized(`/trading/${item}`);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-md transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                        <button
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-white hover:bg-[#3a3a3a] rounded-md transition-colors"
                          onClick={() => {
                            setSearchHistory([]);
                            localStorage.removeItem('ruacoin_search_history');
                          }}
                        >
                          {t('header:clearHistory')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className={`flex items-center ${headerSpacing.rightSideSpacing}`}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors justify-center"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block text-sm">{t('header:user')}</span>
              </button>
              {isUserMenuOpen && (
                <div
                  className="absolute left-1/2 top-full mt-0 -translate-x-1/2 w-48 bg-[#1d1d1d] rounded-lg shadow-lg z-50 text-center"
                >
                  <LanguageAwareLink to="/user/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-t-lg transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                    {t('common:userDashboard.overview')}
                  </LanguageAwareLink>
                  <LanguageAwareLink to="/user/account" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-lg shadow-lg transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                    {t('header:profile')}
                  </LanguageAwareLink>
                  <LanguageAwareLink to="/user/security" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                    {t('header:security')}
                  </LanguageAwareLink>
                  <LanguageAwareLink to="/user/api" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                    {t('header:apiManagement')}
                  </LanguageAwareLink>
                  <LanguageAwareLink to="/" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-b-lg transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                    {t('header:logout')}
                  </LanguageAwareLink>
                </div>
              )}
            </div>

            {/* Login/Register Buttons */}
            <div className={`hidden md:flex items-center ${headerSpacing.mobileButtonSpacing} pr-5`}>
              <LanguageAwareLink 
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors border-[2px] border-transparent hover:border-[#00d4ff] hover:border-[2px] rounded-lg"
              >
                {t('header:login')}
              </LanguageAwareLink>
              <LanguageAwareLink 
                to="/register"
                className="btn-register-blue text-sm"
              >
                {t('header:register')}
              </LanguageAwareLink>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)} />
        )}

        {/* Mobile sidebar menu - 动态自适应版本 */}
        <div 
          className={`md:hidden fixed top-16 left-0 w-72 mobile-header-menu transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} 
          ref={mobileMenuRef}
          style={{ height: `${menuContainerHeight}px` }}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Mobile Header */}
            <div 
              ref={mobileHeaderRef}
              className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0"
            >
              <h3 className="text-lg font-semibold text-white">RuaCoin</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Mobile Search Bar */}
            <div 
              ref={mobileSearchRef}
              className="p-4 border-b border-gray-800 flex-shrink-0"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  className={`block w-full pl-10 pr-3 rounded-md bg-[#1d1d1d] ${headerSpacing.searchTextColor} placeholder-gray-400 focus:outline-none border border-transparent focus:border-[#efb90b] hover:border-[#efb90b]`}
                  style={{ height: '33px' }}
                  placeholder={t('header:mobileSearchPlaceholder')}
                />

                {/* Mobile 热门搜索下拉框 */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1d1d1d] rounded-lg shadow-lg z-50 border border-gray-700">
                    <div className="p-3 border-b border-gray-700">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">{t('header:hotSearches')}</h3>
                      {isLoadingHotSearches ? (
                        <div className="text-sm text-gray-400">{t('header:loading')}</div>
                      ) : hotSearches.length === 0 ? (
                        <div className="text-sm text-gray-400">{t('header:noHotSearches')}</div>
                      ) : (
                        <div className="space-y-1">
                          {hotSearches.slice(0, 4).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {                            
                                setSearchValue(item.symbol);
                                navigateLocalized(`/trading/${item.symbol}`);
                                setIsSearchFocused(false);
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3a3a3a] rounded-md transition-colors flex items-center justify-between"
                            >
                              <span>{item.pair}</span>
                              <span className="text-xs text-gray-500">{t('header:spotLabel')}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation - 动态自适应 */}
            <nav 
              ref={mobileNavRef}
              className={`flex-1 p-3 space-y-1 ${isMenuScrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}
              style={{ 
                maxHeight: `${availableMenuHeight}px`,
                minHeight: '200px'
              }}
            >
              {visibleMenuItems.map(renderMobileMenuItem)}
              
              {/* 当菜单项被截断时显示提示 */}
              {isMenuScrollable && (
                <div className="text-center py-2">
                  <div className="text-xs text-gray-500">
                    向下滚动查看更多菜单
                  </div>
                </div>
              )}
            </nav>

            {/* Mobile Footer - 始终可见 */}
            <div 
              ref={mobileFooterRef}
              className="p-4 border-t border-gray-800 space-y-2 flex-shrink-0"
            >
              <LanguageAwareLink
                to="/login"
                className="
                  w-full h-12 flex items-center justify-center text-sm font-medium
                  text-white bg-[#0f172a] border-2 border-[#00d4ff] rounded-lg
                  transition-all duration-300
                  hover:shadow-lg
                  hover:bg-gradient-to-r hover:from-[#00d4ff] hover:via-[#0f172a] hover:to-[#00d4ff]
                "
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header:login')}
              </LanguageAwareLink>
              <LanguageAwareLink
                to="/register"
                className="
                  w-full h-12 flex items-center justify-center text-sm font-medium
                  text-white bg-[#0f172a] border-2 border-[#00d4ff] rounded-lg
                  transition-all duration-300
                  hover:shadow-lg
                  hover:bg-gradient-to-r hover:from-[#00d4ff] hover:via-[#0f172a] hover:to-[#00d4ff]
                "
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header:register')}
              </LanguageAwareLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;