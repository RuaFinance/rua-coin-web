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

import { BarChart3, TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { fetchKlineData } from '../api/trading';

const MockTradingChart = ({ symbol = 'BTC/USDT' }) => {
  const [selectedPair, setSelectedPair] = useState(symbol);
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(43250.50);
  const [priceChange, setPriceChange] = useState(2.45);

  // 获取模拟数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKlineData(selectedPair, timeframe, 30);
        setChartData(data);
        
        if (data && data.length > 0) {
          setPrice(data[0].close);
          const change = ((data[0].close - data[0].open) / data[0].open) * 100;
          setPriceChange(change);
        }
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // 设置定时刷新
    const intervalId = setInterval(() => {
      loadData();
    }, 5000); // 每5秒刷新一次
    
    return () => clearInterval(intervalId);
  }, [selectedPair, timeframe]);

  // 生成模拟图表
  const renderMockChart = () => {
    if (!chartData || chartData.length === 0) return null;
    
    // 计算图表数据
    const pricePoints = chartData.map(candle => candle.close);
    const maxPrice = Math.max(...pricePoints);
    const minPrice = Math.min(...pricePoints);
    const range = maxPrice - minPrice;
    const paddedMax = maxPrice + range * 0.1;
    const paddedMin = minPrice - range * 0.1;
    const normalizedPoints = pricePoints.map(price => 
      100 - ((price - paddedMin) / (paddedMax - paddedMin) * 100)
    );
    
    // 生成SVG路径
    const pathData = normalizedPoints.map((point, i) => 
      (i === 0 ? 'M' : 'L') + `${i * (100 / (normalizedPoints.length - 1))},${point}`
    ).join(' ');
    
    // 生成面积图填充
    const areaPathData = `${pathData} L100,100 L0,100 Z`;
    
    // 生成K线
    const candleWidth = 100 / (chartData.length * 2);
    
    return (
      <div className="relative w-full h-full bg-slate-800">
        {/* 价格标签 */}
        <div className="absolute top-2 left-2 text-white font-bold text-lg">
          ${price.toFixed(2)}
          <span className={`ml-2 text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
        </div>
        
        {/* 图表网格 */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* 水平网格线 */}
          {[0, 25, 50, 75, 100].map(y => (
            <line 
              key={`grid-h-${y}`}
              x1="0" 
              y1={`${y}%`} 
              x2="100%" 
              y2={`${y}%`} 
              stroke="#334155" 
              strokeWidth="1" 
              strokeDasharray="5,5"
            />
          ))}
          
          {/* 垂直网格线 */}
          {[0, 20, 40, 60, 80, 100].map(x => (
            <line 
              key={`grid-v-${x}`}
              x1={`${x}%`} 
              y1="0" 
              x2={`${x}%`} 
              y2="100%" 
              stroke="#334155" 
              strokeWidth="1" 
              strokeDasharray="5,5"
            />
          ))}
          
          {/* 价格线 */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"} 
            strokeWidth="2"
          />
          
          {/* 面积填充 */}
          <path 
            d={areaPathData} 
            fill={priceChange >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"} 
          />
          
          {/* K线 */}
          {chartData.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            const x = i * (100 / (chartData.length - 1));
            const openY = 100 - ((candle.open - paddedMin) / (paddedMax - paddedMin) * 100);
            const closeY = 100 - ((candle.close - paddedMin) / (paddedMax - paddedMin) * 100);
            const highY = 100 - ((candle.high - paddedMin) / (paddedMax - paddedMin) * 100);
            const lowY = 100 - ((candle.low - paddedMin) / (paddedMax - paddedMin) * 100);
            
            return (
              <g key={`candle-${i}`}>
                {/* 影线 */}
                <line 
                  x1={`${x}%`} 
                  y1={`${highY}%`} 
                  x2={`${x}%`} 
                  y2={`${lowY}%`} 
                  stroke={isGreen ? "#22c55e" : "#ef4444"} 
                  strokeWidth="1"
                />
                
                {/* 实体 */}
                <rect 
                  x={`${x - candleWidth / 2}%`} 
                  y={`${Math.min(openY, closeY)}%`} 
                  width={`${candleWidth}%`} 
                  height={`${Math.abs(closeY - openY)}%`} 
                  fill={isGreen ? "#22c55e" : "#ef4444"} 
                />
              </g>
            );
          })}
          
          {/* 价格标签 */}
          <text x="98%" y="10%" fill="#94a3b8" textAnchor="end" fontSize="12">
            ${paddedMax.toFixed(2)}
          </text>
          <text x="98%" y="90%" fill="#94a3b8" textAnchor="end" fontSize="12">
            ${paddedMin.toFixed(2)}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-white">{selectedPair}</h2>
          <span className={`text-sm px-2 py-0.5 rounded ${
            priceChange >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {priceChange >= 0 ? (
              <span className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{priceChange.toFixed(2)}%
              </span>
            ) : (
              <span className="flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                {priceChange.toFixed(2)}%
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-white">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 px-4 py-2 border-b border-slate-700">
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '1m' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('1m')}
        >
          1m
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '5m' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('5m')}
        >
          5m
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '15m' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('15m')}
        >
          15m
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '1H' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('1H')}
        >
          1H
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '4H' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('4H')}
        >
          4H
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '1D' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('1D')}
        >
          1D
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${timeframe === '1W' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTimeframe('1W')}
        >
          1W
        </button>
      </div>
      
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-70 z-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : renderMockChart()}
      </div>
      
      <div className="grid grid-cols-4 gap-4 p-4 border-t border-slate-700 text-sm">
        <div>
          <div className="text-gray-400">24h最高</div>
          <div className="text-white font-medium">
            ${chartData && chartData.length > 0 
              ? Math.max(...chartData.map(c => c.high)).toFixed(2) 
              : '0.00'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">24h最低</div>
          <div className="text-white font-medium">
            ${chartData && chartData.length > 0 
              ? Math.min(...chartData.map(c => c.low)).toFixed(2) 
              : '0.00'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">24h成交量</div>
          <div className="text-white font-medium">
            {chartData && chartData.length > 0 
              ? (chartData.reduce((sum, c) => sum + c.volume, 0) / 1000000).toFixed(2) + 'M USDT' 
              : '0.00 USDT'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">24h成交额</div>
          <div className="text-white font-medium">
            {chartData && chartData.length > 0 
              ? (chartData.reduce((sum, c) => sum + c.volume / c.close, 0)).toFixed(2) + ' BTC' 
              : '0.00 BTC'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTradingChart;