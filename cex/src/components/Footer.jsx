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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['components', 'common']);
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
      title: t('components:footer.products'),
      items: [
        { name: t('components:footer.spotTrading'), href: "/trading/BTC", icon: TrendingUp },
        { name: t('components:footer.futuresTrading'), href: "#", icon: TrendingUp },
        { name: t('components:footer.marginTrading'), href: "#", icon: TrendingUp },
        { name: t('components:footer.earn'), href: "#", icon: TrendingUp },
        { name: t('components:footer.pool'), href: "#", icon: TrendingUp },
        { name: t('components:footer.nft'), href: "#", icon: TrendingUp }
      ]
    },
    services: {
      title: t('components:footer.services'),
      items: [
        { name: t('components:footer.apiDocs'), href: "#", icon: BookOpen },
        { name: t('components:footer.developerCenter'), href: "#", icon: BookOpen },
        { name: t('components:footer.institutionalServices'), href: "#", icon: Users },
        { name: t('components:footer.enterpriseServices'), href: "#", icon: Users },
        { name: t('components:footer.liquidityServices'), href: "#", icon: TrendingUp },
        { name: t('components:footer.custodyServices'), href: "#", icon: Shield }
      ]
    },
    support: {
      title: t('components:footer.support'),
      items: [
        { name: t('components:footer.helpCenter'), href: "#", icon: HelpCircle },
        { name: t('components:footer.contactUs'), href: "#", icon: Mail },
        { name: t('components:footer.userFeedback'), href: "#", icon: Users },
        { name: t('components:footer.statusPage'), href: "#", icon: TrendingUp },
        { name: t('components:footer.downloadApp'), href: "#", icon: Download },
        { name: t('components:footer.mobile'), href: "#", icon: Smartphone }
      ]
    },
    company: {
      title: t('components:footer.company'),
      items: [
        { name: t('components:footer.aboutUs'), href: "#", icon: Users },
        { name: t('components:footer.news'), href: "#", icon: BookOpen },
        { name: t('components:footer.careers'), href: "#", icon: Users },
        { name: t('components:footer.partners'), href: "#", icon: Users },
        { name: t('components:footer.investorRelations'), href: "#", icon: TrendingUp },
        { name: t('components:footer.mediaResources'), href: "#", icon: BookOpen }
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
    { name: t('common:termsOfService'), href: "#" },
    { name: t('common:privacyPolicy'), href: "#" },
    { name: t('common:cookiePolicy'), href: "#" },
    { name: t('common:riskDisclosure'), href: "#" },
    { name: t('common:amlPolicy'), href: "#" },
    { name: t('common:userAgreement'), href: "#" }
  ];

  const contactInfo = [
    { icon: Mail, text: "support@ruacoin.com", href: "mailto:support@ruacoin.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: t('common:singapore'), href: "#" }
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
              {t('components:footer.description')}
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
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  <contact.icon size={14} />
                  <span>{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 产品和服务栏目 */}
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key} className="lg:col-span-1">
              <FooterSection 
                title={section.title}
                items={section.items}
                sectionKey={key}
              />
            </div>
          ))}
        </div>

        {/* APP下载区域 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('components:footer.downloadApp')}
              </h3>
              <p className="text-gray-400 text-sm">
                {t('components:footer.downloadAppDescription', '随时随地进行数字资产交易')}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-lg text-white hover:border-white transition-colors duration-200"
              >
                <Download size={20} className="mr-2" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">{t('common:downloadOn')}</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-lg text-white hover:border-white transition-colors duration-200"
              >
                <Download size={20} className="mr-2" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">{t('common:downloadOn')}</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 认证和合规信息 */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h4 className="text-sm font-semibold text-white mb-2">
                {t('components:footer.licenses')}
              </h4>
              <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-4 text-xs text-gray-400">
                <span className="flex items-center">
                  <Shield size={12} className="mr-1" />
                  {t('components:footer.certifications')}
                </span>
                <span className="flex items-center">
                  <Globe size={12} className="mr-1" />
                  {t('components:footer.globalService', '全球服务')}
                </span>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <h4 className="text-sm font-semibold text-white mb-2">
                {t('components:footer.followUs')}
              </h4>
              <div className="text-xs text-gray-400">
                {t('components:footer.socialMedia')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权和法律信息 */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* 版权信息 */}
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 RuaCoin. {t('components:footer.allRightsReserved')}</p>
              <p className="mt-1">RuaCoin Technology Pte. Ltd. | {t('common:registrationNumber')}: 202500000A</p>
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
                <strong>{t('components:footer.riskWarning')}: </strong>
                {t('components:footer.riskContent1')}
              </p>
              <p className="mt-2">
                {t('components:footer.riskContent2')}
              </p>
            </div>
          </div>

          {/* 认证和合规信息 */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <div className="flex flex-wrap items-center justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <Shield size={12} className="mr-1" />
                  SSL {t('common:encryption')}
                </span>
                <span className="flex items-center">
                  <Users size={12} className="mr-1" />
                  24/7 {t('common:customerSupport')}
                </span>
                <span className="flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  {t('common:realTimeData')}
                </span>
                <span className="flex items-center">
                  <Globe size={12} className="mr-1" />
                  {t('common:globalService')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 