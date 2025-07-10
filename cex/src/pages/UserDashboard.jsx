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
 * User Dashboard Main Page Component
 * 
 * This component serves as the main dashboard overview page for users.
 * Displays account summary, portfolio statistics, recent activities, and quick actions.
 * 
 * @author chenjjiaa
 * @since 2025
 */

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Search,
  ChevronDown
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import AssetValueChart from '../components/AssetValueChart';
import LanguageAwareLink from '../components/LanguageAware/LanguageAwareLink';
import TradingCalendarHeatMap from '../components/TradingCalendarHeatMap';
import { Currencies } from '../config/Currencies';
import { SymbolSet } from '../config/SymbolSetConfig';
import { formatUrl } from '../router/config';

const UserDashboard = () => {
  const { t } = useTranslation('common');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('deposit'); // 当前选中的按钮
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchCurrency, setSearchCurrency] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0); // 键盘导航高亮索引
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 下拉框展开状态
  const currencyListRef = useRef(null); // 货币列表容器引用
  const dropdownRef = useRef(null); // 下拉框容器引用

  // 货币列表
  const currencies = Currencies;

  // 过滤货币列表
  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchCurrency.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  // 获取币种logo的函数（仿照TradingPairs.jsx）
  const getCoinLogo = (symbol) => {
    // USDT作为基准币种，直接返回其logo
    if (symbol === 'USDT') {
      return formatUrl(`/asserts/logo/USDT.png`);
    }
    
    // 构建完整的交易对符号来检查
    const fullSymbol = `${symbol}/USDT`;
    
    // 检查symbolSet中是否包含该币种
    if (SymbolSet.has(fullSymbol)) {
      return formatUrl(`/asserts/logo/${symbol}.png`);
    }
    
    // 如果没有找到，返回默认的none.png
    return formatUrl('/asserts/logo/none.png');
  };

  // 处理按钮点击
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'deposit') {
      setShowDepositModal(true);
      setHighlightedIndex(0); // 重置高亮索引
    }
    // 其他按钮暂时不处理
  };

  // 关闭模态框
  const closeDepositModal = () => {
    setShowDepositModal(false);
    setIsDropdownOpen(false); // 关闭下拉框
    setHighlightedIndex(0); // 重置高亮索引
    setSearchCurrency(''); // 重置搜索内容
  };

  // 选择货币
  const handleCurrencySelect = (currencyCode, fromKeyboard = false) => {
    setSelectedCurrency(currencyCode);
    setIsDropdownOpen(false); // 选择后关闭下拉框
    setSearchCurrency(''); // 清空搜索
    // 如果是键盘操作，同步高亮索引；如果是鼠标操作，清除高亮状态
    if (fromKeyboard) {
      const index = filteredCurrencies.findIndex(c => c.code === currencyCode);
      if (index !== -1) {
        setHighlightedIndex(index);
      }
    } else {
      setHighlightedIndex(-1); // 鼠标操作时清除键盘高亮状态
    }
  };

  // 切换下拉框状态
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setHighlightedIndex(0); // 打开时重置高亮索引
    }
  };

  // 键盘导航处理
  const handleKeyDown = (event) => {
    if (!showDepositModal) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (isDropdownOpen) {
          setHighlightedIndex(prev => 
            prev < filteredCurrencies.length - 1 ? prev + 1 : 0
          );
        } else {
          setIsDropdownOpen(true);
          setHighlightedIndex(0);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isDropdownOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCurrencies.length - 1
          );
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (isDropdownOpen && filteredCurrencies[highlightedIndex]) {
          handleCurrencySelect(filteredCurrencies[highlightedIndex].code, true);
        } else if (!isDropdownOpen) {
          setIsDropdownOpen(true);
          setHighlightedIndex(0);
        }
        break;
      case 'Escape':
        event.preventDefault();
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
          setSearchCurrency('');
        } else {
          closeDepositModal();
        }
        break;
    }
  };

  // 绑定键盘事件
  useEffect(() => {
    if (showDepositModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showDepositModal, filteredCurrencies, highlightedIndex, isDropdownOpen]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchCurrency('');
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // 搜索内容变化时重置高亮索引
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchCurrency]);

  // 滚动到高亮的选项
  useEffect(() => {
    if (currencyListRef.current && highlightedIndex >= 0) {
      const highlightedElement = currencyListRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [highlightedIndex]);

  // Mock API call for dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock dashboard data
        const mockData = {
          totalBalance: {
            usd: 12856.43,
            btc: 0.32145,
            change24h: 2.34
          },
          portfolioDistribution: [
            { symbol: 'BTC', balance: 0.32145, value: 8245.67, percentage: 64.1 },
            { symbol: 'ETH', balance: 2.4567, value: 3420.12, percentage: 26.6 },
            { symbol: 'BNB', balance: 15.678, value: 890.45, percentage: 6.9 },
            { symbol: 'USDT', balance: 300.19, value: 300.19, percentage: 2.4 }
          ],
          recentActivities: [
            { type: 'buy', symbol: 'BTC', amount: '0.01245', price: '42,500', time: '2 hours ago', timeKey: 'hoursAgo', timeValue: 2 },
            { type: 'sell', symbol: 'ETH', amount: '0.5', price: '2,850', time: '5 hours ago', timeKey: 'hoursAgo', timeValue: 5 },
            { type: 'deposit', symbol: 'USDT', amount: '1,000', time: '1 day ago', timeKey: 'dayAgo', timeValue: 1 },
            { type: 'buy', symbol: 'BNB', amount: '5', price: '315', time: '2 days ago', timeKey: 'daysAgo', timeValue: 2 }
          ],
          stats: {
            totalTrades: 147,
            winRate: 68.2,
            totalPnL: 1247.56,
            activeOrders: 3
          }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatBalance = (balance) => {
    return isBalanceVisible ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '****';
  };

  const formatCrypto = (balance) => {
    return isBalanceVisible ? balance.toFixed(6) : '****';
  };

  // 格式化时间
  const formatTime = (activity) => {
    if (activity.timeKey && activity.timeValue) {
      if (activity.timeKey === 'hoursAgo') {
        return `${activity.timeValue} ${t('userDashboard.hoursAgo')}`;
      } else if (activity.timeKey === 'dayAgo') {
        return `${activity.timeValue} ${t('userDashboard.dayAgo')}`;
      } else if (activity.timeKey === 'daysAgo') {
        return `${activity.timeValue} ${t('userDashboard.daysAgo')}`;
      }
    }
    return activity.time;
  };

  // 格式化活动类型
  const formatActivityType = (activity) => {
    if (activity.type === 'deposit') {
      return `${t('userDashboard.deposit')} ${activity.symbol}`;
    } else {
      return `${activity.type === 'buy' ? t('userDashboard.buy') : t('userDashboard.sell')} ${activity.symbol}`;
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <span className="ml-3 text-gray-400">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('userDashboard.welcomeBack')}</h1>
          <p className="text-gray-400">{t('userDashboard.accountOverview')}</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={toggleBalanceVisibility}
            className="dashboard-btn flex items-center space-x-2"
          >
            {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isBalanceVisible ? t('userDashboard.hideBalance') : t('userDashboard.showBalance')}</span>
          </button>
          <button className="dashboard-btn flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>{t('userDashboard.refresh')}</span>
          </button>
        </div>
      </div>

      {/* Balance Overview with Chart */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{t('userDashboard.totalAssets')}</h2>
          {/* <Wallet className="w-6 h-6 text-blue-400" /> */}
        </div>
        
        <div className="space-y-6">
          {/* Balance Summary with Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Balance Summary */}
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">
                  ${formatBalance(dashboardData.totalBalance.usd)}
                </span>
                <span className="text-sm text-white">USD</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-white">
                  ≈ {formatCrypto(dashboardData.totalBalance.btc)} BTC
                </span>
                <div className={`flex items-center space-x-1 text-sm ${
                  dashboardData.totalBalance.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {dashboardData.totalBalance.change24h >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(dashboardData.totalBalance.change24h)}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-0 mt-4 lg:mt-0">
              {[
                { key: 'deposit', label: t('userDashboard.deposit') },
                { key: 'withdraw', label: t('userDashboard.withdraw') },
                { key: 'transfer', label: t('userDashboard.transfer') }
              ].map((button, index) => (
                <button
                  key={button.key}
                  onClick={() => handleTabClick(button.key)}
                  className={`
                    px-6 py-2 text-white transition-all duration-300 border-b-2
                    ${activeTab === button.key 
                      ? 'bg-gray-700 border-[#fcd535]' 
                      : 'bg-gray-800 hover:bg-gray-700 border-transparent hover:border-white'
                    }
                  `}
                  style={{ background: '#1d1d1d' }}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Value Chart */}
          <AssetValueChart 
            currentValue={dashboardData.totalBalance.usd}
            isBalanceVisible={isBalanceVisible}
            className="w-full"
            showHeader={false}
          />
        </div>
      </div>

      {/* Trading Calendar */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{t('userDashboard.tradingCalendar')}</h2>
          <Activity className="w-6 h-6 text-purple-400" />
        </div>
        
        <div className="trading-calendar-wrapper">
          <TradingCalendarHeatMap className="w-full" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stats-value">{dashboardData.stats.totalTrades}</div>
              <div className="stats-label">{t('userDashboard.totalTrades')}</div>
            </div>
            <BarChart3 className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stats-value">{dashboardData.stats.winRate}%</div>
              <div className="stats-label">{t('userDashboard.winRate')}</div>
              <div className="stats-change positive">+2.1%</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stats-value">
                ${isBalanceVisible ? dashboardData.stats.totalPnL.toLocaleString() : '****'}
              </div>
              <div className="stats-label">{t('userDashboard.totalPnL')}</div>
              <div className="stats-change positive">+15.6%</div>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stats-value">{dashboardData.stats.activeOrders}</div>
              <div className="stats-label">{t('userDashboard.activeOrders')}</div>
            </div>
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Portfolio & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Distribution */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{t('userDashboard.assetDistribution')}</h3>
                                        <LanguageAwareLink to="/user/assets/spot" className="dashboard-section-link text-blue-400 text-sm">
                {t('userDashboard.viewDetails')} →
              </LanguageAwareLink>
          </div>
          
          <div className="space-y-4">
            {dashboardData.portfolioDistribution.map((asset, index) => (
              <div key={asset.symbol} className="dashboard-asset-item flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={getCoinLogo(asset.symbol)} 
                      alt={asset.symbol}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.src = formatUrl('/asserts/logo/none.png');
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium">{asset.symbol}</div>
                    <div className="text-white text-sm">
                      {isBalanceVisible ? asset.balance.toFixed(6) : '****'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${formatBalance(asset.value)}
                  </div>
                  <div className="text-white text-sm">{asset.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{t('userDashboard.recentActivities')}</h3>
                                        <LanguageAwareLink to="/user/orders/history" className="dashboard-section-link text-blue-400 text-sm">
                {t('userDashboard.viewAll')} →
              </LanguageAwareLink>
          </div>
          
          <div className="space-y-3">
            {dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="dashboard-activity-item flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {activity.type === 'buy' ? '买' : activity.type === 'sell' ? '卖' : '充'}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {formatActivityType(activity)}
                    </div>
                    <div className="text-white text-sm">{formatTime(activity)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{activity.amount}</div>
                  {activity.price && (
                    <div className="text-white text-sm">${activity.price}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-white mb-6">{t('userDashboard.quickActions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <LanguageAwareLink to="/trading/BTC" className="dashboard-btn dashboard-btn-primary-spot text-center py-4">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <span>{t('userDashboard.spotTrading')}</span>
            </LanguageAwareLink>
                      <LanguageAwareLink to="/user/assets/spot" className="dashboard-btn text-center py-4">
              <Wallet className="w-6 h-6 mx-auto mb-2" />
              <span>{t('userDashboard.assetManagement')}</span>
            </LanguageAwareLink>
                      <LanguageAwareLink to="/user/orders/spot" className="dashboard-btn text-center py-4">
              <BarChart3 className="w-6 h-6 mx-auto mb-2" />
              <span>{t('userDashboard.orderManagement')}</span>
            </LanguageAwareLink>
                      <LanguageAwareLink to="/user/security" className="dashboard-btn text-center py-4">
              <Activity className="w-6 h-6 mx-auto mb-2" />
              <span>{t('userDashboard.securitySettings')}</span>
            </LanguageAwareLink>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && createPortal(
        <div 
          className="deposit-modal-overlay"
          onClick={closeDepositModal}
        >
          {/* Modal Content */}
          <div 
            className="deposit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeDepositModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('userDashboard.modal.selectPaymentCurrency')}
            </h2>

            {/* Currency Selector */}
            <div className="mb-6">
              <div ref={dropdownRef} className="relative">
                {/* Dropdown Trigger */}
                <button
                  onClick={toggleDropdown}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 flex items-center justify-center mr-3">
                      <span className="text-lg font-medium">
                        {currencies.find(c => c.code === selectedCurrency)?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-medium">{selectedCurrency}</span>
                      <span className="text-gray-500 text-sm">
                        {currencies.find(c => c.code === selectedCurrency)?.name}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder={t('userDashboard.modal.searchCurrency')}
                          value={searchCurrency}
                          onChange={(e) => setSearchCurrency(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Currency Options */}
                    <div ref={currencyListRef} className="max-h-40 overflow-y-auto">
                      {filteredCurrencies.map((currency, index) => (
                        <button
                          key={currency.code}
                          onClick={() => handleCurrencySelect(currency.code)}
                          className={`w-full flex items-center justify-between p-3 border-l-4 transition-all duration-200 ${
                            selectedCurrency === currency.code 
                              ? 'bg-blue-50 border-blue-500' 
                              : index === highlightedIndex && highlightedIndex >= 0
                              ? 'bg-gray-50 border-transparent'
                              : 'hover:bg-gray-50 border-transparent'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 flex items-center justify-center mr-3">
                              <span className="text-lg font-medium">{currency.symbol}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-900 font-medium">{currency.code}</span>
                              <span className="text-gray-500 text-sm">{currency.name}</span>
                            </div>
                          </div>
                          {selectedCurrency === currency.code && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section: No Crypto Assets */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('userDashboard.modal.noCryptoAssets')}
              </h3>
              
              {/* C2C Trading Option - clickable card */}
              <LanguageAwareLink
                to={`/trade/c2c/all?currency=${selectedCurrency}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-start space-x-3">
                  {/* C2C Trading Icon */}
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <img 
                      src={formatUrl('/asserts/currency/aaa-p2p-icon.png')} 
                      alt="C2C Trading"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {t('userDashboard.modal.c2cTrading')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('userDashboard.modal.c2cDescription')}
                    </p>
                  </div>
                </div>
              </LanguageAwareLink>

              {/* Bank Transfer Option - clickable card */}
              <LanguageAwareLink
                to={`/crypto/buy/${selectedCurrency}/USDT`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-start space-x-3">
                  {/* Bank Transfer Icon */}
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <img 
                      src={formatUrl('/asserts/currency/aaa-digital-currency-recharge.png')} 
                      alt="Bank Transfer"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {t('userDashboard.modal.buyWithFiat', { currency: selectedCurrency })}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('userDashboard.modal.fiatDescription')}
                    </p>
                  </div>
                </div>
              </LanguageAwareLink>
            </div>

            {/* Section: Already Have Crypto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('userDashboard.modal.haveCryptoAssets')}
              </h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {/* Digital Currency Deposit Icon */}
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <img
                      src={formatUrl('/asserts/currency/aaa-use-currency.png')}
                      alt="Digital Currency Deposit"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {t('userDashboard.modal.digitalCurrencyDeposit')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('userDashboard.modal.alreadyDepositDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserDashboard; 