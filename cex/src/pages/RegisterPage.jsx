import { SmileOutlined } from '@ant-design/icons';
import { Radio, Button, Input, Select, notification } from 'antd';
import { ArrowLeft, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { countriesCN, countriesEN } from '../config/CountriesList';

const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    residence: '',
    accountType: '',
    email: ''
  });
  const [radioChecked1, setChecked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('CN');

  // 语言选项
  const languageOptions = [
    { code: 'CN', name: '中文', flag: '🇨🇳' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
  ];

  // 获取当前语言的国家列表
  const getCurrentCountries = () => {
    return selectedLanguage === 'CN' ? countriesCN : countriesEN;
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.residence.trim()) {
      api.warning({
        message: selectedLanguage === 'CN' ? '注册提示' : 'Registration Notice',
        description: selectedLanguage === 'CN' ? '请选择您的居住地' : 'Please select your residence',
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    if (currentStep === 1 && !radioChecked1) {
      api.warning({
        message: selectedLanguage === 'CN' ? '注册提示' : 'Registration Notice',
        description: selectedLanguage === 'CN' ? '请同意服务条款及隐私政策' : 'Please agree to the Terms of Service and Privacy Policy',
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    if (currentStep === 2 && !formData.accountType.trim()) {
      api.warning({
        message: selectedLanguage === 'CN' ? '注册提示' : 'Registration Notice',
        description: selectedLanguage === 'CN' ? '请选择账户类型' : 'Please select account type',
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    if (currentStep === 3 && !formData.email.trim()) {
      api.warning({
        message: selectedLanguage === 'CN' ? '注册提示' : 'Registration Notice',
        description: selectedLanguage === 'CN' ? '请输入邮箱地址' : 'Please enter your email address',
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = () => {
    api.success({
      message: selectedLanguage === 'CN' ? '注册成功' : 'Registration Successful',
      description: selectedLanguage === 'CN' ? '注册信息已提交，请查收验证邮件' : 'Registration information submitted, please check your email for verification',
      icon: <SmileOutlined style={{ color: '#52c41a' }} />,
      placement: 'topRight',
    });
    navigate('/');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {selectedLanguage === 'CN' ? '您居住地是哪里？' : 'Where is your residence?'}
        </h2>
        <p className="text-gray-400">
          {selectedLanguage === 'CN' 
            ? '为了给您提供更好的服务，请选择您当前的居住地'
            : 'To provide you with better service, please select your current residence'
          }
        </p>
      </div>
      
      {/* 语言选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          选择语言 / Select Language
        </label>
        <Select
          value={selectedLanguage}
          onChange={(value) => {
            setSelectedLanguage(value);
            // 清空已选择的居住地，因为语言改变了
            setFormData({ ...formData, residence: '' });
          }}
          className="w-full mb-4"
          size="large"
        >
          {languageOptions.map(lang => (
            <Option key={lang.code} value={lang.code}>
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </Option>
          ))}
        </Select>
      </div>
      
      <div>
        <Select
          placeholder={selectedLanguage === 'CN' ? "请选择您的居住地" : "Please select your residence"}
          value={formData.residence}
          onChange={(value) => setFormData({ ...formData, residence: value })}
          className="w-full"
          size="large"
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {getCurrentCountries().map(country => (
            <Option key={country.code} value={country.code}>
              {country.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="pt-4">
        <Radio
          checked={formData.residence !== '' && radioChecked1}
          disabled={formData.residence === ''}
          className="text-gray-300"
          onClick={() => setChecked(!radioChecked1)}
        >
          {selectedLanguage === 'CN' 
            ? <>我同意 RuaCoin 的<a href="#" className="text-blue-400 hover:text-blue-300">服务条款</a>及<a href="#" className="text-blue-400 hover:text-blue-300">隐私政策</a></>
            : <>I agree to RuaCoin's <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a></>
          }
        </Radio>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {selectedLanguage === 'CN' ? '请选择账户类型' : 'Please select account type'}
        </h2>
      </div>
      
      <div className="space-y-4">
        <Radio.Group
          value={formData.accountType}
          onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
          className="w-full"
        >
          <div className="space-y-4">
            <div className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
              <Radio value="personal" className="text-white">
                <div className="ml-2">
                  <div className="font-medium text-white">
                    {selectedLanguage === 'CN' ? '个人或机构账户' : 'Personal or Institutional Account'}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {selectedLanguage === 'CN' 
                      ? '此类账户适用于寻求交易、发送、接收以及管理数字货币资产的个人或机构。'
                      : 'This type of account is suitable for individuals or institutions seeking to trade, send, receive, and manage digital currency assets.'
                    }
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
              <Radio value="smsf" className="text-white">
                <div className="ml-2">
                  <div className="font-medium text-white">
                    {selectedLanguage === 'CN' ? '自管养老金 (SMSF)' : 'Self-Managed Super Fund (SMSF)'}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {selectedLanguage === 'CN' 
                      ? '此类账户适用于作为自管养老金 (SMSF) 受托人的个人或公司。如果您是代表您的 SMSF 进行投资，请选择此类账户。'
                      : 'This type of account is suitable for individuals or companies acting as trustees of a Self-Managed Super Fund (SMSF). If you are investing on behalf of your SMSF, please select this account type.'
                    }
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {selectedLanguage === 'CN' ? '输入您的邮箱地址' : 'Enter your email address'}
        </h2>
        <p className="text-gray-400">
          {selectedLanguage === 'CN' 
            ? '请确保该邮箱能接收验证码'
            : 'Please ensure this email can receive verification codes'
          }
        </p>
      </div>
      
      <div>
        <Input
          size="large"
          placeholder={selectedLanguage === 'CN' ? "请输入邮箱地址" : "Please enter your email address"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          prefix={<Mail className="text-gray-400" />}
          type="email"
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-black flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">RuaCoin</h1>
          <div className="mt-4 flex items-center justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-white text-black' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-white' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#1d1d1d] rounded-lg p-8">
          {renderCurrentStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-0 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>
                {currentStep === 1 
                  ? (selectedLanguage === 'CN' ? '返回首页' : 'Back to Home')
                  : (selectedLanguage === 'CN' ? '上一步' : 'Previous')
                }
              </span>
            </button>
            
            <button
              onClick={handleNext}
              className="btn-register-blue"
            >
              {currentStep === 3 
                ? (selectedLanguage === 'CN' ? '提交' : 'Submit')
                : (selectedLanguage === 'CN' ? '下一步' : 'Next')
              }
            </button>
          </div>
          
          {/* 登录提示 */}
          <div className="text-center pt-4 text-sm">
            <span className="text-gray-400">
              {selectedLanguage === 'CN' ? '已有账户？' : 'Already have an account?'}
            </span>
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 ml-1"
            >
              {selectedLanguage === 'CN' ? '立即登录' : 'Login now'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;