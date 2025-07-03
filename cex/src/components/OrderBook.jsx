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

import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const OrderBook = ({ pairData, symbol }) => {
  const [precision, setPrecision] = useState(2);
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: []
  });

  // 生成模拟订单簿数据
  const generateOrderBook = () => {
    const basePrice = 43250;
    const bids = [];
    const asks = [];

    // 生成买单（绿色，价格递减）
    for (let i = 0; i < 15; i++) {
      const price = basePrice - (i + 1) * Math.random() * 10;
      const amount = Math.random() * 5 + 0.1;
      const total = price * amount;
      bids.push({ price, amount, total });
    }

    // 生成卖单（红色，价格递增）
    for (let i = 0; i < 15; i++) {
      const price = basePrice + (i + 1) * Math.random() * 10;
      const amount = Math.random() * 5 + 0.1;
      const total = price * amount;
      asks.push({ price, amount, total });
    }

    return { bids, asks: asks.reverse() };
  };

  useEffect(() => {
    setOrderBook(generateOrderBook());
    
    // 模拟实时更新
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return price.toFixed(precision);
  };

  const formatAmount = (amount) => {
    return amount.toFixed(4);
  };

  const formatTotal = (total) => {
    return total.toFixed(2);
  };

  const getDepthPercentage = (orders, index) => {
    const maxTotal = Math.max(...orders.map(order => order.total));
    return (orders[index].total / maxTotal) * 100;
  };

  return (
    <div className="card-dark h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pl-3 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">订单簿</h2>
        <div className="flex items-center space-x-2">
          <select
            value={precision}
            onChange={(e) => setPrecision(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>0</option>
            <option value={1}>0.1</option>
            <option value={2}>0.01</option>
            <option value={3}>0.001</option>
          </select>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs text-gray-400 font-medium border-b border-slate-700 mb-2 flex-shrink-0">
        <div className="text-left">价格(USDT)</div>
        <div className="text-right">数量({symbol})</div>
        <div className="text-right hidden sm:block">累计(USDT)</div>
        <div className="text-right sm:hidden">累计</div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (卖单) - 红色 */}
        <div className="flex-1 overflow-y-auto mb-2 sm:mb-2 min-h-0">
          {orderBook.asks.slice(0, 10).map((order, index) => (
            <div
              key={`ask-${index}`}
              className="order-book-row relative grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm"
            >
              {/* Depth Bar */}
              <div
                className="absolute right-0 top-0 h-full bg-red-900/20"
                style={{ width: `${getDepthPercentage(orderBook.asks, index)}%` }}
              />
              
              <div className="relative z-10 text-red-400 font-mono">
                {formatPrice(order.price)}
              </div>
              <div className="relative z-10 text-right text-white font-mono">
                {formatAmount(order.amount)}
              </div>
              <div className="relative z-10 text-right text-gray-400 font-mono text-xs">
                {formatTotal(order.total)}
              </div>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="flex items-center justify-center py-2 sm:py-3 mb-2 sm:mb-2 bg-slate-700/50 rounded-lg flex-shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-lg sm:text-2xl font-mono text-green-400">
              {formatPrice(43250.50)}
            </span>
            <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-green-400">
              ≈ $43,250.50
            </span>
          </div>
        </div>

        {/* Bids (买单) - 绿色 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {orderBook.bids.slice(0, 10).map((order, index) => (
            <div
              key={`bid-${index}`}
              className="order-book-row relative grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm"
            >
              {/* Depth Bar */}
              <div
                className="absolute right-0 top-0 h-full bg-green-900/20"
                style={{ width: `${getDepthPercentage(orderBook.bids, index)}%` }}
              />
              
              <div className="relative z-10 text-green-400 font-mono">
                {formatPrice(order.price)}
              </div>
              <div className="relative z-10 text-right text-white font-mono">
                {formatAmount(order.amount)}
              </div>
              <div className="relative z-10 text-right text-gray-400 font-mono text-xs">
                {formatTotal(order.total)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-slate-700 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div>
            <div className="text-gray-400">买单总量</div>
            <div className="text-green-400 font-mono">
              {orderBook.bids.reduce((sum, order) => sum + order.amount, 0).toFixed(4)} {symbol}
            </div>
          </div>
          <div>
            <div className="text-gray-400">卖单总量</div>
            <div className="text-red-400 font-mono">
              {orderBook.asks.reduce((sum, order) => sum + order.amount, 0).toFixed(4)} {symbol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;