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
 * Trading Calendar HeatMap Component
 * 
 * This component displays a GitHub-style calendar heatmap showing trading activities.
 * Based on ECharts calendar heatmap visualization.
 * 
 * @author chenjjiaa
 * @since 2025
 */

import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';

const TradingCalendarHeatMap = ({ data = null, className = '' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  
  // 可选择的年份
  const availableYears = ['2025', '2024', '2023', '2022', '2021'];
  
  // 处理年份切换
  const handleYearChange = (year) => {
    setSelectedYear(year);
    
    // 年份切换后，在移动端确保年份选择器可见
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        let wrapper = containerRef.current?.parentElement;
        while (wrapper && !wrapper.classList.contains('trading-calendar-wrapper')) {
          wrapper = wrapper.parentElement;
        }
        
        if (wrapper && wrapper.classList.contains('trading-calendar-wrapper')) {
          wrapper.scrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        }
      }, 50);
    }
  };

  // 移动端自动滚动到右侧显示年份选择器
  useEffect(() => {
    const scrollToRight = () => {
      if (containerRef.current && window.innerWidth <= 768) {
        setTimeout(() => {
          // 查找最近的带有 trading-calendar-wrapper 类的父元素
          let wrapper = containerRef.current.parentElement;
          while (wrapper && !wrapper.classList.contains('trading-calendar-wrapper')) {
            wrapper = wrapper.parentElement;
          }
          
          if (wrapper && wrapper.classList.contains('trading-calendar-wrapper')) {
            wrapper.scrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
          }
        }, 100);
      }
    };

    scrollToRight();
    window.addEventListener('resize', scrollToRight);
    
    return () => {
      window.removeEventListener('resize', scrollToRight);
    };
  }, []);

  // 生成虚拟交易数据
  const getVirtualTradingData = (year) => {
    const date = +echarts.time.parse(year + '-01-01');
    const end = +echarts.time.parse(+year + 1 + '-01-01');
    const dayTime = 3600 * 24 * 1000;
    const data = [];
    
    for (let time = date; time < end; time += dayTime) {
      // 模拟交易活动数据，周末交易较少
      const dayOfWeek = new Date(time).getDay();
      let activityLevel;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // 周末，交易活动较少
        activityLevel = Math.random() < 0.3 ? Math.floor(Math.random() * 50) : 0;
      } else {
        // 工作日，正常交易活动
        activityLevel = Math.floor(Math.random() * 100);
      }
      
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
        activityLevel
      ]);
    }

    // 随机选择一些日期设置为无交易
    const indices = new Set();
    while (indices.size < 80) {
      const randomIndex = Math.floor(Math.random() * data.length);
      indices.add(randomIndex);
    }

    indices.forEach((index) => {
      data[index][1] = 0;
    });

    return data;
  };

  // 日期后缀处理
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  // 工具提示格式化
  const formatter = (p) => {
    const date = new Date(p.data[0]);
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const suffix = getDaySuffix(day);

    if (p.data[1] > 0) {
      return `${p.data[1]} trade${p.data[1] > 1 ? 's' : ''} on ${monthName} ${day}${suffix}`;
    } else {
      return `No trades on ${monthName} ${day}${suffix}`;
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current);

    const dataList = data || getVirtualTradingData(selectedYear);
    const maxValue = Math.max(...dataList.map((item) => item[1]));

    const cellColorConfiguration = [
      '#f0f2f5',
      '#aceebb', 
      '#4bc26b',
      '#2ca44e',
      '#136229'
    ];

    // 色阶配置
    const piecesList = [
      { min: 0, max: 0, color: '#f0f2f5', label: 'No trades' },
      { min: 0.001, max: 0.3 * maxValue, color: '#aceebb' },
      { min: 0.3 * maxValue, max: 0.6 * maxValue, color: '#4bc26b' },
      { min: 0.6 * maxValue, max: 0.9 * maxValue, color: '#2ca44e' },
      { min: 0.9 * maxValue, color: '#136229' }
    ];

    // 响应式cellSize设置
    const isMobile = window.innerWidth <= 768;
    const cellSize = isMobile ? ['12', '12'] : ['15', '15'];

    const option = {
      tooltip: {
        position: 'top',
        formatter: formatter,
        backgroundColor: '#000000CC',
        textStyle: {
          color: '#fff'
        }
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: false,
        show: false,
        orient: 'horizontal',
        left: 'center',
        top: '220',
        type: 'piecewise',
        pieces: piecesList,
        inRange: {
          color: cellColorConfiguration
        }
      },
      calendar: [
        {
          orient: 'horizontal',
          range: selectedYear,
          left: 'right',
          dayLabel: {
            nameMap: ['', 'Mon', '', 'Wed', '', 'Fri', '']
          },
          monthLabel: {
            nameMap: 'EN'
          },
          yearLabel: {
            show: false
          },
          cellSize: cellSize,
          itemStyle: {
            borderWidth: isMobile ? 2.5 : 3.5,
            borderRadius: isMobile ? 5 : 7,
            borderColor: '#ffffff',
            color: '#f0f2f5',
            borderCap: 'round',
            shadowBlur: 0
          },
          splitLine: false
        }
      ],
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: dataList,
          itemStyle: {
            borderWidth: 0.5,
            borderColor: '#e5e7eb',
            borderType: 'solid',
            borderRadius: 2
          }
        }
      ]
    };

    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current && chartInstance.current.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current && chartInstance.current.dispose();
    };
  }, [selectedYear, data]);

  return (
    <div ref={containerRef} className={`trading-calendar-container ${className}`}>
      <div className="calendar-content">
        <div className="calendar-chart-wrapper">
          <div 
            ref={chartRef}
            className="trading-calendar-chart"
            style={{ 
              width: '100%', 
              height: '200px',
              minWidth: '800px' // 确保有足够宽度显示完整日历
            }}
          />
        </div>
      </div>
      
      {/* 年份选择器 */}
      <div className="calendar-year-selector">
        {availableYears.map((year) => (
          <button
            key={year}
            className={`year-btn ${selectedYear === year ? 'active' : ''}`}
            onClick={() => handleYearChange(year)}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TradingCalendarHeatMap; 