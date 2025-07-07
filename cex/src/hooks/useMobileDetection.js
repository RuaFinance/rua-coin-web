/**
 * 移动设备检测 Hook
 * 
 * 功能：
 * - 检测移动设备类型
 * - 检测屏幕尺寸变化
 * - 提供设备信息
 */

import { useState, useEffect } from 'react';

const useMobileDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: '',
    deviceType: 'desktop'
  });

  // 检测设备类型的函数
  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 移动设备关键词
    const mobileKeywords = [
      'android', 'iphone', 'ipod', 'blackberry', 
      'windows phone', 'mobile', 'webos', 'opera mini'
    ];
    
    // 平板设备关键词
    const tabletKeywords = [
      'ipad', 'android', 'tablet', 'kindle', 'playbook'
    ];
    
    // 检查 UserAgent
    const isMobileUserAgent = mobileKeywords.some(keyword => 
      userAgent.includes(keyword)
    );
    
    const isTabletUserAgent = tabletKeywords.some(keyword => 
      userAgent.includes(keyword)
    ) && !userAgent.includes('mobile');
    
    // 检查屏幕尺寸
    const isMobileScreen = screenWidth < 768;
    const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
    const isDesktopScreen = screenWidth >= 1024;
    
    // 检查触摸支持
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 综合判断 - 简化逻辑，优先屏幕尺寸
    let deviceType = 'desktop';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;
    
    if (isMobileUserAgent || isMobileScreen) {
      deviceType = 'mobile';
      isMobile = true;
    } else if (isTabletUserAgent || isTabletScreen) {
      deviceType = 'tablet';
      isTablet = true;
    } else {
      deviceType = 'desktop';
      isDesktop = true;
    }
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth,
      screenHeight,
      userAgent,
      deviceType
    };
  };

  // 处理窗口尺寸变化
  const handleResize = () => {
    const newDeviceInfo = detectDevice();
    setDeviceInfo(newDeviceInfo);
  };

  useEffect(() => {
    // 初始检测
    const initialDeviceInfo = detectDevice();
    setDeviceInfo(initialDeviceInfo);
    
    // 监听窗口尺寸变化
    window.addEventListener('resize', handleResize);
    
    // 清理监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
};

export default useMobileDetection; 