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

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

const C2CTradePage = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { crypto } = useParams();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // 从URL参数获取货币信息
  const currencyFromParams = searchParams.get('fiat') || crypto || 'USD';

  useEffect(() => {
    // 模拟加载数据
    const loadData = async () => {
      try {
        setIsLoading(true);
        // 这里将来会添加实际的API调用
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Failed to load C2C data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currencyFromParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            C2C {t('pages:trading.title')} - {currencyFromParams} - 当前页面待开发...
          </h1>
          <p className="text-black">
            {t('pages:c2c.description')}
          </p>
        </div>

        {/* 测试信息 */}
        <div className="bg-[#eaecf0] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">路由测试信息</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-black">当前法币:</span> <span className="text-yellow-400">{currencyFromParams}</span></p>
            <p><span className="text-black">URL参数:</span> <span className="text-green-400">{searchParams.toString()}</span></p>
            <p><span className="text-black">路由参数:</span> <span className="text-blue-400">{JSON.stringify({ crypto })}</span></p>
          </div>
        </div>

        {/* 基本功能区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 买入区域 */}
          <div className="bg-[#eaecf0] rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 text-green-400">
                {t('pages:c2c.buy')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('pages:c2c.amount')}
                  </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-[#eaecf0] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                {t('pages:c2c.buyNow')}
              </button>
            </div>
          </div>

          {/* 卖出区域 */}
          <div className="bg-[#eaecf0] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-400">
              {t('pages:c2c.sell')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('pages:c2c.amount')}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-[#eaecf0] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                {t('pages:c2c.sellNow')}
              </button>
            </div>
          </div>
        </div>

        {/* 状态信息 */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            {t('pages:c2c.status')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default C2CTradePage; 