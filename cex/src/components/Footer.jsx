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
 * Footer组件 - 网站页脚主组件
 * 
 * 提供完整的页脚功能，包括：
 * - 产品服务导航
 * - 公司信息展示
 * - 社交媒体链接
 * - 法律合规信息
 * - 风险提示声明
 * - APP下载区域
 * 
 * 支持响应式设计和交互动画效果
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Shield,
  HelpCircle,
  Users,
  TrendingUp,
  BookOpen,
  Download,
  Smartphone
} from 'lucide-react';
import { formatUrl } from '../router/config';
import '../styles/footer.css';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({
    products: false,
    services: false,
    support: false,
    company: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerData = {
    products: {
      title: "产品",
      items: [
        { name: "现货交易", href: "/trading/BTC", icon: TrendingUp },
        { name: "合约交易", href: "#", icon: TrendingUp },
        { name: "杠杆交易", href: "#", icon: TrendingUp },
        { name: "理财", href: "#", icon: TrendingUp },
        { name: "矿池", href: "#", icon: TrendingUp },
        { name: "NFT", href: "#", icon: TrendingUp }
      ]
    },
    services: {
      title: "服务",
      items: [
        { name: "API文档", href: "#", icon: BookOpen },
        { name: "开发者中心", href: "#", icon: BookOpen },
        { name: "机构服务", href: "#", icon: Users },
        { name: "企业服务", href: "#", icon: Users },
        { name: "流动性服务", href: "#", icon: TrendingUp },
        { name: "托管服务", href: "#", icon: Shield }
      ]
    },
    support: {
      title: "支持",
      items: [
        { name: "帮助中心", href: "#", icon: HelpCircle },
        { name: "联系我们", href: "#", icon: Mail },
        { name: "用户反馈", href: "#", icon: Users },
        { name: "状态页面", href: "#", icon: TrendingUp },
        { name: "下载APP", href: "#", icon: Download },
        { name: "移动端", href: "#", icon: Smartphone }
      ]
    },
    company: {
      title: "公司",
      items: [
        { name: "关于我们", href: "#", icon: Users },
        { name: "新闻公告", href: "#", icon: BookOpen },
        { name: "招聘信息", href: "#", icon: Users },
        { name: "合作伙伴", href: "#", icon: Users },
        { name: "投资者关系", href: "#", icon: TrendingUp },
        { name: "媒体资源", href: "#", icon: BookOpen }
      ]
    }
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/ruacoin", color: "hover:text-blue-400" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/ruacoin", color: "hover:text-blue-600" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/ruacoin", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/ruacoin", color: "hover:text-blue-700" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/ruacoin", color: "hover:text-red-500" }
  ];

  const legalLinks = [
    { name: "服务条款", href: "#" },
    { name: "隐私政策", href: "#" },
    { name: "Cookie政策", href: "#" },
    { name: "风险披露", href: "#" },
    { name: "反洗钱政策", href: "#" },
    { name: "用户协议", href: "#" }
  ];

  const contactInfo = [
    { icon: Mail, text: "support@ruacoin.com", href: "mailto:support@ruacoin.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "新加坡", href: "#" }
  ];

  const FooterSection = ({ title, items, sectionKey }) => (
    <div className="space-y-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left text-white font-semibold text-sm md:text-base"
      >
        {title}
        <span className="md:hidden">
          {expandedSections[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      
      <div className={`space-y-3 ${expandedSections[sectionKey] ? 'block' : 'hidden md:block'}`}>
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            <item.icon size={14} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer className="bg-black text-white footer-container footer-gradient">
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 footer-content-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo和描述 */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold gradient-text">RuaCoin</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              全球领先的数字资产交易平台，为用户提供安全、便捷、专业的加密货币交易服务。
            </p>
            
            {/* 社交媒体链接 */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-200 hover:scale-110 transform footer-social-icon`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            {/* 联系信息 */}
            <div className="space-y-2">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm footer-contact-info"
                >
                  <contact.icon size={14} />
                  <span>{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 产品 */}
          <FooterSection 
            title={footerData.products.title}
            items={footerData.products.items}
            sectionKey="products"
          />

          {/* 服务 */}
          <FooterSection 
            title={footerData.services.title}
            items={footerData.services.items}
            sectionKey="services"
          />

          {/* 支持 */}
          <FooterSection 
            title={footerData.support.title}
            items={footerData.support.items}
            sectionKey="support"
          />

          {/* 公司 */}
          <FooterSection 
            title={footerData.company.title}
            items={footerData.company.items}
            sectionKey="company"
          />
        </div>

        {/* 下载APP区域 */}
        <div className="mt-12 pt-8 border-t border-gray-800 footer-divider">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2">下载RuaCoin APP</h3>
              <p className="text-gray-400 text-sm">随时随地交易，掌握市场动态</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 footer-app-download"
              >
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">A</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 footer-app-download"
              >
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">G</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 底部法律信息 */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* 版权信息 */}
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 RuaCoin. 保留所有权利。</p>
              <p className="mt-1">RuaCoin Technology Pte. Ltd. | 注册号: 202500000A</p>
            </div>

            {/* 法律链接 */}
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200 footer-legal-link"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* 风险提示 */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-center text-gray-500 text-xs leading-relaxed footer-risk-disclosure">
              <p>
                风险提示：加密货币交易存在高风险，价格波动剧烈。在投资前请充分了解相关风险，
                并根据自身财务状况谨慎投资。过往表现不代表未来收益。
              </p>
              <p className="mt-2">
                本网站提供的所有信息仅供参考，不构成投资建议。请咨询专业投资顾问。
              </p>
            </div>
          </div>

          {/* 认证和合规信息 */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2 footer-certification">
                <Shield size={16} />
                <span className="text-xs">SSL加密保护</span>
              </div>
              <div className="flex items-center space-x-2 footer-certification">
                <Globe size={16} />
                <span className="text-xs">全球服务</span>
              </div>
              <div className="flex items-center space-x-2 footer-certification">
                <Users size={16} />
                <span className="text-xs">24/7客户支持</span>
              </div>
              <div className="flex items-center space-x-2 footer-certification">
                <TrendingUp size={16} />
                <span className="text-xs">实时行情</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 