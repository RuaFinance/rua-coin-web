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

import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import OrderBook from './components/OrderBook';
import RecentTrades from './components/RecentTrades';
import TradingChart from './components/TradingChart';
import TradingPairs from './components/TradingPairs';
import TradingPanel from './components/TradingPanel';

function App() {
  const { t } = useTranslation(['common']);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="w-full px-2 sm:px-4 lg:px-6 py-4">
        {/* Main Trading Layout */}
        <div className="w-full max-w-[1800px] mx-auto">
          
          {/* Desktop Layout (xl and above) */}
          <div className="hidden xl:block">
            <div className="grid grid-cols-12 gap-4 min-h-[800px]">
              {/* Left - Trading Pairs */}
              <div className="col-span-3">
                <div className="h-full">
                  <TradingPairs />
                </div>
              </div>
              
              {/* Center - Trading Chart */}
              <div className="col-span-6">
                <div className="h-[500px] mb-4">
                  <TradingChart />
                </div>
              </div>
              
              {/* Right - Trading Panel */}
              <div className="col-span-3">
                <div className="h-full">
                  <TradingPanel />
                </div>
              </div>
            </div>
            
            {/* Bottom Row - Order Book and Recent Trades */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="h-[400px]">
                <OrderBook />
              </div>
              <div className="h-[400px]">
                <RecentTrades />
              </div>
            </div>
          </div>

          {/* Large Tablet Layout (lg to xl) */}
          <div className="hidden lg:block xl:hidden">
            <div className="space-y-4">
              {/* Top Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-[400px]">
                  <TradingPairs />
                </div>
                <div className="h-[400px]">
                  <TradingPanel />
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-[400px]">
                <TradingChart />
              </div>
              
              {/* Bottom Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-[350px]">
                  <OrderBook />
                </div>
                <div className="h-[350px]">
                  <RecentTrades />
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Layout (md to lg) */}
          <div className="hidden md:block lg:hidden">
            <div className="space-y-4">
              {/* Chart */}
              <div className="h-[350px]">
                <TradingChart />
              </div>
              
              {/* Trading Panel */}
              <div className="h-[400px]">
                <TradingPanel />
              </div>
              
              {/* Trading Pairs */}
              <div className="h-[350px]">
                <TradingPairs />
              </div>
              
              {/* Order Book */}
              <div className="h-[350px]">
                <OrderBook />
              </div>
              
              {/* Recent Trades */}
              <div className="h-[300px]">
                <RecentTrades />
              </div>
            </div>
          </div>

          {/* Mobile Layout (sm and below) */}
          <div className="block md:hidden">
            <div className="space-y-4">
              {/* Chart */}
              <div className="h-[300px]">
                <TradingChart />
              </div>
              
              {/* Trading Panel */}
              <div>
                <TradingPanel />
              </div>
              
              {/* Trading Pairs */}
              <div className="h-[300px]">
                <TradingPairs />
              </div>
              
              {/* Order Book */}
              <div className="h-[300px]">
                <OrderBook />
              </div>
              
              {/* Recent Trades */}
              <div className="h-[250px]">
                <RecentTrades />
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Sections */}
        <div className="mt-8 space-y-6">
          {/* Market Overview */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">{t('common:marketOverview')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$1.2T</div>
                <div className="text-sm text-gray-400">{t('common:totalMarketCap')}</div>
                <div className="text-green-400 text-sm">+2.45%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$89.5B</div>
                <div className="text-sm text-gray-400">{t('common:volume24h')}</div>
                <div className="text-red-400 text-sm">-1.23%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">48.2%</div>
                <div className="text-sm text-gray-400">{t('common:btcDominance')}</div>
                <div className="text-green-400 text-sm">+0.15%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2,456</div>
                <div className="text-sm text-gray-400">{t('common:activeCoins')}</div>
                <div className="text-gray-400 text-sm">--</div>
              </div>
            </div>
          </div>
          
          {/* Hot Coins */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">{t('common:hotCoins')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change: 2.45, icon: '₿' },
                { symbol: 'ETH', name: 'Ethereum', price: 2650.30, change: -1.23, icon: 'Ξ' },
                { symbol: 'BNB', name: 'BNB', price: 315.80, change: 3.67, icon: '🔶' },
                { symbol: 'SOL', name: 'Solana', price: 98.45, change: -2.15, icon: '◎' },
              ].map((coin) => (
                <div key={coin.symbol} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{coin.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{coin.symbol}</div>
                        <div className="text-xs text-gray-400">{coin.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-mono text-white">
                    ${coin.price.toLocaleString()}
                  </div>
                  <div className={`text-sm font-mono ${
                    coin.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
