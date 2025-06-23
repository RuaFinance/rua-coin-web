import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';

const TradingChart = ({ symbol = 'BTCUSDT', exchange = 'BINANCE' }) => {
  const [selectedPair, setSelectedPair] = useState('ETH/USDT');
  const [timeframe, setTimeframe] = useState('1D');
  const [currentPrice, setCurrentPrice] = useState(43250.50);
  const [priceChange, setPriceChange] = useState(2.45);
  const [pairInfo, setPairInfo] = useState({
    high24h: 44100.00,
    low24h: 42800.00,
    volume24h: '1.2B USDT',
    trades24h: '28,456 BTC'
  });

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  // 格式化交易对名称为TradingView格式
  const formatSymbolForTradingView = (pair) => {
    // 将 BTC/USDT 转换为 BTCUSDT
    return pair.replace('/', '');
  };

  // 根据时间框架选择TradingView的间隔
  const getIntervalFromTimeframe = (tf) => {
    switch(tf) {
      case '1m': return '1';
      case '5m': return '5';
      case '15m': return '15';
      case '1H': return '60';
      case '4H': return '240';
      case '1D': return 'D';
      case '1W': return 'W';
      default: return '60';
    }
  };

  // 模拟实时价格更新
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const change = (Math.random() - 0.5) * 10;
  //     setCurrentPrice(prev => prev + change);
  //     setPriceChange(prev => prev + (Math.random() - 0.5) * 0.1);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white">{selectedPair}</h2>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-lg sm:text-2xl font-mono text-white">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className={`flex items-center space-x-1 ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="font-mono text-sm sm:text-base">
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button className="p-1 sm:p-2 text-gray-400 hover:text-white transition-colors">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button className="p-1 sm:p-2 text-gray-400 hover:text-white transition-colors">
            <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-1 mb-4 overflow-x-auto flex-shrink-0">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition-colors whitespace-nowrap flex-shrink-0 ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 mb-4 min-h-0">
        <div className="h-full min-h-[300px]">
          <TradingViewWidget
            symbol={formatSymbolForTradingView(selectedPair)}
            interval={getIntervalFromTimeframe(timeframe)}
            theme="light"
            locale="zh_CN"
            autosize
            hide_side_toolbar={false}
            allow_symbol_change={false}
            save_image={true}
            show_popup_button={true}
            withdateranges={true}
            studies={[
              "MASimple@tv-basicstudies",
              "MACD@tv-basicstudies",
              "StochasticRSI@tv-basicstudies"
            ]}
            style={{
              height: "100%",
              width: "100%"
            }}
          />
        </div>
      </div>

      {/* Market Stats - 移到图表下方，不会与图表重叠 */}
      <div className="mt-2 pt-2 border-t border-slate-700 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm flex-shrink-0">
        <div>
          <div className="text-gray-400">24h最高</div>
          <div className="text-white font-mono">${pairInfo.high24h.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-400">24h最低</div>
          <div className="text-white font-mono">${pairInfo.low24h.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-400">24h成交量</div>
          <div className="text-white font-mono">{pairInfo.volume24h}</div>
        </div>
        <div>
          <div className="text-gray-400">24h成交额</div>
          <div className="text-white font-mono">{pairInfo.trades24h}</div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;