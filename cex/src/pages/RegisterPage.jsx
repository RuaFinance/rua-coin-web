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

import { SmileOutlined } from '@ant-design/icons';
import { Radio, Button, Input, Select, notification } from 'antd';
import { ArrowLeft, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LanguageAwareLink from '../components/LanguageAware/LanguageAwareLink';
import { useLocalizedNavigation } from '../components/LanguageRouter/AdvancedLanguageRouter';
import { countriesCN, countriesEN } from '../config/CountriesList';
import { getCurrentLanguage } from '../i18n';

const { Option } = Select;

const RegisterPage = () => {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const navigate = useNavigate();
  const { navigateLocalized } = useLocalizedNavigation();
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

  // 获取当前语言的国家列表
  const getCurrentCountries = () => {
    return getCurrentLanguage() === 'zh' ? countriesCN : countriesEN;
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.residence.trim()) {
      api.warning({
        message: t('pages:register.registerNotice'),
        description: t('pages:register.pleaseSelectResidence'),
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    if (currentStep === 1 && !radioChecked1) {
      api.warning({
        message: t('pages:register.registerNotice'),
        description: t('pages:register.pleaseAgreeTerms'),
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    if (currentStep === 2 && !formData.accountType.trim()) {
      api.warning({
        message: t('pages:register.registerNotice'),
        description: t('pages:register.pleaseSelectAccountType'),
        icon: <SmileOutlined style={{ color: '#faad14' }} />,
        placement: 'topRight',
      });
      return;
    }
    if (currentStep === 3 && !formData.email.trim()) {
      api.warning({
        message: t('pages:register.registerNotice'),
        description: t('pages:register.pleaseEnterEmail'),
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
      navigateLocalized('/');
    }
  };

  const handleSubmit = () => {
    api.success({
      message: t('pages:register.registerSuccess', '注册成功'),
      description: t('pages:register.registrationSubmitted'),
      icon: <SmileOutlined style={{ color: '#52c41a' }} />,
      placement: 'topRight',
    });
    navigateLocalized('/');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {t('pages:register.residenceQuestion')}
        </h2>
        <p className="text-gray-400">
          {t('pages:register.residenceDescription')}
        </p>
      </div>
      
      <div>
        <Select
          placeholder={t('pages:register.selectResidence')}
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
          {t('pages:register.agreeTerms')}
          <a href="#" className="text-blue-400 hover:text-blue-300">{t('pages:register.termsOfService')}</a>
          {t('pages:register.and')}
          <a href="#" className="text-blue-400 hover:text-blue-300">{t('pages:register.privacyPolicy')}</a>
        </Radio>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {t('pages:register.selectAccountType')}
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
                    {t('pages:register.personalAccount')}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {t('pages:register.personalAccountDesc')}
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
              <Radio value="smsf" className="text-white">
                <div className="ml-2">
                  <div className="font-medium text-white">
                    {t('pages:register.smsfAccount')}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {t('pages:register.smsfAccountDesc')}
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
          {t('pages:register.enterEmailAddress')}
        </h2>
        <p className="text-gray-400">
          {t('pages:register.emailVerificationTip')}
        </p>
      </div>
      
      <div>
        <Input
          size="large"
          placeholder={t('pages:register.pleaseEnterEmail')}
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t('pages:register.residence');
      case 2:
        return t('pages:register.accountType');
      case 3:
        return t('common:email');
      default:
        return t('pages:register.residence');
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-black flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-left">
            <h1 className="text-5xl text-white">{t('pages:register.title')}</h1>
            <div className="mt-4">
              <p className="text-gray-400 mt-2">{getStepTitle()}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <div className="bg-[#1d1d1d] rounded-lg p-8">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{currentStep === 1 ? t('pages:login.backToHome') : t('pages:register.previous')}</span>
              </button>

              <button
                onClick={handleNext}
                className="px-8 py-3 btn-register-blue"
              >
                {currentStep === 3 ? t('pages:register.submit') : t('pages:register.next')}
              </button>
            </div>

            {/* Login link */}
            <div className="text-center pt-6 text-sm">
              <span className="text-gray-400">{t('pages:register.alreadyHaveAccount')}</span>
              <LanguageAwareLink to="/login" className="text-blue-400 hover:text-blue-300 ml-1">
                {t('pages:register.loginNow')}
              </LanguageAwareLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;