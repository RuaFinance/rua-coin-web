import { useState } from 'react';

const TradingInterface = () => {
  // 标签页数据
  const tabs = [
    { id: 'currentOrders', label: '当前委托', count: 0 },
    { id: 'historyOrders', label: '历史委托' },
    { id: 'positions', label: '当前仓位', count: 0 },
    { id: 'historyPositions', label: '历史仓位' },
  ];

  // 状态管理
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [tradeType, setTradeType] = useState('全部交易类型');
  const [positionType, setPositionType] = useState('逐仓/全仓');
  const [orderByTime, setOrderByTime] = useState('按委托时间');
  const [tradingPair, setTradingPair] = useState('当前交易品种');
  const [activeOrderType, setActiveOrderType] = useState('limit_market');

  const orderTypes = [
    { id: 'limit_market', label: '限价 | 市价' },
    { id: 'advanced_limit', label: '高级限价委托' },
    { id: 'tp_sl', label: '止盈止损' },
    { id: 'trailing_stop', label: '移动止盈止损' },
    { id: 'planned_order', label: '计划委托' },
  ];

  return (
    <div className="flex h-screen">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">

        {/* 顶部标签栏 */}
        <div className="flex items-center justify-between card border-b-[#424242] border-b-[0.5px] p-2 rounded-md">
          
          {/* 标签导航 */}
          <div className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-2 cursor-pointer text-sm ${
                  activeTab === tab.id
                    ? 'text-white hover:text-white font-bold'
                    : 'text-[#909090] hover:text-white hover:bg-[#424242] hover:rounded-md font-bold'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && <span className="ml-1">({tab.count})</span>}
              </div>
            ))}
          </div>
          
          {/* 顶栏 右侧控制区域，动态 */}
          <div className="flex items-center space-x-1">
            {activeTab === 'currentOrders' && (
              <>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {tradeType}
                    <div className="ml-1 text-trading-page-common">▼</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {tradingPair}
                    <div className="ml-1 text-trading-page-common">▼</div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'historyOrders' && (
              <>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {tradeType}
                    <div className="ml-1 text-gray-500">▼</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {orderByTime}
                    <div className="ml-1 text-gray-500">▼</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {tradingPair}
                    <div className="ml-1 text-gray-500">▼</div>
                  </div>
                </div>
              </>
            )}
            {(activeTab === 'positions' || activeTab === 'historyPositions') && (
              <>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {tradeType}
                    <div className="ml-1 text-gray-500">▼</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {positionType}
                    <div className="ml-1 text-gray-500">▼</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    {tradingPair}
                    <div className="ml-1 text-gray-500">▼</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 p-1 card rounded-md">
          {activeTab === 'currentOrders' && (
            <div className='text-trading-page-common'>
              <div className="flex items-center space-x-2 mb-0 px-1 py-2">
                {orderTypes.map((orderType) => (
                  <div
                    key={orderType.id}
                    onClick={() => setActiveOrderType(orderType.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${
                      activeOrderType === orderType.id
                        ? 'bg-[#424242] text-white'
                        : 'bg-black text-[#909090] border border-[#424242] hover:bg-[#424242] hover:text-white'
                    }`}
                  >
                    {orderType.label}
                  </div>
                ))}
              </div>
              <div className='px-2 py-2'>
                <div className="text-lg font-medium mb-4">当前委托</div>
                <div>暂无委托数据</div>
              </div>
            </div>
          )}
          {activeTab === 'historyOrders' && (
            <div className='text-trading-page-common'>
              <div className="text-lg font-medium mb-4">历史委托</div>
              <div>暂无历史委托数据</div>
            </div>
          )}
          {activeTab === 'positions' && (
            <div className='text-trading-page-common'>
              <div className="text-lg font-medium mb-4">当前持仓</div>
              <div>暂无仓位数据</div>
            </div>
          )}
          {activeTab === 'historyPositions' && (
            <div className='text-trading-page-common'>
              <div className="text-lg font-medium mb-4">历史仓位</div>
              <div>暂无历史仓位数据</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
