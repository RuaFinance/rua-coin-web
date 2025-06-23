import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TradingPairs from '../components/TradingPairs';
import TradingChart from '../components/TradingChart';
import CustomTradingChart from '../components/CustomTradingChart';
import MockTradingChart from '../components/MockTradingChart';
import CustomKlineTradingChart from '../components/CustomKlineTradingChart';
import OrderBook from '../components/OrderBook';
import TradingPanel from '../components/TradingPanel';
import RecentTrades from '../components/RecentTrades';
import { fetchTradingPairData } from '../api/trading';

const TradingPage = () => {
  const { symbol } = useParams();
  const [pairData, setPairData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧交易对列表 */}
        {/* <div className="lg:col-span-2">
          <TradingPairs />
        </div> */}

        {/* 中间图表区域 */}
        <div className="lg:col-span-9">
          <div className="trading-page-trading-chart">
          {/* <div className="h-[700px] mb-4 bg-amber-50"> */}
            {/* <CustomKlineTradingChart symbol={pairData?.symbol || 'BTC/USDT'} /> */}
            <CustomKlineTradingChart/>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-12">
          <div>
            <TradingPanel pairData={pairData} />
          </div>
          <div>
            <RecentTrades pairData={pairData} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default TradingPage;