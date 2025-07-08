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

/**
 * Asset Value Chart Component
 * 
 * Displays a time-series chart showing the total asset value over different time periods.
 * Similar to OKX's asset overview chart with time period selection and interactive features.
 * 
 * Features:
 * - Time period selection (1D, 1W, 1M, 6M)
 * - Responsive chart rendering
 * - Hover interactions with tooltips
 * - Mock data generation for different time periods
 * - Color themes for gains/losses
 * - Internationalization support
 * 
 * @author chenjjiaa
 * @since 2025
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { format, subDays, subWeeks, subMonths, startOfDay, addHours, addMinutes } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const AssetValueChart = ({ 
  currentValue = 12856.43, 
  isBalanceVisible = true,
  className = "",
  showHeader = true // 新增参数控制是否显示头部
}) => {
  const { t, i18n } = useTranslation('common');
  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  const [hoveredData, setHoveredData] = useState(null);

  // Time period configurations
  const timePeriods = [
    { key: '1D', label: t('assetChart.1day'), value: '1D' },
    { key: '1W', label: t('assetChart.1week'), value: '1W' },
    { key: '1M', label: t('assetChart.1month'), value: '1M' },
    { key: '6M', label: t('assetChart.6months'), value: '6M' }
  ];

  // Generate mock data for different time periods
  const generateMockData = useCallback((period) => {
    const now = new Date();
    let data = [];
    let startValue = currentValue;
    let dataPoints, timeInterval, formatString;

    switch (period) {
      case '1D':
        dataPoints = 145; // 24 hours with 10-minute intervals (24*60/10 + 1)
        timeInterval = 10; // 10 minutes
        formatString = 'HH:mm';
        startValue = currentValue * 0.98; // Start 2% lower
        break;
      case '1W':
        dataPoints = 337; // 7 days with 30-minute intervals (7*24*60/30 + 1)
        timeInterval = 30; // 30 minutes
        formatString = 'MM/dd';
        startValue = currentValue * 0.94; // Start 6% lower
        break;
      case '1M':
        dataPoints = 721; // 30 days with 1-hour intervals (30*24 + 1)
        timeInterval = 60; // 1 hour
        formatString = 'MM/dd';
        startValue = currentValue * 0.88; // Start 12% lower
        break;
      case '6M':
        dataPoints = 181; // Daily for 6 months (180 days + 1)
        timeInterval = 24 * 60; // 1 day in minutes
        formatString = 'MM/dd';
        startValue = currentValue * 0.75; // Start 25% lower
        break;
      default:
        dataPoints = 25;
        timeInterval = 60;
        formatString = 'HH:mm';
    }

    // Calculate the time step based on period
    const getTimeByIndex = (index) => {
      if (period === '6M') {
        return subDays(now, 180 - index);
      } else {
        return new Date(now.getTime() - (dataPoints - index) * timeInterval * 60 * 1000);
      }
    };

    // Generate realistic price movements
    let currentPrice = startValue;
    const volatility = 0.02; // 2% volatility
    const trendFactor = (currentValue - startValue) / dataPoints;

    for (let i = 0; i < dataPoints; i++) {
      const timestamp = getTimeByIndex(i);
      
      // Add some realistic market movement patterns
      const hourOfDay = timestamp.getHours();
      const dayOfWeek = timestamp.getDay();
      
      // Market tends to be more volatile during certain hours and days
      let periodVolatility = volatility;
      if (hourOfDay >= 14 && hourOfDay <= 16) periodVolatility *= 1.5; // US market hours
      if (dayOfWeek === 1 || dayOfWeek === 5) periodVolatility *= 1.2; // Monday and Friday
      
      // Random walk with slight upward trend
      const randomChange = (Math.random() - 0.5) * periodVolatility * currentPrice;
      const trendChange = trendFactor * (1 + Math.sin(i / dataPoints * Math.PI) * 0.5);
      
      currentPrice += randomChange + trendChange;
      
      // Ensure price doesn't go negative or too extreme
      currentPrice = Math.max(currentPrice, startValue * 0.5);
      currentPrice = Math.min(currentPrice, currentValue * 1.5);

      data.push({
        timestamp,
        value: parseFloat(currentPrice.toFixed(2)),
        formattedTime: format(timestamp, formatString, {
          locale: i18n.language === 'zh' ? zhCN : undefined
        }),
        fullTime: format(timestamp, 'yyyy-MM-dd HH:mm:ss', {
          locale: i18n.language === 'zh' ? zhCN : undefined
        })
      });
    }

    return data;
  }, [currentValue, i18n.language]);

  // Get chart data for selected period
  const chartData = useMemo(() => {
    return generateMockData(selectedPeriod);
  }, [selectedPeriod, generateMockData]);

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    return ((lastValue - firstValue) / firstValue) * 100;
  }, [chartData]);

  // Determine chart color based on change
  const chartColor = percentageChange >= 0 ? '#10b981' : '#ef4444'; // green or red
  const chartColorSecondary = percentageChange >= 0 ? '#10b98120' : '#ef444420'; // light green or red

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      setHoveredData(data);
      
      if (!isBalanceVisible) {
        return (
          <div className="chart-tooltip">
            <p className="tooltip-time">{data.fullTime}</p>
            <p className="tooltip-value">****</p>
          </div>
        );
      }

      return (
        <div className="chart-tooltip">
          <p className="tooltip-time">{data.fullTime}</p>
          <p className="tooltip-value">
            ${data.value.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setHoveredData(null);
  };

  // Format Y-axis values
  const formatYAxisValue = (value) => {
    if (!isBalanceVisible) return ''; // 隐藏状态时不显示Y轴数值
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Calculate Y-axis domain with some padding
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    
    const values = chartData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    
    return [
      Math.max(0, min - padding),
      max + padding
    ];
  }, [chartData]);

  // Calculate X-axis interval to show appropriate number of ticks based on period
  const xAxisInterval = useMemo(() => {
    if (chartData.length <= 5) return 0;
    
    // Adjust tick count based on period for better readability
    let targetTicks;
    switch (selectedPeriod) {
      case '1D':
        targetTicks = 6; // Show every 4 hours (240 minutes / 10 = 24 intervals)
        break;
      case '1W':
        targetTicks = 7; // Show each day
        break;
      case '1M':
        targetTicks = 6; // Show every 5 days approximately
        break;
      case '6M':
        targetTicks = 6; // Show every month
        break;
      default:
        targetTicks = 5;
    }
    
    return Math.floor((chartData.length - 1) / (targetTicks - 1));
  }, [chartData, selectedPeriod]);



  return (
    <div className={`asset-value-chart ${!showHeader ? 'embedded' : ''} ${className}`}>
      {/* Chart Header - 条件性显示 */}
      {showHeader && (
        <div className="chart-header">
          <div className="chart-title-section">
            <h3 className="chart-title">{t('assetChart.title')}</h3>
            <div className="chart-value-display">
              <div className="current-value">
                {isBalanceVisible ? (
                  `$${(hoveredData?.value || currentValue).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}`
                ) : '****'}
              </div>
              <div className={`value-change ${percentageChange >= 0 ? 'positive' : 'negative'}`}>
                {isBalanceVisible ? (
                  <>
                    {percentageChange >= 0 ? '+' : ''}
                    {percentageChange.toFixed(2)}%
                  </>
                ) : '****'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Period Selector - 始终显示 */}
      <div className={`time-period-selector ${!showHeader ? 'standalone' : ''}`}>
        {timePeriods.map((period) => (
          <button
            key={period.key}
            onClick={() => handlePeriodChange(period.key)}
            className={`period-btn ${selectedPeriod === period.key ? 'active' : ''}`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis
              dataKey="formattedTime"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              interval={xAxisInterval}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={formatYAxisValue}
              domain={yAxisDomain}
              tickCount={5}
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{ r: 4, fill: chartColor, stroke: 'none', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetValueChart; 