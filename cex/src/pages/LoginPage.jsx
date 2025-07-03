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

import { SmileOutlined, EyeInvisibleOutlined, EyeTwoTone, DownOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input, Checkbox, notification, Select } from 'antd';
import { ArrowLeft, Mail, Lock, Phone } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { SelectLightConfig } from '../config/AntdSelectConfig';
import { phoneCountriesCN } from '../config/PhoneCountriesList';
import { formatUrl } from '../router/config';

const { Option } = Select;

const LoginPage = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });
  
  // 选项卡状态
  const [activeTab, setActiveTab] = useState('phone'); // phone, email, qrcode
  
  const [formData, setFormData] = useState({
    phoneCountry: '+86',
    phone: '',
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const phoneInputContainerRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(300);

  // 监听窗口大小变化，动态调整下拉框宽度
  useEffect(() => {
    const updateDropdownWidth = () => {
      if (phoneInputContainerRef.current) {
        const width = phoneInputContainerRef.current.offsetWidth;
        setDropdownWidth(width);
      }
    };

    updateDropdownWidth();
    window.addEventListener('resize', updateDropdownWidth);
    
    return () => {
      window.removeEventListener('resize', updateDropdownWidth);
    };
  }, []);

  const handleSubmit = async () => {
    // 根据当前选项卡验证表单
    if (activeTab === 'phone') {
      if (!formData.phone) {
        api.warning({
          message: '登录提示',
          description: '请输入手机号',
          icon: <SmileOutlined style={{ color: '#faad14' }} />,
          placement: 'topRight',
        });
        return;
      }
    } else if (activeTab === 'email') {
      if (!formData.email) {
        api.warning({
          message: '登录提示',
          description: '请输入邮箱地址',
          icon: <SmileOutlined style={{ color: '#faad14' }} />,
          placement: 'topRight',
        });
        return;
      }
    }
    
    if (!formData.password) {
      api.warning({
        message: '登录提示',
        description: '请输入密码',
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }

    setLoading(true);
    
    try {
      // TODO: 这里将来替换为真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      api.success({
        message: '登录成功',
        description: '欢迎回到 RuaCoin！',
        icon: <SmileOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
      });
      
      // 登录成功后跳转到首页或之前的页面
      navigate('/');
      
    } catch (error) {
      api.error({
        message: '登录失败',
        description: '账号或密码错误，请重试',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleThirdPartyLogin = (provider) => {
    // TODO: 实现第三方登录逻辑
    api.info({
      message: '第三方登录',
      description: `${provider} 登录功能开发中...`,
      placement: 'topRight',
    });
  };

  // 渲染选项卡
  const renderTabs = () => (
    <div className="flex border-b border-gray-600 mb-6">
      <button
        onClick={() => setActiveTab('phone')}
        className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'phone'
            ? 'border-white text-white'
            : 'border-transparent text-gray-400 hover:text-gray-300'
        }`}
      >
        手机
      </button>
      <button
        onClick={() => setActiveTab('email')}
        className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'email'
            ? 'border-white text-white'
            : 'border-transparent text-gray-400 hover:text-gray-300'
        }`}
      >
        邮箱 / 子账户
      </button>
      <button
        onClick={() => setActiveTab('qrcode')}
        className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'qrcode'
            ? 'border-white text-white'
            : 'border-transparent text-gray-400 hover:text-gray-300'
        }`}
      >
        二维码
      </button>
    </div>
  );

  // 渲染手机号输入
  const renderPhoneInput = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
        </label>
        <div ref={phoneInputContainerRef} className="flex gap-0 relative bg-white rounded-lg">
          {/* <div className="border-[1px] border-transparent hover:border-black rounded-lg"> */}
          <div>
            <ConfigProvider
              theme={{
                components: {
                  Select: SelectLightConfig,
                },
              }}
            >
              <Select
                value={formData.phoneCountry}
                onChange={(value) => setFormData({ ...formData, phoneCountry: value })}
                className="w-25"
                size="large"
                showSearch
                popupMatchSelectWidth={false}
                styles={{
                  popup: {
                    root: {
                      width: dropdownWidth
                    }
                  },
                }}
                filterOption={(input, option) => {
                  const country = phoneCountriesCN.find(c => c.phone === option.value);
                  if (!country) return false;
                  const searchText = input.toLowerCase();
                  return (
                    country.phone.toLowerCase().includes(searchText) ||
                    country.name.toLowerCase().includes(searchText) ||
                    country.code.toLowerCase().includes(searchText)
                  );
                }}
              >
                {phoneCountriesCN.map(country => (
                  <Option key={country.code} value={country.phone}>
                    <div className="flex items-center justify-between">
                      <span>{country.phone}</span>
                      <span className="text-xs text-gray-500 ml-2">{country.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </ConfigProvider>
            
          </div>

          <span style={{width: '3px'}}> </span>
           
          <Input
            size="large"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            // prefix={<Phone className="text-gray-400" size={16} />}
            className="flex-1 border-white"
          />
        </div>
      </div>
    </>
  );

  // 渲染邮箱输入
  const renderEmailInput = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
        </label>
        <Input
           size="large"
        //    placeholder="邮箱"
           value={formData.email}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           type="email"
           className="border-gray-600"
         />
      </div>
    </>
  );

  // 渲染二维码登录
  const renderQRCode = () => (
    <div className="text-center py-8">
      <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
        <QrcodeOutlined className="text-6xl text-gray-400" />
      </div>
      <p className="text-gray-400">使用手机扫描二维码登录</p>
    </div>
  );

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-black flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-left">
            <h1 className="text-5xl text-white">登陆</h1>
            <div className="mt-4">
              <p className="text-gray-400 mt-2">登录您的账户开始交易</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#1d1d1d] rounded-lg p-8">
            {/* 选项卡 */}
            {renderTabs()}
            
            {activeTab !== 'qrcode' ? (
              <div className="space-y-6">
                {/* 根据选项卡显示不同输入方式 */}
                {activeTab === 'phone' ? renderPhoneInput() : renderEmailInput()}

                {/* 密码输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    密码
                  </label>
                  <Input.Password
                   size="large"
                    // placeholder="密码"
                   value={formData.password}
                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                   iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                   className="border-gray-600"
                 />
                </div>

                {/* 记住我和忘记密码 */}
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="text-gray-300"
                  >
                    记住我
                  </Checkbox>
                  <Link to="#" className="text-blue-400 hover:text-blue-300 text-sm">
                    忘记密码？
                  </Link>
                </div>

                {/* 登录按钮 */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-12 btn-register-blue"
                >
                  {loading ? '登录中...' : '登录'}
                </button>
              </div>
            ) : (
              // 二维码登录
              renderQRCode()
            )}

            {/* 分割线和第三方登录 */}
            {activeTab !== 'qrcode' && (
              <>
                {/* 自定义分割线 */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="px-4 text-gray-400 text-sm">或使用其他方式</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                {/* 第三方登录 */}
                <div className="flex justify-center gap-10">
                  <button
                    onClick={() => handleThirdPartyLogin('Apple')}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <img 
                      src={formatUrl("/asserts/apple-beb23ea0201e.png" )}
                      alt="Apple Login" 
                      className="w-6 h-6"
                    />
                  </button>
                  <button
                    onClick={() => handleThirdPartyLogin('Google')}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <img 
                      src={formatUrl("/asserts/google-dc10d89cbf89.png")}
                      alt="Google Login" 
                      className="w-6 h-6"
                    />
                  </button>
                  <button
                    onClick={() => handleThirdPartyLogin('Telegram')}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <img 
                      src={formatUrl("/asserts/telegram-fa6cc7f274db.png")}
                      alt="Telegram Login" 
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </>
            )}

            {/* 注册提示 */}
            <div className="text-center pt-4 text-sm">
              <span className="text-gray-400">还没有账户？</span>
              <Link to="/register" className="text-blue-400 hover:text-blue-300 ml-1">
                立即注册
              </Link>
            </div>
            
            {/* 返回按钮 */}
            <div className="flex justify-start items-center pt-8">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-0 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回首页</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 