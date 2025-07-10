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

import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { fetchMarketOverview, fetchPopularCoins } from '../api/market';
import { useLocalizedNavigation } from '../components/LanguageRouter/AdvancedLanguageRouter';
import TradingPairs from '../components/TradingPairs';
import { SymbolSet } from '../config/SymbolSetConfig';
import { formatUrl } from '../router/config';

const HomePage = () => {
  const { t } = useTranslation(['pages', 'common']);
  const [marketData, setMarketData] = useState(null);
  const [popularCoins, setPopularCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { navigateLocalized } = useLocalizedNavigation();

  // 获取币种logo的函数
  const getCoinLogo = (symbol) => {
    // 处理杠杆币种，去掉3L、3S等后缀
    const cleanSymbol = symbol.replace(/3[LS]$/, '');
    
    // 构建完整的交易对符号来检查
    const fullSymbol = `${cleanSymbol}/USDT`;
    
    // 检查symbolSet中是否包含该币种
    if (SymbolSet.has(fullSymbol)) {
      return formatUrl(`/asserts/logo/${cleanSymbol}.png`);
    }
    
    // 如果没有找到，返回默认的none.png
    return formatUrl('/asserts/logo/none.png');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [marketOverview, coins] = await Promise.all([
          fetchMarketOverview(),
          fetchPopularCoins()
        ]);
        
        setMarketData(marketOverview);
        setPopularCoins(coins);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCoinClick = (symbol) => {
    navigateLocalized(`/trading/${symbol}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner h-12 w-12"></div>
          <span className="ml-3 text-lg">{t('pages:home.loadingData')}</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      {/* 市场概览 */}
      <section className="market-overview-card">
        <div className="flex items-center gap-3 mb-4 mt-2">
          {/* <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div> */}
          <h1 className="section-title pl-1">{t('pages:home.marketOverview')}</h1>
        </div>
        <div className="responsive-grid">
          <div className="market-overview-card-inner group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500 font-medium">{t('pages:home.totalMarketCap')}</div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  marketData?.marketCapChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {marketData?.marketCapChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{marketData?.marketCapChange >= 0 ? '+' : ''}{marketData?.marketCapChange}%</span>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {marketData?.totalMarketCap}
              </div>
            </div>
          </div>
          
          <div className="market-overview-card-inner group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500 font-medium">{t('pages:home.volume24h')}</div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  marketData?.volumeChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {marketData?.volumeChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{marketData?.volumeChange >= 0 ? '+' : ''}{marketData?.volumeChange}%</span>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {marketData?.volume24h}
              </div>
            </div>
          </div>
          
          <div className="market-overview-card-inner group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500 font-medium">{t('pages:home.btcDominance')}</div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  marketData?.btcDominanceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {marketData?.btcDominanceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{marketData?.btcDominanceChange >= 0 ? '+' : ''}{marketData?.btcDominanceChange}%</span>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {marketData?.btcDominance}%
              </div>
            </div>
          </div>
          
          <div className="market-overview-card-inner group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500 font-medium">{t('pages:home.activeCoins')}</div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <span>--</span>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {marketData?.activeCoins}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 热门币种 */}
      {/* <section className="homepage-card"> */}
      <section className="market-overview-card">
        <div className="flex items-center gap-3 mb-4 mt-2">
          {/* <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div> */}
          <h1 className="section-title pl-1">{t('pages:home.hotCoins')}</h1>
        </div>
        <div className="responsive-grid">
          {popularCoins.map((coin) => (
            <div 
              key={coin.symbol} 
              className="coin-card group"
              onClick={() => handleCoinClick(coin.symbol)}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={getCoinLogo(coin.symbol)} 
                        alt={coin.symbol}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.src = formatUrl('/asserts/logo/none.png');
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{coin.symbol}</div>
                      <div className="text-sm text-gray-500">{coin.name}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    coin.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {coin.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{coin.change >= 0 ? '+' : ''}{coin.change}%</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 font-mono">
                  ${coin.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 交易对 */}
      <section>
        <TradingPairs />
      </section>
    </main>
  );
};

export default HomePage;