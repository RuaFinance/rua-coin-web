import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TradingPairs = () => {
  const [selectedTab, setSelectedTab] = useState('热门');
  const [favorites, setFavorites] = useState(new Set());
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

  const tabs = ['热门', '涨幅榜', '跌幅榜', '新币', '自选'];

  const toggleFavorite = (symbol) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  };

  const getFilteredPairs = () => {
    switch (selectedTab) {
      case '涨幅榜':
        return [...tradingPairs].sort((a, b) => b.change - a.change);
      case '跌幅榜':
        return [...tradingPairs].sort((a, b) => a.change - b.change);
      case '自选':
        return tradingPairs.filter(pair => favorites.has(pair.symbol));
      case '新币':
        return tradingPairs.slice(4); // 模拟新币
      default:
        return tradingPairs;
    }
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
        price: pair.price * (1 + (Math.random() - 0.5) * 0.002), // ±0.1% 随机变化
        change: pair.change + (Math.random() - 0.5) * 0.1,
      })));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-lg font-semibold text-[#202630] mb-3">交易对</h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-2 py-1 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedTab === tab
                  ? 'bg-white text-[#202630] font-bold'
                  : 'text-[#202630] hover:text-[#202630] hover:bg-[#ececec]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-2 px-3 py-2 text-xs text-gray-400 font-medium  flex-shrink-0">
        <div className="col-span-1"></div>
        <div className="col-span-3">交易对</div>
        <div className="col-span-2 text-right">价格</div>
        <div className="col-span-2 text-right">涨跌幅</div>
        <div className="col-span-2 text-right">24h量</div>
        <div className="col-span-2 text-right">操作</div>
      </div>

      {/* Mobile/Tablet Header */}
      <div className="lg:hidden grid grid-cols-4 gap-2 px-3 py-2 text-xs text-gray-400 font-medium border-b  flex-shrink-0">
        <div>交易对</div>
        <div className="text-right">价格</div>
        <div className="text-right">涨跌幅</div>
        <div className="text-right">操作</div>
      </div>

      {/* Trading Pairs List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {getFilteredPairs().map((pair, index) => (
            <div key={pair.symbol}>
              {/* Desktop Layout */}
              <div 
                key={pair.symbol} 
                className="hidden lg:grid lg:grid-cols-12 gap-2 px-3 py-2 text-sm trading-pair"
                onClick={() => handleCoinClick(pair.symbol)}
              >
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pair.symbol);
                    }}
                    className={`p-1 rounded ${
                      favorites.has(pair.symbol)
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    <Star className="h-[18px] w-[18px]" fill={favorites.has(pair.symbol) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <div className="col-span-3 flex items-center">
                  <div>
                    <div className="font-medium text-[#202630]">{pair.symbol.split('/')[0]}</div>
                    <div className="text-xs text-gray-400">{pair.symbol.split('/')[1]}</div>
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className="font-mono text-[#202630] text-sm">
                    ${pair.price.toLocaleString(undefined, { 
                      minimumFractionDigits: pair.price < 1 ? 4 : 2,
                      maximumFractionDigits: pair.price < 1 ? 4 : 2
                    })}
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    pair.change >= 0 ? 'price-up' : 'price-down'
                  }`}>
                    {pair.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="font-mono text-sm">
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className="text-[#202630] font-mono text-xs">
                    {pair.volume}
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <button className="btn-primary text-xs px-2 py-1">
                    交易
                  </button>
                </div>
              </div>

              {/* Mobile/Tablet Layout */}
              <div className="lg:hidden grid grid-cols-12 gap-1 px-2 py-2 text-sm trading-pair">
                {/* 币种 - 占3列 */}
                <div className="col-span-3 flex items-center space-x-1">
                  <button
                    onClick={() => toggleFavorite(pair.symbol)}
                    className={`${
                      favorites.has(pair.symbol)
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    <Star className="h-3 w-3" fill={favorites.has(pair.symbol) ? 'currentColor' : 'none'} />
                  </button>
                  <div>
                    <div className="font-medium text-[#202630] text-xs">{pair.symbol.split('/')[0]}</div>
                    <div className="text-xs text-gray-400">{pair.symbol.split('/')[1]}</div>
                  </div>
                </div>
                
                {/* 价格 - 占3列 */}
                <div className="col-span-3 text-right">
                  <div className="font-mono text-[#202630] text-xs">
                    ${pair.price < 1 ? pair.price.toFixed(4) : pair.price.toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-xs hidden sm:block">{pair.volume}</div>
                </div>
                
                {/* 涨跌幅 - 占3列 */}
                <div className="col-span-3 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    pair.change >= 0 ? 'price-up' : 'price-down'
                  }`}>
                    {pair.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="font-mono text-xs whitespace-nowrap">
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                {/* 操作 - 占3列 */}
                <div className="col-span-3 text-right">
                  <button className="btn-primary text-xs px-2 py-1">
                    交易
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