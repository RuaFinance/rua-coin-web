import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

const RecentTrades = ({ pairData, symbol }) => {
  const [trades, setTrades] = useState([]);

  // 生成模拟交易数据
  const generateTrade = () => {
    const basePrice = 43250;
    const price = basePrice + (Math.random() - 0.5) * 100;
    const amount = Math.random() * 2 + 0.01;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const time = new Date();

    return {
      id: Date.now() + Math.random(),
      price,
      amount,
      side,
      time,
      total: price * amount
    };
  };

  // 初始化交易数据
  useEffect(() => {
    const initialTrades = [];
    for (let i = 0; i < 20; i++) {
      initialTrades.push(generateTrade());
    }
    setTrades(initialTrades.sort((a, b) => b.time - a.time));
  }, []);

  // 模拟实时交易更新
  useEffect(() => {
    const interval = setInterval(() => {
      const newTrade = generateTrade();
      setTrades(prev => [newTrade, ...prev.slice(0, 19)]);
    }, 2000 + Math.random() * 3000); // 2-5秒随机间隔

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const formatAmount = (amount) => {
    return amount.toFixed(6);
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">最新成交</h2>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:block">实时更新</span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs text-gray-400 font-medium border-b border-slate-700 mb-2 flex-shrink-0">
        <div className="text-left">价格(USDT)</div>
        <div className="text-right">数量({symbol})</div>
        <div className="text-right">时间</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {trades.slice(0, 20).map((trade, index) => (
          <div
            key={trade.id}
            className={`grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm transition-all duration-300 ${
              index === 0 ? 'animate-fade-in bg-slate-700/30' : ''
            }`}
          >
            <div className={`font-mono ${
              trade.side === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPrice(trade.price)}
            </div>
            
            <div className="text-right text-white font-mono">
              {formatAmount(trade.amount)}
            </div>
            
            <div className="text-right text-gray-400 text-xs">
              {formatTime(trade.time)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-slate-700 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div>
            <div className="text-gray-400 text-xs">买入成交量</div>
            <div className="text-green-400 font-mono">
              {trades
                .filter(t => t.side === 'buy')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(4)} {symbol}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">卖出成交量</div>
            <div className="text-red-400 font-mono">
              {trades
                .filter(t => t.side === 'sell')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(4)} {symbol}
            </div>
          </div>
        </div>
        
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">最新价格</span>
            <div className={`flex items-center space-x-1 ${
              trades[0]?.side === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trades[0]?.side === 'buy' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="font-mono text-xs sm:text-sm">
                ${trades[0] ? formatPrice(trades[0].price) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrades;