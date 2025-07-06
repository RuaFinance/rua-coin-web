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

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Radio, Select, theme } from 'antd';
import { useState, useRef, Record, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RadioConfigTheme } from '../config/AntdRadioConfig'
import { SelectConfig } from '../config/AntdSelectConfig'


const TradingInterface = () => {
  const { t } = useTranslation(['components', 'common']);
  
  // 标签页数据
  const tabs = [
    { id: 'currentOrders', label: t('components:tradeTabbedInterface.currentOrders'), count: 0 },
    { id: 'historyOrders', label: t('components:tradeTabbedInterface.historyOrders') },
    { id: 'positions', label: t('components:tradeTabbedInterface.positions'), count: 0 },
    { id: 'historyPositions', label: t('components:tradeTabbedInterface.historyPositions') },
    { id: 'assert', label: t('components:tradeTabbedInterface.assets') },
  ];

  // 状态管理
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [selectedTradeType, setSelectedTradeType] = useState('all');
  const [selectedPositionType, setSelectedPositionType] = useState('all');
  const [selectedOrderByTime, setSelectedOrderByTime] = useState('by_order_time');
  const [radioChecked1, setChecked] = useState(false);
  const [activeOrderType, setActiveOrderType] = useState('limit_market');

  const selectRef = useRef(null);

  // 动态生成选项，确保语言切换时更新
  const tradeTypeOptions = [
    { value: 'all', label: t('components:tradeTabbedInterface.allTradeTypes') },
    { value: 'spot', label: t('components:tradeTabbedInterface.spot') },
    { value: 'future', label: t('components:tradeTabbedInterface.futures') },
    { value: 'delivery', label: t('components:tradeTabbedInterface.delivery') },
    { value: 'margin', label: t('components:tradeTabbedInterface.margin') },
    { value: 'options', label: t('components:tradeTabbedInterface.options') }
  ];

  const orderByTimeOrExecutionOption = [
    { value: 'by_order_time', label: t('components:tradeTabbedInterface.byOrderTime') },
    { value: 'by_execution_time', label: t('components:tradeTabbedInterface.byExecutionTime') },
  ];

  const positionTypeOption = [
    { value: 'all', label: t('components:tradeTabbedInterface.isolatedCross') },
    { value: 'isolated_margin', label: t('components:tradeTabbedInterface.isolated') },
    { value: 'cross_margin', label: t('components:tradeTabbedInterface.cross') },
  ];

  const orderTypes = [
    { id: 'limit_market', label: t('components:tradeTabbedInterface.limitMarket') },
    { id: 'advanced_limit', label: t('components:tradeTabbedInterface.advancedLimit') },
    { id: 'tp_sl', label: t('components:tradeTabbedInterface.takeProfitStopLoss') },
    { id: 'trailing_stop', label: t('components:tradeTabbedInterface.trailingStop') },
    { id: 'planned_order', label: t('components:tradeTabbedInterface.plannedOrder') },
  ];

  const handleOnClickActiveOrderType = (value) => {
    setActiveOrderType(prev => prev === value ? null : value); // 相同值则重置
  };

  const handleTradeTypeChange = (value) => {
    setSelectedTradeType(value);
  };

  const handlePositionTypeChange = (value) => {
    setSelectedPositionType(value);
  };

  const handleOrderByTimeChange = (value) => {
    setSelectedOrderByTime(value);
  };

  return (
    <div className="flex h-screen">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">

        {/* 顶部标签栏 */}
        <div className="flex items-center justify-between card-dark border-b-[#424242] border-b-[0.5px] p-2 rounded-md">

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
                  <div 
                    className="text-trading-page-common px-3 py-1 rounded text-sm cursor-pointer flex items-center"
                  >
                    <ConfigProvider
                      theme={{
                        algorithm: theme.darkAlgorithm,
                        components: {
                          Select: SelectConfig,
                        },
                      }}
                    >
                      <Select
                        value={selectedTradeType}
                        onChange={handleTradeTypeChange}
                        options={tradeTypeOptions}
                        suffixIcon={<DownOutlined className="text-white opacity-60" />}
                        popupMatchSelectWidth={false}
                        styles={{
                          popup: {
                            root: {
                              backgroundColor: '#000000',
                              border: '1px solid #424242',
                            },
                          },
                        }}
                      />
                    </ConfigProvider>
                    
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 rounded border border-[#424242] text-sm cursor-pointer flex items-center hover:border-blue-500">
                    <ConfigProvider
                      theme={RadioConfigTheme}
                    >
                      <Radio 
                        checked={radioChecked1}
                        onClick={() => setChecked(!radioChecked1)}
                        value={t('components:tradeTabbedInterface.currentTradingPair')}
                      >
                        {t('components:tradeTabbedInterface.currentTradingPair')}
                      </Radio>
                    </ConfigProvider>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'historyOrders' && (
              <>
                <div className="relative">
                  <div className="text-trading-page-common py-0 rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    <ConfigProvider
                      theme={{
                        algorithm: theme.darkAlgorithm,
                        components: {
                          Select: SelectConfig,
                        },
                      }}
                    >
                      <Select
                        value={selectedTradeType}
                        onChange={handleTradeTypeChange}
                        options={tradeTypeOptions}
                        suffixIcon={<DownOutlined className="text-white opacity-60" />}
                        popupMatchSelectWidth={false}
                        styles={{
                          popup: {
                            root: {
                              backgroundColor: '#000000',
                              border: '1px solid #424242',
                            },
                          },
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-2 py-1 rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                  <ConfigProvider
                      theme={{
                        algorithm: theme.darkAlgorithm,
                        components: {
                          Select: SelectConfig,
                        },
                      }}
                    >
                      <Select
                        value={selectedOrderByTime}
                        onChange={handleOrderByTimeChange}
                        options={orderByTimeOrExecutionOption}
                        suffixIcon={<DownOutlined className="text-white opacity-60" />}
                        popupMatchSelectWidth={false}
                        styles={{
                          popup: {
                            root: {
                              backgroundColor: '#000000',
                              border: '1px solid #424242',
                            },
                          },
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    <ConfigProvider
                      theme={RadioConfigTheme}
                    >
                      <Radio 
                        checked={radioChecked1}
                        onClick={() => setChecked(!radioChecked1)}
                        value={t('components:tradeTabbedInterface.currentTradingPair')}
                      >
                        {t('components:tradeTabbedInterface.currentTradingPair')}
                      </Radio>
                    </ConfigProvider>
                  </div>
                </div>
              </>
            )}

            {(activeTab === 'positions' || activeTab === 'historyPositions') && (
              <>
                <div className="relative">
                  <div className="text-trading-page-common px-0 py-1 rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    <ConfigProvider
                      theme={{
                        algorithm: theme.darkAlgorithm,
                        components: {
                          Select: SelectConfig,
                        },
                      }}
                    >
                      <Select
                        value={selectedTradeType}
                        onChange={handleTradeTypeChange}
                        options={tradeTypeOptions}
                        suffixIcon={<DownOutlined className="text-white opacity-60" />}
                        popupMatchSelectWidth={false}
                        styles={{
                          popup: {
                            root: {
                              backgroundColor: '#000000',
                              border: '1px solid #424242',
                            },
                          },
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-2 py-1 rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    <ConfigProvider
                      theme={{
                        algorithm: theme.darkAlgorithm,
                        components: {
                          Select: SelectConfig,
                        },
                      }}
                    >
                      <Select
                        value={selectedPositionType}
                        onChange={handlePositionTypeChange}
                        options={positionTypeOption}
                        suffixIcon={<DownOutlined className="text-white opacity-60" />}
                        popupMatchSelectWidth={false}
                        styles={{
                          popup: {
                            root: {
                              backgroundColor: '#000000',
                              border: '1px solid #424242',
                            },
                          },
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-trading-page-common px-3 py-1 border border-[#424242] rounded text-sm cursor-pointer flex items-center hover:border-blue-500">
                    <ConfigProvider
                      theme={RadioConfigTheme}
                    >
                      <Radio 
                        checked={radioChecked1}
                        onClick={() => setChecked(!radioChecked1)}
                        value={t('components:tradeTabbedInterface.currentTradingPair')}
                      >
                        {t('components:tradeTabbedInterface.currentTradingPair')}
                      </Radio>
                    </ConfigProvider>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 p-1 card-dark rounded-md">
          {activeTab === 'currentOrders' && (
            <div className='text-trading-page-common'>
              <div className="flex items-center space-x-2 mb-0 px-1 py-2">
                {orderTypes.map((orderType) => (
                  <div
                    key={orderType.id}
                    onClick={() => handleOnClickActiveOrderType(orderType.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${
                      activeOrderType === orderType.id
                        ? 'bg-[#424242] border-[#424242] border-[1px] text-white'
                        : 'bg-black text-[#909090] border border-[#424242] hover:bg-[#424242] hover:text-white'
                    }`}
                  >
                    {orderType.label}
                  </div>
                ))}
              </div>
              <div className='px-2 py-2'>
                <div className="text-lg font-medium mb-4">{t('components:tradeTabbedInterface.currentOrders')}</div>
                <div>{t('components:tradeTabbedInterface.noData')}</div>
              </div>
            </div>
          )}
          {activeTab === 'historyOrders' && (
            <div className='text-trading-page-common'>
              <div className="flex items-center space-x-2 mb-0 px-1 py-2">
                {orderTypes.map((orderType) => (
                  <div
                    key={orderType.id}
                    onClick={() => handleOnClickActiveOrderType(orderType.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${
                      activeOrderType === orderType.id
                        ? 'bg-[#424242] border-[#424242] border-[1px] text-white'
                        : 'bg-black text-[#909090] border border-[#424242] hover:bg-[#424242] hover:text-white'
                    }`}
                  >
                    {orderType.label}
                  </div>
                ))}
              </div>
              <div className='px-2 py-2'>
                <div className="text-lg font-medium mb-4">{t('components:tradeTabbedInterface.historyOrders')}</div>
                <div>{t('components:tradeTabbedInterface.noData')}</div>
              </div>
            </div>
          )}
          {activeTab === 'positions' && (
            <div className='text-trading-page-common px-2 py-2'>
              <div className="text-lg font-medium mb-4">{t('components:tradeTabbedInterface.positions')}</div>
              <div>{t('components:tradeTabbedInterface.noData')}</div>
            </div>
          )}
          {activeTab === 'historyPositions' && (
            <div className='text-trading-page-common px-2 py-2'>
              <div className="text-lg font-medium mb-4">{t('components:tradeTabbedInterface.historyPositions')}</div>
              <div>{t('components:tradeTabbedInterface.noData')}</div>
            </div>
          )}
          {activeTab === 'assert' && (
            <div className='text-trading-page-common px-2 py-2'>
              <div className="text-lg font-medium mb-4">{t('components:tradeTabbedInterface.assets')}</div>
              <div>{t('components:tradeTabbedInterface.noData')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
