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
 * 提示管理器组件
 * 
 * 功能：
 * - 管理移动设备访问提示
 * - 首次访问时显示提示弹窗
 * - 自动关闭提示
 * - 支持国际化
 */

import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useMobileDetection from '../hooks/useMobileDetection';

const AlertManager = () => {
  const { t } = useTranslation(['common']);
  const deviceInfo = useMobileDetection();
  const hasShownAlert = useRef(false);
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });

  // 检测是否首次访问（或者5分钟后重新访问）
  const isFirstVisit = () => {
    const lastShownTime = localStorage.getItem('mobileAlertShown');
    if (!lastShownTime) {
      return true; // 从未显示过
    }
    
    const now = Date.now();
    const lastShown = parseInt(lastShownTime);
    const fiveMinutes = 5 * 60 * 1000; // 5分钟 = 300000毫秒
    
    // 如果超过5分钟，则重置为首次访问
    if (now - lastShown > fiveMinutes) {
      localStorage.removeItem('mobileAlertShown'); // 清除过期的记录
      return true;
    }
    
    return false; // 5分钟内已经显示过
  };

  // 标记已显示提示（存储当前时间戳）
  const markAlertShown = () => {
    const now = Date.now();
    localStorage.setItem('mobileAlertShown', now.toString());
  };

  // 标记不再提示
  const markNeverShowAgain = () => {
    localStorage.setItem('mobileAlertNeverShow', 'true');
  };

  // 检查是否设置了不再提示
  const shouldNeverShow = () => {
    return localStorage.getItem('mobileAlertNeverShow') === 'true';
  };

  // 显示移动设备提示
  const showMobileAlert = () => {
    api.warning({
      message: t('common:mobileAlert.title'),
      description: t('common:mobileAlert.description'),
      icon: <SmileOutlined style={{ color: '#faad14' }} />,
      placement: 'topRight',
      duration: 8,
      onClose: () => {
        markAlertShown();
      }
    });
  };

  // 显示平板设备提示
  const showTabletAlert = () => {
    api.warning({
      message: t('common:mobileAlert.tabletTitle'),
      description: t('common:mobileAlert.tabletDescription'),
      icon: <SmileOutlined style={{ color: '#faad14' }} />,
      placement: 'topRight',
      duration: 8,
      onClose: () => {
        markAlertShown();
      }
    });
  };

  useEffect(() => {
    // 确保设备信息已加载
    if (!deviceInfo.screenWidth) return;
    
    // 避免重复显示
    if (hasShownAlert.current) return;
    
    // 检查是否设置了不再提示
    if (shouldNeverShow()) return;
    
    // 检查是否首次访问
    if (!isFirstVisit()) return;
    
    // 延迟检测，确保页面完全加载
    const timer = setTimeout(() => {
      console.log('Device detection:', deviceInfo); // 调试信息
      
      if (deviceInfo.isMobile) {
        console.log('Showing mobile alert'); // 调试信息
        showMobileAlert();
        hasShownAlert.current = true;
      } else if (deviceInfo.isTablet) {
        console.log('Showing tablet alert'); // 调试信息
        showTabletAlert();
        hasShownAlert.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [deviceInfo, api, t]);

  return contextHolder;
};

export default AlertManager; 