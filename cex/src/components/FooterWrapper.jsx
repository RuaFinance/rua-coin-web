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
 * FooterWrapper组件 - Footer包装器
 * 
 * 根据FooterContext中的状态条件渲染不同类型的Footer
 * 支持完整版、简化版和隐藏模式
 * 作为Footer显示逻辑的统一入口点
 */

import React from 'react';
import { useFooter } from '../contexts/FooterContext';
import Footer from './Footer';
import SimplifiedFooter from './SimplifiedFooter';

const FooterWrapper = () => {
  const { showFooter, footerType } = useFooter();

  if (!showFooter) {
    return null;
  }

  switch (footerType) {
    case 'simplified':
      return <SimplifiedFooter />;
    case 'full':
    default:
      return <Footer />;
  }
};

export default FooterWrapper; 