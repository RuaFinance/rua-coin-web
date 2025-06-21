import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { BarChart3, TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TradingChart = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(43250.50);
  const [priceChange, setPriceChange] = useState(2.45);

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  // 生成模拟K线数据
  const generateChartData = () => {
    const labels = [];
    const prices = [];
    const volumes = [];
    
    const now = new Date();
    let basePrice = 43000;
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
      
      // 生成价格数据（模拟波动）
      const change = (Math.random() - 0.5) * 200;
      basePrice += change;
      prices.push(basePrice);
      
      // 生成成交量数据
      volumes.push(Math.random() * 1000 + 500);
    }

    return {
      labels,
      datasets: [
        {
          label: selectedPair,
          data: prices,
          borderColor: priceChange >= 0 ? '#22c55e' : '#ef4444',
          backgroundColor: priceChange >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `价格: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: 8,
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#0ea5e9',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2,
      }
    }
  };

  useEffect(() => {
    setChartData(generateChartData());
  }, [selectedPair, timeframe]);

  // 模拟实时价格更新
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      setCurrentPrice(prev => prev + change);
      setPriceChange(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
                priceChange >= 0 ? 'price-up' : 'price-down'
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
        <div className="h-full min-h-[200px] sm:min-h-[300px]">
          {chartData && (
            <Line data={chartData} options={{
              ...chartOptions,
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                ...chartOptions.scales,
                x: {
                  ...chartOptions.scales.x,
                  ticks: {
                    ...chartOptions.scales.x.ticks,
                    maxTicksLimit: window.innerWidth < 640 ? 4 : 8,
                  }
                }
              }
            }} />
          )}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm flex-shrink-0">
        <div>
          <div className="text-gray-400">24h最高</div>
          <div className="text-white font-mono">$44,100.00</div>
        </div>
        <div>
          <div className="text-gray-400">24h最低</div>
          <div className="text-white font-mono">$42,800.00</div>
        </div>
        <div>
          <div className="text-gray-400">24h成交量</div>
          <div className="text-white font-mono">1.2B USDT</div>
        </div>
        <div>
          <div className="text-gray-400">24h成交额</div>
          <div className="text-white font-mono">28,456 BTC</div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;