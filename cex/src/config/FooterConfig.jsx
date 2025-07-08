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
 * FooterConfig - Footer配置文件
 * 
 * 集中管理Footer的显示规则和内容配置：
 * - 路径匹配规则（隐藏/显示/简化版）
 * - 公司信息、联系方式、社交媒体
 * - 产品服务、法律链接等静态内容
 * - 风险提示和认证信息
 */

/**
 * Footer显示规则配置
 * 定义哪些路径需要隐藏footer
 */
export const FOOTER_DISPLAY_RULES = {
  // 完全隐藏footer的路径
  HIDE_FOOTER_PATHS: [
    '/trading',
    '/login', 
    '/register',
    '/404'
  ],
  
  // 部分隐藏footer的路径（只显示简化版）
  SIMPLIFIED_FOOTER_PATHS: [
    '/api',
    '/docs'
  ],
  
  // 强制显示footer的路径（即使匹配了隐藏规则）
  FORCE_SHOW_FOOTER_PATHS: [
    '/about',
    '/help',
    '/contact'
  ]
};

/**
 * Footer内容配置
 */
export const FOOTER_CONTENT_CONFIG = {
  // 公司信息
  company: {
    name: "RuaCoin",
    description: "全球领先的数字资产交易平台，为用户提供安全、便捷、专业的加密货币交易服务。",
    founded: "2025",
    location: "新加坡",
    registration: "RuaCoin Technology Pte. Ltd. | 注册号: 202500000A"
  },
  
  // 联系信息
  contact: {
    email: "support@ruacoin.com",
    phone: "+1 (555) 123-4567",
    address: "新加坡",
    businessHours: "24/7"
  },
  
  // 社交媒体
  socialMedia: [
    {
      name: "Twitter",
      url: "https://twitter.com/ruacoin",
      icon: "Twitter",
      color: "hover:text-blue-400"
    },
    {
      name: "Facebook", 
      url: "https://facebook.com/ruacoin",
      icon: "Facebook",
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/ruacoin", 
      icon: "Instagram",
      color: "hover:text-pink-500"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/ruacoin",
      icon: "Linkedin", 
      color: "hover:text-blue-700"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/ruacoin",
      icon: "Youtube",
      color: "hover:text-red-500"
    }
  ],
  
  // 产品链接
  products: [
    { name: "现货交易", url: "/trading/BTC", icon: "TrendingUp" },
    { name: "合约交易", url: "#", icon: "TrendingUp" },
    { name: "杠杆交易", url: "#", icon: "TrendingUp" },
    { name: "理财", url: "#", icon: "TrendingUp" },
    { name: "矿池", url: "#", icon: "TrendingUp" },
    { name: "NFT", url: "#", icon: "TrendingUp" }
  ],
  
  // 服务链接
  services: [
    { name: "API文档", url: "#", icon: "BookOpen" },
    { name: "开发者中心", url: "#", icon: "BookOpen" },
    { name: "机构服务", url: "#", icon: "Users" },
    { name: "企业服务", url: "#", icon: "Users" },
    { name: "流动性服务", url: "#", icon: "TrendingUp" },
    { name: "托管服务", url: "#", icon: "Shield" }
  ],
  
  // 支持链接
  support: [
    { name: "帮助中心", url: "#", icon: "HelpCircle" },
    { name: "联系我们", url: "#", icon: "Mail" },
    { name: "用户反馈", url: "#", icon: "Users" },
    { name: "状态页面", url: "#", icon: "TrendingUp" },
    { name: "下载APP", url: "#", icon: "Download" },
    { name: "移动端", url: "#", icon: "Smartphone" }
  ],
  
  // 公司链接
  companyLinks: [
    { name: "关于我们", url: "#", icon: "Users" },
    { name: "新闻公告", url: "#", icon: "BookOpen" },
    { name: "招聘信息", url: "#", icon: "Users" },
    { name: "合作伙伴", url: "#", icon: "Users" },
    { name: "投资者关系", url: "#", icon: "TrendingUp" },
    { name: "媒体资源", url: "#", icon: "BookOpen" }
  ],
  
  // 法律链接
  legal: [
    { name: "服务条款", url: "#" },
    { name: "隐私政策", url: "#" },
    { name: "Cookie政策", url: "#" },
    { name: "风险披露", url: "#" },
    { name: "反洗钱政策", url: "#" },
    { name: "用户协议", url: "#" }
  ],
  
  // 风险提示
  riskDisclosure: {
    title: "风险提示",
    content: [
      "加密货币交易存在高风险，价格波动剧烈。在投资前请充分了解相关风险，并根据自身财务状况谨慎投资。过往表现不代表未来收益。",
      "本网站提供的所有信息仅供参考，不构成投资建议。请咨询专业投资顾问。"
    ]
  },
  
  // 认证信息
  certifications: [
    { name: "SSL加密保护", icon: "Shield" },
    { name: "全球服务", icon: "Globe" },
    { name: "24/7客户支持", icon: "Users" },
    { name: "实时行情", icon: "TrendingUp" }
  ],
  
  // APP下载信息
  appDownload: {
    title: "下载RuaCoin APP",
    subtitle: "随时随地交易，掌握市场动态",
    appStore: {
      url: "#",
      text: "Download on",
      platform: "App Store"
    },
    googlePlay: {
      url: "#", 
      text: "Get it on",
      platform: "Google Play"
    }
  }
};

/**
 * 检查路径是否应该隐藏footer
 * @param {string} pathname - 当前路径
 * @returns {boolean} - 是否应该隐藏footer
 */
export const shouldHideFooter = (pathname) => {
  const { HIDE_FOOTER_PATHS, FORCE_SHOW_FOOTER_PATHS } = FOOTER_DISPLAY_RULES;
  
  // 首先检查是否强制显示
  if (FORCE_SHOW_FOOTER_PATHS.some(path => pathname.startsWith(path))) {
    return false;
  }
  
  // 然后检查是否应该隐藏
  return HIDE_FOOTER_PATHS.some(path => pathname.startsWith(path));
};

/**
 * 检查路径是否应该显示简化版footer
 * @param {string} pathname - 当前路径
 * @returns {boolean} - 是否应该显示简化版footer
 */
export const shouldShowSimplifiedFooter = (pathname) => {
  const { SIMPLIFIED_FOOTER_PATHS } = FOOTER_DISPLAY_RULES;
  return SIMPLIFIED_FOOTER_PATHS.some(path => pathname.startsWith(path));
}; 