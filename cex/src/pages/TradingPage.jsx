import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TradingPairs from '../components/TradingPairs';
// import TradingChart from '../components/TradingChart';
// import CustomTradingChart from '../components/CustomTradingChart';
// import MockTradingChart from '../components/MockTradingChart';
// import CustomKlineTradingChart from '../components/CustomKlineTradingChart';
import KlineTradingChartPro from '../components/KlineChartProTradingChart';
import OrderBook from '../components/OrderBook';
import TradingPanel from '../components/TradingPanel';
import RecentTrades from '../components/RecentTrades';
import { fetchTradingPairData } from '../api/trading';
import TabbedInterface from '../components/TradeTabbedInterface';

const MIN_PANEL_WIDTH = 216; // px

const TradingPage = () => {
  const { symbol } = useParams();
  const [pairData, setPairData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 新增：用于拖拽的宽度state
  const [leftWidth, setLeftWidth] = useState("50%"); // 初始宽度
  const containerRef = useRef(null);

  const onMouseDown = (e) => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
        {/* 左侧交易对列表 */}
        {/* <div className="lg:col-span-2">
          <TradingPairs />
        </div> */}

        {/* 中间图表区域 */}
        <div className="lg:col-span-9">
          <div className="trading-page-trading-chart" >
          {/* <div className="h-[700px] mb-4 bg-amber-50"> */}
            {/* <CustomKlineTradingChart symbol={pairData?.symbol || 'BTC/USDT'} /> */}
            <KlineTradingChartPro/>
          </div>
          
          {/* 底部交易面板和最新成交 */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TradingPanel pairData={pairData} />
            </div>
            <div>
              <RecentTrades pairData={pairData} />
            </div>
          </div> */}
        </div>

        {/* 右侧订单簿 */}
        <div className="lg:col-span-3 h-[600px]">
          <OrderBook pairData={pairData} />
        </div>

        <div
          ref={containerRef}
          className="flex w-full items-stretch lg:col-span-12 mb-1"
          style={{ minHeight: 300, gap: 2 }}
        >
          {/* 交易 */}
          <div style={{ width: leftWidth, minWidth: MIN_PANEL_WIDTH }}>
            <TradingPanel pairData={pairData} symbol={symbol} />
          </div>
          {/* 分割条 */}
          <div
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
          />
          {/* 最新成交 */}
          <div style={{ 
            flex: 1,
            minWidth: MIN_PANEL_WIDTH,
            overflow: 'hidden',
            overflowX: 'auto',
          }}>
            <RecentTrades pairData={pairData} symbol={symbol} />
          </div>
        </div>
  
        {/* <div className="bg-red-400 lg:col-span-12 h-[300px]">
          <div className="flex gap-2 border-b border-black bg-green-600">
            <div>当前委托</div>
            <div>历史委托</div>
            <div>当前持仓</div>
            <div>资产</div>
            <div>策略</div>
            <div>历史仓位</div>
          </div>
        </div> */}
        <div className='lg:col-span-12'>
          <TabbedInterface />
        </div>
      </div>
    </main>
  );
};

export default TradingPage;