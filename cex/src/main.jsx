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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import './index.css'

// 初始化 i18n
import './i18n'

// 导入高级语言路由器
import AdvancedLanguageRouter from './components/LanguageRouter/AdvancedLanguageRouter'

// 导入语言检测服务初始化
import { useLanguageAnalytics } from './i18n/analytics/languageAnalytics'
import { initializeMiddleware } from './i18n/middleware/middlewareIntegration'
import { initializeLanguageDetection } from './i18n/services/languageDetectionService'

// 初始化语言系统
const initializeLanguageSystem = async () => {
  try {
    // 初始化语言检测
    await initializeLanguageDetection();
    console.log('Language detection system initialized');
    
    // 初始化中间件系统
    await initializeMiddleware();
    console.log('Middleware system initialized');
    
    // 初始化分析追踪系统
    const analytics = useLanguageAnalytics();
    analytics.initialize();
    console.log('Language analytics system initialized');
    
    // 追踪应用启动
    analytics.trackEvent('app_started', {
      source: 'main_entry',
      timestamp: Date.now(),
      version: '1.0.0'
    });
    
    console.log('🌍 Complete language system initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize language system:', error);
  }
};

// 启动语言系统
initializeLanguageSystem();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AdvancedLanguageRouter />
    </HelmetProvider>
  </StrictMode>,
)
