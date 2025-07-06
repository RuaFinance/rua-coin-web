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
 * SimplifiedFooter组件 - 简化版页脚
 * 
 * 用于特殊页面（如API文档、技术文档）的简化版页脚
 * 只显示核心信息：Logo、版权信息、基本法律链接、风险提示
 * 相比完整版Footer更加简洁，节省页面空间
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Users, TrendingUp } from 'lucide-react';

const SimplifiedFooter = () => {
  const legalLinks = [
    { name: "服务条款", href: "#" },
    { name: "隐私政策", href: "#" },
    { name: "风险披露", href: "#" }
  ];

  const certifications = [
    { name: "SSL加密保护", icon: Shield },
    { name: "全球服务", icon: Globe },
    { name: "24/7客户支持", icon: Users },
    { name: "实时行情", icon: TrendingUp }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 主要内容 */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Logo和版权 */}
          <div className="text-center lg:text-left">
            <Link to="/" className="text-xl font-bold gradient-text">RuaCoin</Link>
            <p className="text-gray-400 text-sm mt-2">&copy; 2025 RuaCoin. 保留所有权利。</p>
          </div>

          {/* 认证信息 */}
          <div className="flex flex-wrap items-center justify-center space-x-6 text-gray-400">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2">
                <cert.icon size={16} />
                <span className="text-xs">{cert.name}</span>
              </div>
            ))}
          </div>

          {/* 法律链接 */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* 风险提示 */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-500 text-xs leading-relaxed">
            <p>
              风险提示：加密货币交易存在高风险，价格波动剧烈。在投资前请充分了解相关风险，
              并根据自身财务状况谨慎投资。过往表现不代表未来收益。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimplifiedFooter; 