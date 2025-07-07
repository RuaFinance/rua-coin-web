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
 * 设备检测功能测试页面
 * 
 * 功能：
 * - 显示当前设备信息
 * - 清除提示状态
 * - 手动触发提示
 * - 设备检测结果展示
 */

import { Card, Button, Space, Descriptions, Badge, message } from 'antd';
import { 
  SmartphoneIcon, 
  TabletIcon, 
  MonitorIcon, 
  RefreshCwIcon,
  TrashIcon,
  AlertCircleIcon 
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useMobileDetection from '../hooks/useMobileDetection';
import deviceDetection from '../utils/deviceDetection';

const DeviceTestPage = () => {
  const { t } = useTranslation(['common']);
  const deviceInfo = useMobileDetection();
  const [fullDeviceInfo, setFullDeviceInfo] = useState(null);
  const [storageInfo, setStorageInfo] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // 获取完整设备信息
  const getFullDeviceInfo = () => {
    const info = deviceDetection.getFullDeviceInfo();
    setFullDeviceInfo(info);
  };

  // 获取存储信息
  const getStorageInfo = () => {
    const keys = [
      'mobileAlertShown',
      'mobileAlertNeverShow'
    ];
    
    const info = {};
    keys.forEach(key => {
      info[key] = localStorage.getItem(key) || 'null';
    });
    setStorageInfo(info);
  };

  // 清除所有提示状态
  const clearAllAlerts = () => {
    const keys = [
      'mobileAlertShown',
      'mobileAlertNeverShow'
    ];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    message.success('所有提示状态已清除，请刷新页面测试');
    getStorageInfo();
  };

  // 刷新页面
  const refreshPage = () => {
    window.location.reload();
  };

  // 设置过期时间戳（用于测试）
  const setExpiredTimestamp = () => {
    const sixMinutesAgo = Date.now() - (6 * 60 * 1000); // 6分钟前
    localStorage.setItem('mobileAlertShown', sixMinutesAgo.toString());
    message.success('已设置为6分钟前的时间戳，现在刷新页面应该会弹窗');
    getStorageInfo();
  };

  // 获取设备图标
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <SmartphoneIcon className="text-blue-500" size={20} />;
      case 'tablet':
        return <TabletIcon className="text-orange-500" size={20} />;
      default:
        return <MonitorIcon className="text-green-500" size={20} />;
    }
  };

  // 获取设备状态标签
  const getDeviceStatusBadge = (type) => {
    const colors = {
      mobile: 'blue',
      tablet: 'orange',
      desktop: 'green'
    };
    return <Badge color={colors[type] || 'default'} text={type} />;
  };

  useEffect(() => {
    getFullDeviceInfo();
    getStorageInfo();
    
    // 每秒更新时间和存储信息
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      getStorageInfo();
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            设备检测功能测试
          </h1>
          <p className="text-gray-600">
            测试移动设备检测和提示功能
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本设备信息 */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                {getDeviceIcon(deviceInfo.deviceType)}
                <span>基本设备信息</span>
              </div>
            }
            extra={
              <Space>
                <Button 
                  icon={<RefreshCwIcon size={16} />}
                  onClick={getFullDeviceInfo}
                >
                  刷新
                </Button>
              </Space>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="设备类型">
                {getDeviceStatusBadge(deviceInfo.deviceType)}
              </Descriptions.Item>
              <Descriptions.Item label="是否移动设备">
                <Badge 
                  status={deviceInfo.isMobile ? 'success' : 'default'} 
                  text={deviceInfo.isMobile ? '是' : '否'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="是否平板设备">
                <Badge 
                  status={deviceInfo.isTablet ? 'success' : 'default'} 
                  text={deviceInfo.isTablet ? '是' : '否'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="是否桌面设备">
                <Badge 
                  status={deviceInfo.isDesktop ? 'success' : 'default'} 
                  text={deviceInfo.isDesktop ? '是' : '否'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="屏幕尺寸">
                {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 详细设备信息 */}
          <Card 
            title="详细设备信息"
            extra={
              <Button 
                icon={<RefreshCwIcon size={16} />}
                onClick={getFullDeviceInfo}
              >
                刷新
              </Button>
            }
          >
            {fullDeviceInfo && (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="操作系统">
                  <Badge color="blue" text={fullDeviceInfo.os} />
                </Descriptions.Item>
                <Descriptions.Item label="浏览器">
                  <Badge color="green" text={fullDeviceInfo.browser} />
                </Descriptions.Item>
                <Descriptions.Item label="像素比">
                  {deviceDetection.getPixelRatio()}
                </Descriptions.Item>
                <Descriptions.Item label="设备方向">
                  {deviceDetection.getOrientation()}
                </Descriptions.Item>
                <Descriptions.Item label="网络类型">
                  {deviceDetection.getNetworkType()}
                </Descriptions.Item>
                <Descriptions.Item label="触摸支持">
                  <Badge 
                    status={fullDeviceInfo.features.touch ? 'success' : 'default'} 
                    text={fullDeviceInfo.features.touch ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>

          {/* 提示状态管理 */}
          <Card 
            title="提示状态管理"
            extra={
              <Space>
                <Button 
                  icon={<RefreshCwIcon size={16} />}
                  onClick={getStorageInfo}
                >
                  刷新
                </Button>
                <Button 
                  danger
                  icon={<TrashIcon size={16} />}
                  onClick={clearAllAlerts}
                >
                  清除所有
                </Button>
              </Space>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="移动设备提示时间戳">
                <div>
                  {storageInfo.mobileAlertShown !== 'null' ? (
                    <div>
                      <Badge status="success" text={`已记录: ${new Date(parseInt(storageInfo.mobileAlertShown)).toLocaleString()}`} />
                      <div className="text-xs text-gray-500 mt-1">
                        距离现在: {Math.floor((Date.now() - parseInt(storageInfo.mobileAlertShown)) / 1000)}秒
                        {(Date.now() - parseInt(storageInfo.mobileAlertShown)) > 5 * 60 * 1000 ? ' (已过期)' : ' (有效期内)'}
                      </div>
                    </div>
                  ) : (
                    <Badge status="default" text="未设置" />
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="移动设备永不显示">
                <Badge 
                  status={storageInfo.mobileAlertNeverShow === 'true' ? 'error' : 'default'} 
                  text={storageInfo.mobileAlertNeverShow || '未设置'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="当前UserAgent">
                <div className="text-xs text-gray-600 break-all">
                  {navigator.userAgent}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="当前屏幕尺寸">
                <div>
                  {window.innerWidth} × {window.innerHeight}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="当前时间">
                <div className="text-sm">
                  {currentTime.toLocaleString()}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 功能支持信息 */}
          <Card title="功能支持信息">
            {fullDeviceInfo && (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="本地存储">
                  <Badge 
                    status={fullDeviceInfo.features.localStorage ? 'success' : 'error'} 
                    text={fullDeviceInfo.features.localStorage ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="WebGL">
                  <Badge 
                    status={fullDeviceInfo.features.webgl ? 'success' : 'error'} 
                    text={fullDeviceInfo.features.webgl ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="地理位置">
                  <Badge 
                    status={fullDeviceInfo.features.geolocation ? 'success' : 'error'} 
                    text={fullDeviceInfo.features.geolocation ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="通知">
                  <Badge 
                    status={fullDeviceInfo.features.notification ? 'success' : 'error'} 
                    text={fullDeviceInfo.features.notification ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Service Worker">
                  <Badge 
                    status={fullDeviceInfo.features.serviceWorker ? 'success' : 'error'} 
                    text={fullDeviceInfo.features.serviceWorker ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="WebSocket">
                  <Badge 
                    status={fullDeviceInfo.features.webSocket ? 'success' : 'error'} 
                    text={fullDeviceInfo.features.webSocket ? '支持' : '不支持'} 
                  />
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 text-center">
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<RefreshCwIcon size={20} />}
              onClick={refreshPage}
            >
              刷新页面测试提示
            </Button>
            <Button 
              danger
              size="large"
              icon={<TrashIcon size={20} />}
              onClick={clearAllAlerts}
            >
              清除所有提示状态
            </Button>
            <Button 
              type="default"
              size="large"
              onClick={setExpiredTimestamp}
            >
              模拟6分钟前访问
            </Button>
          </Space>
        </div>

        {/* 使用说明 */}
        <Card title="使用说明" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="text-blue-500 mt-1" size={16} />
              <div>
                <p className="font-medium">测试移动设备提示：</p>
                <p className="text-gray-600">
                  使用浏览器开发者工具切换到移动设备模式，然后清除提示状态并刷新页面。提示会在首次访问时显示。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="text-orange-500 mt-1" size={16} />
              <div>
                <p className="font-medium">测试5分钟过期机制：</p>
                <p className="text-gray-600">
                  点击"模拟6分钟前访问"按钮，然后刷新页面。由于时间戳已过期，会重新显示提示。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="text-green-500 mt-1" size={16} />
              <div>
                <p className="font-medium">功能特性：</p>
                <p className="text-gray-600">
                  • 关闭网站重新进入会弹窗（如果超过5分钟）<br/>
                  • 5分钟内不会重复弹窗<br/>
                  • 页面间跳转不会重复弹窗<br/>
                  • 时间戳实时显示，可观察过期状态
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeviceTestPage; 