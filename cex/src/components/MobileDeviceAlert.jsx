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
 * 移动设备访问提示组件
 * 
 * 功能：
 * - 检测移动设备访问
 * - 首次访问时显示提示弹窗
 * - 自动关闭提示
 * - 支持国际化
 * - 提供不再提示选项
 */

import { notification, Button } from 'antd';
import { SmartphoneIcon, TabletIcon, MonitorIcon, XIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useMobileDetection from '../hooks/useMobileDetection';
import '../styles/mobileAlert.css';

const MobileDeviceAlert = () => {
  const { t } = useTranslation(['common']);
  const deviceInfo = useMobileDetection();
  const hasShownAlert = useRef(false);

  // 检测是否首次访问
  const isFirstVisit = () => {
    const hasVisited = localStorage.getItem('mobileAlertShown');
    return !hasVisited;
  };

  // 标记已显示提示
  const markAlertShown = () => {
    localStorage.setItem('mobileAlertShown', 'true');
  };

  // 标记不再提示
  const markNeverShowAgain = () => {
    localStorage.setItem('mobileAlertNeverShow', 'true');
  };

  // 检查是否设置了不再提示
  const shouldNeverShow = () => {
    return localStorage.getItem('mobileAlertNeverShow') === 'true';
  };

  // 获取设备图标
  const getDeviceIcon = () => {
    switch (deviceInfo.deviceType) {
      case 'mobile':
        return <SmartphoneIcon className="text-blue-500" size={24} />;
      case 'tablet':
        return <TabletIcon className="text-orange-500" size={24} />;
      default:
        return <MonitorIcon className="text-green-500" size={24} />;
    }
  };

  // 获取设备特定的消息
  const getDeviceMessage = () => {
    if (deviceInfo.isMobile) {
      return {
        title: t('common:mobileAlert.title'),
        description: t('common:mobileAlert.description')
      };
    } else if (deviceInfo.isTablet) {
      return {
        title: t('common:mobileAlert.tabletTitle'),
        description: t('common:mobileAlert.tabletDescription')
      };
    }
    return null;
  };

  // 显示移动设备提示
  const showMobileAlert = () => {
    const message = getDeviceMessage();
    if (!message) return;

    const key = `mobile-alert-${Date.now()}`;
    
    notification.info({
      key,
      message: message.title,
      description: (
        <div>
          <p className="mb-3">{message.description}</p>
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                markAlertShown();
                notification.close(key);
              }}
            >
              {t('common:mobileAlert.understood')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                markNeverShowAgain();
                notification.close(key);
              }}
            >
              {t('common:mobileAlert.neverShowAgain')}
            </Button>
          </div>
        </div>
      ),
      icon: getDeviceIcon(),
      placement: 'top',
      duration: 10, // 10秒后自动关闭
      style: {
        marginTop: 60, // 避免与header重叠
        width: 350, // 固定宽度
      },
      className: 'mobile-device-alert',
    });
  };

  useEffect(() => {
    // 避免重复显示
    if (hasShownAlert.current) return;
    
    // 检查是否设置了不再提示
    if (shouldNeverShow()) return;
    
    // 延迟检测，确保页面完全加载
    const timer = setTimeout(() => {
      if ((deviceInfo.isMobile || deviceInfo.isTablet) && isFirstVisit()) {
        showMobileAlert();
        hasShownAlert.current = true;
      }
    }, 1500); // 1.5秒后检测

    return () => clearTimeout(timer);
  }, [deviceInfo.isMobile, deviceInfo.isTablet, deviceInfo.deviceType, t]);

  // 这个组件不渲染任何内容，只是用于逻辑处理
  return null;
};

export default MobileDeviceAlert; 