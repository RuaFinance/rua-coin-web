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

import { TrendingUp, TrendingDown, Star, ArrowUpDown, Volume2, BarChart3 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { formatUrl } from '../router/config';
import { symbolSet } from '../config/SymbolSetConfig';

const TradingPairs = () => {
  const { t } = useTranslation(['components', 'common']);
  const [selectedTab, setSelectedTab] = useState('hot');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  // 模拟交易对数据
  const [tradingPairs, setTradingPairs] = useState([
    { symbol: 'BTC/USDT', price: 43250.50, change: 2.45, volume: '1.2B', high: 44100, low: 42800, favorite: false },
    { symbol: 'ETH/USDT', price: 2650.30, change: -1.23, volume: '890M', high: 2720, low: 2580, favorite: true },
    { symbol: 'BNB/USDT', price: 315.80, change: 3.67, volume: '245M', high: 325, low: 305, favorite: false },
    { symbol: 'ADA/USDT', price: 0.4521, change: 5.23, volume: '156M', high: 0.465, low: 0.435, favorite: false },
    { symbol: 'SOL/USDT', price: 98.45, change: -2.15, volume: '320M', high: 102, low: 95.2, favorite: true },
    { symbol: 'DOT/USDT', price: 7.234, change: 1.89, volume: '89M', high: 7.45, low: 7.12, favorite: false },
    { symbol: 'AVAX/USDT', price: 36.78, change: 4.12, volume: '178M', high: 38.2, low: 35.1, favorite: false },
    { symbol: 'MATIC/USDT', price: 0.8945, change: -0.87, volume: '134M', high: 0.925, low: 0.875, favorite: false },
    { symbol: 'XRP/USDT', price: 0.5678, change: 3.21, volume: '420M', high: 0.58, low: 0.545, favorite: false },
    { symbol: 'DOGE/USDT', price: 0.1234, change: -5.67, volume: '380M', high: 0.13, low: 0.118, favorite: false },
    { symbol: 'LTC/USDT', price: 72.34, change: 1.89, volume: '150M', high: 74.5, low: 70.1, favorite: false },
    { symbol: 'LINK/USDT', price: 14.56, change: 4.32, volume: '210M', high: 15.2, low: 13.8, favorite: true },
    { symbol: 'UNI/USDT', price: 6.789, change: -2.34, volume: '95M', high: 7.1, low: 6.65, favorite: false },
    { symbol: 'ATOM/USDT', price: 9.876, change: 0.56, volume: '120M', high: 10.2, low: 9.5, favorite: false },
    { symbol: 'XLM/USDT', price: 0.2345, change: -1.23, volume: '80M', high: 0.245, low: 0.228, favorite: false },
    { symbol: 'FIL/USDT', price: 5.432, change: 7.89, volume: '180M', high: 5.8, low: 5.2, favorite: false },
    { symbol: 'AAVE/USDT', price: 87.65, change: -3.45, volume: '110M', high: 92.1, low: 85.3, favorite: true },
    { symbol: 'AXS/USDT', price: 7.654, change: 12.34, volume: '250M', high: 8.2, low: 7.1, favorite: false },
    { symbol: 'MANA/USDT', price: 0.4567, change: -0.98, volume: '75M', high: 0.47, low: 0.445, favorite: false },
    { symbol: 'USDC/USDT', price: 0.9998, change: 0.01, volume: '2.5B', high: 1.0002, low: 0.9995, favorite: false },
    { symbol: 'DAI/USDT', price: 0.9995, change: -0.02, volume: '1.8B', high: 1.0001, low: 0.999, favorite: false },
    { symbol: 'BTC3L/USDT', price: 1.234, change: 8.76, volume: '45M', high: 1.3, low: 1.15, favorite: false },
    { symbol: 'ETH3S/USDT', price: 0.0567, change: -12.34, volume: '32M', high: 0.065, low: 0.052, favorite: false }
  ]);

  const tabs = [
    { key: 'hot', label: t('components:tradingPairs.hot') },
    { key: 'gainers', label: t('components:tradingPairs.gainers') },
    { key: 'losers', label: t('components:tradingPairs.losers') },
    { key: 'newCoins', label: t('components:tradingPairs.newCoins') },
    { key: 'favorites', label: t('components:tradingPairs.favorites') }
  ];

  // 获取币种logo的函数
  const getCoinLogo = (symbol) => {
    // 从交易对中提取基础币种符号 (BTC/USDT -> BTC, BTC3L/USDT -> BTC)
    const baseCurrency = symbol.split('/')[0];
    
    // 处理杠杆币种，去掉3L、3S等后缀
    const cleanSymbol = baseCurrency.replace(/3[LS]$/, '');
    
    // 构建完整的交易对符号来检查
    const fullSymbol = `${cleanSymbol}/USDT`;
    
    // 检查symbolSet中是否包含该币种
    if (symbolSet.has(fullSymbol)) {
      return formatUrl(`/asserts/logo/${cleanSymbol}.png`);
    }
    
    // 如果没有找到，返回默认的none.png
    return formatUrl('/asserts/logo/none.png');
  };

  const toggleFavorite = (symbol) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortedPairs = (pairs) => {
    if (sortBy === 'none') {
      return [...pairs]; // 返回原始顺序
    }
    
    return [...pairs].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'symbol') {
        aValue = a.symbol.toLowerCase();
        bValue = b.symbol.toLowerCase();
      } else if (sortBy === 'volume') {
        aValue = parseFloat(a.volume.replace(/[GM]/g, ''));
        bValue = parseFloat(b.volume.replace(/[GM]/g, ''));
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  };

  const getFilteredPairs = () => {
    let filteredPairs;
    switch (selectedTab) {
      case 'gainers':
        filteredPairs = [...tradingPairs].filter(pair => pair.change > 0).sort((a, b) => b.change - a.change);
        return filteredPairs;
      case 'losers':
        filteredPairs = [...tradingPairs].filter(pair => pair.change < 0).sort((a, b) => a.change - b.change);
        return filteredPairs;
      case 'favorites':
        filteredPairs = tradingPairs.filter(pair => favorites.has(pair.symbol));
        break;
      case 'newCoins':
        filteredPairs = tradingPairs.slice(4);
        break;
      default: // hot
        filteredPairs = tradingPairs;
    }
    return getSortedPairs(filteredPairs);
  };

  const handleCoinClick = (symbol) => {
    const [baseCurrency] = symbol.split('/');
    navigate(`/trading/${baseCurrency}`);
  };

  // 模拟价格更新
  useEffect(() => {
    const interval = setInterval(() => {
      setTradingPairs(prev => prev.map(pair => ({
        ...pair,
        price: pair.price * (1 + (Math.random() - 0.5) * 0.002),
        change: pair.change + (Math.random() - 0.5) * 0.1,
      })));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trading-pairs-container">
      {/* Header */}
      <div className="trading-pairs-header">
        <div className="flex items-center gap-3 mt-3 mb-1">
          {/* <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div> */}
          <h2 className="section-title pl-3">{t('components:tradingPairs.title')}</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedTab(tab.key);
                setSortBy('none'); // 重置排序状态
              }}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="col-span-1 flex items-center justify-center">
          {/* <Star className="h-[18px] w-[18px] text-gray-400" /> */}
        </div>
        <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('symbol')}>
          <span className="text-sm font-medium text-gray-700">{t('components:tradingPairs.pair')}</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
        <div className="col-span-2 flex items-center justify-end gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('price')}>
          <span className="text-sm font-medium text-gray-700">{t('components:tradingPairs.price')}</span>
          <span className="pr-3"><ArrowUpDown className="h-3 w-3" /></span>
        </div>
        <div className="col-span-2 flex items-center justify-end gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('change')}>
          <span className="text-sm font-medium text-gray-700">{t('components:tradingPairs.change')}</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
        <div className="col-span-2 flex items-center justify-end gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('volume')}>
          <span className="text-sm font-medium text-gray-700">{t('components:tradingPairs.volume')}</span>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <span className="text-sm font-medium text-gray-700 pr-1">{t('common:actions', '操作')}</span>
        </div>
      </div>

      {/* Mobile/Tablet Header */}
      <div className="lg:hidden grid grid-cols-4 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700">{t('components:tradingPairs.pair')}</div>
        <div className="text-sm font-medium text-gray-700 text-right">{t('components:tradingPairs.price')}</div>
        <div className="text-sm font-medium text-gray-700 text-right">{t('components:tradingPairs.change')}</div>
        <div className="text-sm font-medium text-gray-700 text-right">{t('common:actions', '操作')}</div>
      </div>

      {/* Trading Pairs List */}
      <div>
        <div className="divide-y divide-gray-100">
          {getFilteredPairs().map((pair, index) => (
            <div key={pair.symbol}>
              {/* Desktop Layout */}
              <div 
                className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 trading-pair group"
                onClick={() => handleCoinClick(pair.symbol)}
              >
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pair.symbol);
                    }}
                    className={`favorite-star p-1 rounded-full ${
                      favorites.has(pair.symbol) ? 'active' : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="h-[18px] w-[18px]" fill={favorites.has(pair.symbol) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <div className="col-span-3 flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img 
                        src={getCoinLogo(pair.symbol)} 
                        alt={pair.symbol.split('/')[0]}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.src = formatUrl('/asserts/logo/none.png');
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{pair.symbol.split('/')[0]}</div>
                      <div className="text-xs text-gray-500">{pair.symbol.split('/')[1]}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className="font-mono text-gray-900 font-semibold">
                    ${pair.price.toLocaleString(undefined, { 
                      minimumFractionDigits: pair.price < 1 ? 4 : 2,
                      maximumFractionDigits: pair.price < 1 ? 4 : 2
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${pair.low.toFixed(2)} - ${pair.high.toFixed(2)}
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                    pair.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {pair.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="font-mono">
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className="flex items-center justify-end gap-1 text-gray-700">
                    <span className="font-mono text-sm">{pair.volume}</span>
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <button className="btn-trade">
                    <span className="material-symbols-outlined">
                      candlestick_chart
                    </span>
                    <span className="tooltip">{t('common:trade')}</span>
                  </button>
                </div>
              </div>

              {/* Mobile/Tablet Layout */}
              <div
                className="lg:hidden grid grid-cols-12 gap-2 px-4 py-3 trading-pair group"
                onClick={() => handleCoinClick(pair.symbol)}
              >
                <div className="col-span-3 flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pair.symbol);
                    }}
                    className={`favorite-star ${
                      favorites.has(pair.symbol) ? 'active' : 'text-gray-400'
                    }`}
                  >
                    <Star className="h-3 w-3" fill={favorites.has(pair.symbol) ? 'currentColor' : 'none'} />
                  </button>
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={getCoinLogo(pair.symbol)} 
                      alt={pair.symbol.split('/')[0]}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.target.src = formatUrl('/asserts/logo/none.png');
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{pair.symbol.split('/')[0]}</div>
                    <div className="text-xs text-gray-500">{pair.symbol.split('/')[1]}</div>
                  </div>
                </div>
                
                <div className="col-span-3 text-right">
                  <div className="font-mono text-gray-900 font-semibold text-sm">
                    ${pair.price < 1 ? pair.price.toFixed(4) : pair.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{pair.volume}</div>
                </div>
                
                <div className="col-span-3 text-right">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    pair.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {pair.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="font-mono">
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="col-span-3 text-right">
                  <button
                    className="btn-trade text-xs px-2 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCoinClick(pair.symbol);
                    }}
                  >
                    <span className="material-symbols-outlined">
                      candlestick_chart
                    </span>
                    <span className="tooltip">{t('common:trade')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingPairs;