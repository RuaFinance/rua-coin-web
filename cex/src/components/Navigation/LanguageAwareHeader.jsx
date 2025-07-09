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
import { Menu, X, User, Bell, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Language-aware imports
import { useLanguageAnalytics } from '../../i18n/analytics/languageAnalytics';
import LanguageAwareLink from '../LanguageAware/LanguageAwareLink';
import { useCurrentLocale, useLocalizedNavigation } from '../LanguageRouter/AdvancedLanguageRouter';
import AdvancedLanguageSwitcher from '../LanguageSwitcher/AdvancedLanguageSwitcher';

/**
 * 🧭 Language-Aware Header Component
 * 
 * Enhanced header component with full language routing integration:
 * 
 * Features:
 * - Language-aware navigation links
 * - Advanced language switcher with analytics
 * - Full search functionality with localized results
 * - Trading pairs dropdown with language support
 * - User menu with localized content
 * - Responsive design for all locales
 * - RTL language support
 * - Performance optimizations
 * 
 * @component
 */
const LanguageAwareHeader = () => {
  const { t } = useTranslation(['common', 'header']);
  const { locale: currentLocale } = useCurrentLocale();
  const { navigate: navigateLocalized, generatePath } = useLocalizedNavigation();
  const { trackRouteAccess, trackLanguageSwitch } = useLanguageAnalytics();
  
  // Header 间距配置 - 统一管理所有间距
  const headerSpacing = {
    // 主要导航区域间距
    navLeftMargin: 'md:ml-6',        // 导航与logo的间距 (从ml-8改为ml-6)
    navItemsSpacing: 'md:space-x-2', // 导航项之间的间距 (从space-x-8改为space-x-6)
    
    // 搜索框区域间距
    searchBoxMargin: 'ml-auto mr-4', // 搜索框左右margin (ml-auto让搜索框向右靠拢)
    searchBoxMaxWidth: 'max-w-[270px]', // 搜索框最大宽度设为270px
    searchClearButtonColor: 'text-gray-400 hover:text-gray-700', // 清除按钮颜色
    searchTextColor: 'text-white', // 搜索框文本颜色
    
    // 右侧区域间距
    rightSideSpacing: 'space-x-4',   // 右侧元素间距
    
    // 移动端间距
    mobileNavSpacing: 'space-y-1',   // 移动端导航项间距
    mobileButtonSpacing: 'space-x-2', // 移动端按钮间距
  };
  
  // 菜单状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSpotItemsMenuOpen, setIsSpotItemsMenuOpen] = useState(false);

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

  // Mock后端数据 - 模拟API调用
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

  const spotItems = [
    { key: 'BTC/USDT', label: 'BTC'},
  ]

  const handleSpotItemsClick = ({ key }) => {
    const [baseCurrency] = key.split('/');
    navigateLocalized(`/trading/${baseCurrency}`);
    
    // Track navigation
    trackRouteAccess(`/trading/${baseCurrency}`, currentLocale, 0, {
      source: 'header_spot_menu',
      symbol: baseCurrency
    });
  };

  // 保存历史到localStorage
  const saveSearchHistory = (historyArr) => {
    setSearchHistory(historyArr);
    localStorage.setItem('ruacoin_search_history', JSON.stringify(historyArr));
  };

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

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2">
        <div 
          className="flex justify-between items-center h-16"
          onMouseLeave={() => {
            setIsSpotItemsMenuOpen(false);
            setIsUserMenuOpen(false);
            setIsSearchFocused(false);
          }}
        >
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">
                <LanguageAwareLink to="/">RuaCoin</LanguageAwareLink>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className={`hidden md:block ${headerSpacing.navLeftMargin}`}>
              <div className={`flex items-center ${headerSpacing.navItemsSpacing}`}>
                {/* 现货 Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsSpotItemsMenuOpen(true)}
                  onMouseLeave={() => setIsSpotItemsMenuOpen(false)}
                >
                  <button className="text-gray-300 hover:text-white transition-all duration-200 flex items-center px-3 py-2 rounded-md hover:bg-gray-800">
                    <span>{t('common:spot')}</span>
                    <DownOutlined className="ml-1 text-xs" />
                  </button>

                  {isSpotItemsMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-3">{t('common:popularPairs')}</h3>
                        {isLoadingSpotPairs ? (
                          <div className="space-y-2">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="animate-pulse bg-gray-700 h-8 rounded"></div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {spotTradingPairs.slice(0, 8).map(pair => (
                              <button
                                key={pair.id}
                                onClick={() => handleSpotItemsClick({ key: pair.pair })}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors duration-150"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{pair.symbol}</span>
                                  <span className="text-xs text-gray-500">{pair.quoteCurrency}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <LanguageAwareLink
                            to="/markets"
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-150"
                          >
                            {t('common:viewAllMarkets')} →
                          </LanguageAwareLink>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 合约 */}
                <LanguageAwareLink
                  to="/futures"
                  className="text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-800"
                >
                  {t('common:futures')}
                </LanguageAwareLink>

                {/* 理财 */}
                <LanguageAwareLink
                  to="/earn"
                  className="text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-800"
                >
                  {t('common:earn')}
                </LanguageAwareLink>

                {/* 更多 */}
                <LanguageAwareLink
                  to="/more"
                  className="text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-800"
                >
                  {t('common:more')}
                </LanguageAwareLink>
              </div>
            </nav>
          </div>

          {/* Search Box */}
          <div className={`hidden sm:block ${headerSpacing.searchBoxMargin} ${headerSpacing.searchBoxMaxWidth} w-full relative`}>
            <div className="relative">
              <div 
                className="relative"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('common:searchPlaceholder')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className={`w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-10 py-2 ${headerSpacing.searchTextColor} placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200`}
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${headerSpacing.searchClearButtonColor} transition-colors duration-150`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchValue ? (
                    // Search Results
                    <div className="p-4">
                      <h4 className="text-white font-medium mb-3">{t('common:searchResults')}</h4>
                      {hotSearches
                        .filter(item => 
                          item.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
                          item.pair.toLowerCase().includes(searchValue.toLowerCase())
                        )
                        .slice(0, 5)
                        .map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              addToSearchHistory(item.symbol);
                              navigateLocalized(`/trading/${item.symbol}`);
                              setSearchValue('');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors duration-150"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.symbol}</span>
                              <span className="text-xs text-gray-500">{item.pair}</span>
                            </div>
                          </button>
                        ))
                      }
                    </div>
                  ) : (
                    // Hot Searches and History
                    <div className="p-4">
                      {/* Hot Searches */}
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-3">{t('common:hotSearches')}</h4>
                        {isLoadingHotSearches ? (
                          <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="animate-pulse bg-gray-700 h-8 rounded"></div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {hotSearches.slice(0, 6).map(item => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  addToSearchHistory(item.symbol);
                                  navigateLocalized(`/trading/${item.symbol}`);
                                  setSearchValue('');
                                  setIsSearchFocused(false);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors duration-150"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{item.symbol}</span>
                                  <span className="text-xs text-gray-500">{item.pair}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Search History */}
                      {searchHistory.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-white font-medium">{t('common:recentSearches')}</h4>
                            <button
                              onClick={() => saveSearchHistory([])}
                              className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-150"
                            >
                              {t('common:clear')}
                            </button>
                          </div>
                          <div className="space-y-1">
                            {searchHistory.slice(0, 5).map((keyword, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  navigateLocalized(`/trading/${keyword}`);
                                  setSearchValue('');
                                  setIsSearchFocused(false);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors duration-150"
                              >
                                <span className="font-medium">{keyword}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className={`flex items-center ${headerSpacing.rightSideSpacing}`}>
            {/* Language Switcher */}
            <AdvancedLanguageSwitcher 
              variant="dropdown" 
              showFlags={true}
              onLanguageChange={(newLanguage) => {
                trackLanguageSwitch(currentLocale, newLanguage, {
                  source: 'header_language_switcher',
                  timestamp: Date.now()
                });
              }}
            />

            {/* Notifications */}
            <button className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-md hover:bg-gray-800">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-md hover:bg-gray-800">
                <User className="w-5 h-5" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="py-2">
                    <LanguageAwareLink
                      to="/login"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-150"
                    >
                      {t('common:login')}
                    </LanguageAwareLink>
                    <LanguageAwareLink
                      to="/register"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-150"
                    >
                      {t('common:register')}
                    </LanguageAwareLink>
                    <div className="border-t border-gray-700 my-1"></div>
                    <LanguageAwareLink
                      to="/user/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-150"
                    >
                      {t('common:dashboard')}
                    </LanguageAwareLink>
                    <LanguageAwareLink
                      to="/user/account"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-150"
                    >
                      {t('common:account')}
                    </LanguageAwareLink>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-md hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700 py-4">
            <div className={`flex flex-col ${headerSpacing.mobileNavSpacing}`}>
              <LanguageAwareLink
                to="/markets"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common:spot')}
              </LanguageAwareLink>
              <LanguageAwareLink
                to="/futures"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common:futures')}
              </LanguageAwareLink>
              <LanguageAwareLink
                to="/earn"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common:earn')}
              </LanguageAwareLink>
              <LanguageAwareLink
                to="/more"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common:more')}
              </LanguageAwareLink>
              
              <div className="border-t border-gray-700 my-2"></div>
              
              <LanguageAwareLink
                to="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common:login')}
              </LanguageAwareLink>
              <LanguageAwareLink
                to="/register"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common:register')}
              </LanguageAwareLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LanguageAwareHeader; 