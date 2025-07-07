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
 * 设备检测工具类
 * 
 * 功能：
 * - 设备类型检测
 * - 浏览器检测
 * - 操作系统检测
 * - 特性检测
 */

class DeviceDetection {
  constructor() {
    this.userAgent = navigator.userAgent.toLowerCase();
    this.platform = navigator.platform.toLowerCase();
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  /**
   * 检测设备类型
   * @returns {Object} 设备信息对象
   */
  detectDeviceType() {
    const mobileKeywords = [
      'android', 'iphone', 'ipod', 'blackberry', 
      'windows phone', 'mobile', 'webos', 'opera mini'
    ];
    
    const tabletKeywords = [
      'ipad', 'android', 'tablet', 'kindle', 'playbook'
    ];
    
    const isMobileUserAgent = mobileKeywords.some(keyword => 
      this.userAgent.includes(keyword)
    );
    
    const isTabletUserAgent = tabletKeywords.some(keyword => 
      this.userAgent.includes(keyword)
    ) && !this.userAgent.includes('mobile');
    
    const isMobileScreen = this.screenWidth < 768;
    const isTabletScreen = this.screenWidth >= 768 && this.screenWidth < 1024;
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let deviceType = 'desktop';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;
    
    if (isMobileUserAgent || (isMobileScreen && isTouchDevice)) {
      deviceType = 'mobile';
      isMobile = true;
    } else if (isTabletUserAgent || (isTabletScreen && isTouchDevice)) {
      deviceType = 'tablet';
      isTablet = true;
    } else {
      deviceType = 'desktop';
      isDesktop = true;
    }
    
    return {
      deviceType,
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight
    };
  }

  /**
   * 检测操作系统
   * @returns {String} 操作系统名称
   */
  detectOS() {
    if (this.userAgent.includes('iphone') || this.userAgent.includes('ipad')) {
      return 'ios';
    } else if (this.userAgent.includes('android')) {
      return 'android';
    } else if (this.userAgent.includes('windows')) {
      return 'windows';
    } else if (this.userAgent.includes('mac')) {
      return 'macos';
    } else if (this.userAgent.includes('linux')) {
      return 'linux';
    }
    return 'unknown';
  }

  /**
   * 检测浏览器
   * @returns {String} 浏览器名称
   */
  detectBrowser() {
    if (this.userAgent.includes('chrome') && !this.userAgent.includes('edg')) {
      return 'chrome';
    } else if (this.userAgent.includes('firefox')) {
      return 'firefox';
    } else if (this.userAgent.includes('safari') && !this.userAgent.includes('chrome')) {
      return 'safari';
    } else if (this.userAgent.includes('edg')) {
      return 'edge';
    } else if (this.userAgent.includes('opera') || this.userAgent.includes('opr')) {
      return 'opera';
    }
    return 'unknown';
  }

  /**
   * 检测是否支持特定功能
   * @returns {Object} 功能支持信息
   */
  detectFeatures() {
    return {
      touch: 'ontouchstart' in window,
      webgl: !!window.WebGLRenderingContext,
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      notification: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webSocket: 'WebSocket' in window,
      webRTC: 'RTCPeerConnection' in window
    };
  }

  /**
   * 获取完整的设备信息
   * @returns {Object} 完整设备信息
   */
  getFullDeviceInfo() {
    const deviceType = this.detectDeviceType();
    const os = this.detectOS();
    const browser = this.detectBrowser();
    const features = this.detectFeatures();
    
    return {
      ...deviceType,
      os,
      browser,
      features,
      userAgent: this.userAgent,
      platform: this.platform,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 检测是否为移动设备（包括手机和平板）
   * @returns {Boolean}
   */
  isMobileDevice() {
    const device = this.detectDeviceType();
    return device.isMobile || device.isTablet;
  }

  /**
   * 检测网络连接类型
   * @returns {String} 网络连接类型
   */
  getNetworkType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /**
   * 检测设备方向
   * @returns {String} 设备方向
   */
  getOrientation() {
    if (screen.orientation) {
      return screen.orientation.angle === 0 || screen.orientation.angle === 180 
        ? 'portrait' : 'landscape';
    }
    return this.screenWidth > this.screenHeight ? 'landscape' : 'portrait';
  }

  /**
   * 检测设备像素比
   * @returns {Number} 设备像素比
   */
  getPixelRatio() {
    return window.devicePixelRatio || 1;
  }
}

// 创建单例实例
const deviceDetection = new DeviceDetection();

export default deviceDetection; 