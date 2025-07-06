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
 * FooterAnimation组件 - 带动画效果的Footer
 * 
 * 为Footer提供平滑的显示/隐藏过渡动画
 * 使用CSS transform和opacity实现动画效果
 * 支持动画状态管理和性能优化
 */

import React, { useState, useEffect } from 'react';
import { useFooter } from '../contexts/FooterContext';
import Footer from './Footer';
import SimplifiedFooter from './SimplifiedFooter';

const FooterAnimation = () => {
  const { showFooter, footerType } = useFooter();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showFooter && !isVisible) {
      // 显示footer
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(false);
      }, 50); // 短暂延迟确保动画效果
      return () => clearTimeout(timer);
    } else if (!showFooter && isVisible) {
      // 隐藏footer
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300); // 等待动画完成
      return () => clearTimeout(timer);
    }
  }, [showFooter, isVisible]);

  if (!showFooter && !isVisible) {
    return null;
  }

  const getFooterComponent = () => {
    switch (footerType) {
      case 'simplified':
        return <SimplifiedFooter />;
      case 'full':
      default:
        return <Footer />;
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      } ${
        isAnimating ? 'pointer-events-none' : ''
      }`}
    >
      {getFooterComponent()}
    </div>
  );
};

export default FooterAnimation; 