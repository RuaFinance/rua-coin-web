import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import { fetchKlineData } from '../api/trading';

// 自定义K线图表组件，使用Canvas绘制
const CustomTradingChart = ({ symbol = 'BTC/USDT', exchange = 'BINANCE' }) => {
  const [selectedPair, setSelectedPair] = useState(symbol);
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // 获取K线数据
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKlineData(selectedPair, timeframe);
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();

    // 设置定时刷新
    const intervalId = setInterval(() => {
      loadChartData();
    }, 5000); // 每5秒刷新一次

    return () => clearInterval(intervalId);
  }, [selectedPair, timeframe]);

  // 绘制图表
  useEffect(() => {
    if (chartData.length === 0 || !chartRef.current) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // 设置Canvas尺寸
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 计算图表区域
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;

    // 找出价格范围
    const prices = chartData.flatMap(candle => [candle.high, candle.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const paddedMinPrice = minPrice - priceRange * 0.05;
    const paddedMaxPrice = maxPrice + priceRange * 0.05;

    // 绘制背景
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    
    // 水平网格线
    const priceStep = priceRange / 5;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + chartHeight - (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartWidth, y);
      ctx.stroke();
      
      // 价格标签
      const price = paddedMinPrice + (i / 5) * (paddedMaxPrice - paddedMinPrice);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), margin.left - 5, y + 4);
    }

    // 垂直网格线
    const timeStep = chartWidth / Math.min(chartData.length, 20);
    for (let i = 0; i <= Math.min(chartData.length, 20); i++) {
      const x = margin.left + i * timeStep;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartHeight);
      ctx.stroke();
      
      // 时间标签（每5个点显示一个）
      if (i % 5 === 0 && i < chartData.length) {
        const time = new Date(chartData[chartData.length - 1 - i].time);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
          x,
          margin.top + chartHeight + 15
        );
      }
    }

    // 绘制K线
    const candleWidth = Math.min(timeStep * 0.8, 15);
    chartData.forEach((candle, i) => {
      const x = margin.left + (chartData.length - 1 - i) * timeStep;
      
      // 计算价格对应的Y坐标
      const openY = margin.top + chartHeight - ((candle.open - paddedMinPrice) / (paddedMaxPrice - paddedMinPrice)) * chartHeight;
      const closeY = margin.top + chartHeight - ((candle.close - paddedMinPrice) / (paddedMaxPrice - paddedMinPrice)) * chartHeight;
      const highY = margin.top + chartHeight - ((candle.high - paddedMinPrice) / (paddedMaxPrice - paddedMinPrice)) * chartHeight;
      const lowY = margin.top + chartHeight - ((candle.low - paddedMinPrice) / (paddedMaxPrice - paddedMinPrice)) * chartHeight;
      
      // 确定蜡烛颜色（涨/跌）
      const isGreen = candle.close >= candle.open;
      ctx.fillStyle = isGreen ? '#22c55e' : '#ef4444';
      ctx.strokeStyle = isGreen ? '#22c55e' : '#ef4444';
      
      // 绘制蜡烛实体
      ctx.fillRect(
        x - candleWidth / 2,
        isGreen ? openY : closeY,
        candleWidth,
        Math.abs(closeY - openY) || 1
      );
      
      // 绘制上下影线
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, isGreen ? openY : closeY);
      ctx.moveTo(x, lowY);
      ctx.lineTo(x, isGreen ? closeY : openY);
      ctx.stroke();
    });

    // 绘制最新价格线
    if (chartData.length > 0) {
      const latestPrice = chartData[0].close;
      const priceY = margin.top + chartHeight - ((latestPrice - paddedMinPrice) / (paddedMaxPrice - paddedMinPrice)) * chartHeight;
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(margin.left, priceY);
      ctx.lineTo(margin.left + chartWidth, priceY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 价格标签
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(latestPrice.toFixed(2), margin.left + chartWidth + 5, priceY + 4);
    }

  }, [chartData]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.width = containerRef.current.clientWidth;
        chartRef.current.height = containerRef.current.clientHeight;
        // 重新绘制图表
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-white">{selectedPair}</h2>
          <span className={`text-sm px-2 py-0.5 rounded ${
            chartData.length > 0 && chartData[0].close > chartData[0].open
              ? 'text-green-500'
              : 'text-red-500'
          }`}>
            {chartData.length > 0 ? (
              chartData[0].close > chartData[0].open ? (
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{((chartData[0].close - chartData[0].open) / chartData[0].open * 100).toFixed(2)}%
                </span>
              ) : (
                <span className="flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  {((chartData[0].close - chartData[0].open) / chartData[0].open * 100).toFixed(2)}%
                </span>
              )
            ) : '0.00%'}
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
      
      <div className="flex-1 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-70 z-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <canvas 
          ref={chartRef} 
          className="w-full h-full"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-4 p-4 border-t border-slate-700 text-sm">
        <div>
          <div className="text-gray-400">24h最高</div>
          <div className="text-white font-medium">
            ${chartData.length > 0 ? Math.max(...chartData.map(c => c.high)).toFixed(2) : '0.00'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">24h最低</div>
          <div className="text-white font-medium">
            ${chartData.length > 0 ? Math.min(...chartData.map(c => c.low)).toFixed(2) : '0.00'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">24h成交量</div>
          <div className="text-white font-medium">
            {chartData.length > 0 ? 
              (chartData.reduce((sum, c) => sum + c.volume, 0) / 1000000).toFixed(2) + 'M USDT' 
              : '0.00 USDT'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">24h成交额</div>
          <div className="text-white font-medium">
            {chartData.length > 0 ? 
              (chartData.reduce((sum, c) => sum + c.volume / c.close, 0)).toFixed(2) + ' BTC' 
              : '0.00 BTC'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTradingChart;