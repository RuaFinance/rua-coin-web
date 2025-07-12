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

import { useState, useEffect, useCallback } from 'react';

/**
 * 自定义Hook用于检测屏幕尺寸变化
 * @returns {Object} 包含屏幕尺寸信息的对象
 */
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    isLandscape: window.innerHeight < window.innerWidth,
    isPortrait: window.innerHeight >= window.innerWidth,
  });

  const updateScreenSize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setScreenSize({
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isLandscape: height < width,
      isPortrait: height >= width,
    });
  }, []);

  useEffect(() => {
    // 初始化
    updateScreenSize();

    // 监听窗口大小变化
    window.addEventListener('resize', updateScreenSize);
    
    // 监听设备方向变化（移动设备）
    window.addEventListener('orientationchange', () => {
      // 延迟更新以确保方向变化完成
      setTimeout(updateScreenSize, 100);
    });

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, [updateScreenSize]);

  return screenSize;
};

export default useScreenSize; 