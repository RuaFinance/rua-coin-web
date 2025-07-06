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

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { fetchTradingPairData } from '../api/trading';
import KlineTradingChartPro from '../components/KlineChartProTradingChart';
// import TradingChart from '../components/TradingChart';
// import CustomTradingChart from '../components/CustomTradingChart';
// import MockTradingChart from '../components/MockTradingChart';
// import CustomKlineTradingChart from '../components/CustomKlineTradingChart';
import OrderBook from '../components/OrderBook';
import RecentTrades from '../components/RecentTrades';
import TabbedInterface from '../components/TradeTabbedInterface';
import TradingPairs from '../components/TradingPairs';
import TradingPanel from '../components/TradingPanel';

const MIN_PANEL_WIDTH = 216; // px

const TradingPage = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { symbol } = useParams();
  const [pairData, setPairData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 新增：用于拖拽的宽度state
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  // const [leftWidth, setLeftWidth] = useState("50%");
  const containerRef = useRef(null);

  const onMouseDown = (e) => {
    // 只允许大屏拖动
    if (window.innerWidth < 1024) return;
    e.preventDefault();
    document.body.style.cursor = 'col-resize';

    const containerRect = containerRef.current.getBoundingClientRect();

    const onMouseMove = (moveEvent) => {
      let newLeftWidth = moveEvent.clientX - containerRect.left;
      if (newLeftWidth < MIN_PANEL_WIDTH) newLeftWidth = MIN_PANEL_WIDTH;
      if (newLeftWidth > containerRect.width - MIN_PANEL_WIDTH) newLeftWidth = containerRect.width - MIN_PANEL_WIDTH;
      setLeftWidth(newLeftWidth);
    };

    const onMouseUp = () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTradingPairData(symbol);
        setPairData(data);
      } catch (error) {
        console.error(`Failed to load data for ${symbol}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      loadData();
    }
  }, [symbol]);

  useEffect(() => {
    if (containerRef.current && window.innerWidth >= 1024) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setLeftWidth(containerWidth / 2);
    }
    // 只在初次挂载时设置一次
     
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">{t('common:loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <main className="p-1 flex flex-col h-full min-h-screen bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[0px]">
        {/* 左侧交易对列表 */}
        {/* <div className="lg:col-span-2">
          <TradingPairs />
        </div> */}

        {/* 中间图表区域 */}
        <div className="lg:col-span-9 flex flex-col h-full min-h-0">
          <div className="trading-page-trading-chart flex-1 min-h-0" >
            <KlineTradingChartPro symbol={symbol}/>
          </div>
        </div>

        {/* 右侧订单簿 */}
        <div className="lg:col-span-3 flex flex-col h-[700px]">
          <OrderBook className="flex-1 min-h-0" pairData={pairData} symbol={symbol} />
        </div>

        {/* 分割线 */}
        {/* <div className='col-span-12 split-line-x' /> */}

        <div
          ref={containerRef}
          className="flex flex-col lg:flex-row w-full items-stretch lg:col-span-12 border-b-[2px] border-b-[#424242]"
          style={{ minHeight: 300, gap: 2 }}
        >
          {/* 交易 */}
          <div
            className="flex-1"
            // style={
            //   window.innerWidth >= 1024
            //     ? { minWidth: MIN_PANEL_WIDTH, width: leftWidth }
            //     : { width: '100%' }
            // }
          >
            <TradingPanel pairData={pairData} symbol={symbol} />
          </div>

          {/* 分割条：仅大屏显示 */}
          {/* <div
            className="hidden lg:block"
            style={{
              width: 4,
              background: '#fff',
              borderRadius: 2,
              cursor: 'col-resize',
              transition: 'background 0.2s',
              zIndex: 10,
            }}
            onMouseDown={onMouseDown}
            onMouseEnter={e => (e.target.style.background = '#5c5c5c')}
            onMouseLeave={e => (e.target.style.background = '#fff')}
          /> */}

          {/* 分割线 */}
          <div className='split-line-y'/>

          {/* 最新成交 */}
          <div
            className="flex-1"
            style={
              window.innerWidth >= 1024
                ? { minWidth: MIN_PANEL_WIDTH }
                : { width: '100%' }
            }
          >
            <RecentTrades pairData={pairData} symbol={symbol} />
          </div>
        </div>

        {/* 分割线 */}
        {/* <div className='split-line-x' /> */}
  
        <div className='lg:col-span-12'>
          <TabbedInterface />
        </div>
      </div>
    </main>
  );
};

export default TradingPage;