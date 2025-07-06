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
 * FooterTestPage - Footer测试页面
 * 
 * 用于测试Footer组件的各种功能和状态：
 * - 显示/隐藏控制测试
 * - 不同类型Footer切换
 * - 动画效果验证
 * - 响应式布局测试
 * 
 * 访问路径：http://host:port/footer-test
 */

import React from 'react';
import { useFooter } from '../contexts/FooterContext';
import { useFooterControl, useHideFooter, useShowFooter } from '../hooks/useFooterControl';

const FooterTestPage = () => {
  const { showFooter, footerType, setShowFooter, setFooterType } = useFooter();
  const { setShowFooter: setShowFooterControl } = useFooterControl();

  const handleToggleFooter = () => {
    setShowFooter(!showFooter);
  };

  const handleChangeFooterType = (type) => {
    setFooterType(type);
  };

  const handleOverrideFooter = (show) => {
    setShowFooterControl(show, true);
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Footer 测试页面</h1>
        <p className="text-gray-600 mb-8">
          这个页面用于测试Footer组件的不同状态和控制功能
        </p>
      </div>

      {/* 当前状态显示 */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">当前状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Footer显示状态: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              showFooter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {showFooter ? '显示' : '隐藏'}
            </span>
          </div>
          <div>
            <span className="font-medium">Footer类型: </span>
            <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
              {footerType === 'full' ? '完整版' : footerType === 'simplified' ? '简化版' : '隐藏'}
            </span>
          </div>
        </div>
      </div>

      {/* 基本控制 */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">基本控制</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleToggleFooter}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showFooter ? '隐藏Footer' : '显示Footer'}
          </button>
          
          <button
            onClick={() => handleChangeFooterType('full')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            切换到完整版Footer
          </button>
          
          <button
            onClick={() => handleChangeFooterType('simplified')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            切换到简化版Footer
          </button>
        </div>
      </div>

      {/* 高级控制 */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">高级控制</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleOverrideFooter(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            强制显示Footer
          </button>
          
          <button
            onClick={() => handleOverrideFooter(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            强制隐藏Footer
          </button>
        </div>
      </div>

      {/* 页面导航 */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">页面导航测试</h2>
        <p className="text-gray-600 mb-4">
          点击下面的链接测试不同页面的Footer显示效果：
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            首页 (显示完整Footer)
          </a>
          
          <a
            href="/trading/BTC"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            交易页面 (隐藏Footer)
          </a>
          
          <a
            href="/login"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            登录页面 (隐藏Footer)
          </a>
          
          <a
            href="/register"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            注册页面 (隐藏Footer)
          </a>
        </div>
      </div>

      {/* 说明文档 */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">使用说明</h2>
        <div className="space-y-3 text-blue-700">
          <p><strong>自动控制：</strong>Footer会根据当前页面路径自动显示或隐藏</p>
          <p><strong>手动控制：</strong>可以使用Hook或Context API手动控制Footer状态</p>
          <p><strong>Footer类型：</strong>支持完整版和简化版两种显示模式</p>
          <p><strong>动画效果：</strong>Footer的显示和隐藏都有平滑的过渡动画</p>
        </div>
      </div>

      {/* 测试内容区域 */}
      <div className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">测试内容区域</h2>
        <p className="text-gray-600 mb-4">
          这个区域用于测试页面内容的布局，确保Footer不会影响主要内容。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">测试卡片 {item}</h3>
              <p className="text-gray-600">
                这是一个测试卡片，用于验证页面布局和Footer的交互效果。
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterTestPage; 