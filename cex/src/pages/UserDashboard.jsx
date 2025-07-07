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

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
  RefreshCw
} from 'lucide-react';

import { formatUrl } from '../router/config';
import { symbolSet } from '../config/SymbolSetConfig';

const UserDashboard = () => {
  const { t } = useTranslation('common');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // 获取币种logo的函数（仿照TradingPairs.jsx）
  const getCoinLogo = (symbol) => {
    // USDT作为基准币种，直接返回其logo
    if (symbol === 'USDT') {
      return formatUrl(`/asserts/logo/USDT.png`);
    }
    
    // 构建完整的交易对符号来检查
    const fullSymbol = `${symbol}/USDT`;
    
    // 检查symbolSet中是否包含该币种
    if (symbolSet.has(fullSymbol)) {
      return formatUrl(`/asserts/logo/${symbol}.png`);
    }
    
    // 如果没有找到，返回默认的none.png
    return formatUrl('/asserts/logo/none.png');
  };

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

      {/* Balance Overview */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{t('userDashboard.totalAssets')}</h2>
          <Wallet className="w-6 h-6 text-blue-400" />
        </div>
        
        <div className="space-y-4">
          <div>
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
            <Link to="/user/assets/spot" className="dashboard-section-link text-blue-400 text-sm">
              {t('userDashboard.viewDetails')} →
            </Link>
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
            <Link to="/user/orders/history" className="dashboard-section-link text-blue-400 text-sm">
              {t('userDashboard.viewAll')} →
            </Link>
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
          <Link to="/trading/BTC" className="dashboard-btn dashboard-btn-primary-spot text-center py-4">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <span>{t('userDashboard.spotTrading')}</span>
          </Link>
          <Link to="/user/assets/spot" className="dashboard-btn text-center py-4">
            <Wallet className="w-6 h-6 mx-auto mb-2" />
            <span>{t('userDashboard.assetManagement')}</span>
          </Link>
          <Link to="/user/orders/spot" className="dashboard-btn text-center py-4">
            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
            <span>{t('userDashboard.orderManagement')}</span>
          </Link>
          <Link to="/user/security" className="dashboard-btn text-center py-4">
            <Activity className="w-6 h-6 mx-auto mb-2" />
            <span>{t('userDashboard.securitySettings')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 