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

import { X, Eye, EyeOff } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { formatUrl } from '../router/config';

const BuyCryptoNewCard = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation(['common']);
  // ===== Credit Card Form State =====
  const [cardFormData, setCardFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'China (中国)'
  });
  // 输入框聚焦和触碰状态
  const initialInputStatus = {
    firstName: { focused: false, touched: false },
    lastName: { focused: false, touched: false },
    cardNumber: { focused: false, touched: false },
    expiry: { focused: false, touched: false },
    cvv: { focused: false, touched: false },
    address: { focused: false, touched: false },
    city: { focused: false, touched: false },
    postalCode: { focused: false, touched: false },
  };
  const [inputStatus, setInputStatus] = useState(initialInputStatus);
  const handleFocus = (field) => setInputStatus(s => ({ ...s, [field]: { ...s[field], focused: true } }));
  const handleBlur = (field) => setInputStatus(s => ({ ...s, [field]: { ...s[field], focused: false, touched: true } }));
  // 校验函数
  const cardNumberValid = cardFormData.cardNumber.replace(/\s/g, '').length >= 13;
  const expiryValid = /^\d{2}\/\d{2}$/.test(cardFormData.expiry);
  const cvvValid = /^\d{3}$/.test(cardFormData.cvv);

  const isFieldError = (field) => inputStatus[field].touched && !cardFormData[field].trim();
  // 新增格式校验错误判断
  const isFieldFormatError = (field) => {
    if (field === 'cardNumber') return inputStatus.cardNumber.touched && cardFormData.cardNumber.trim() && !cardNumberValid;
    if (field === 'expiry') return inputStatus.expiry.touched && cardFormData.expiry.trim() && !expiryValid;
    if (field === 'cvv') return inputStatus.cvv.touched && cardFormData.cvv.trim() && !cvvValid;
    return false;
  };
  const [showCvv, setShowCvv] = useState(false); // Toggle CVV visibility
  const [showCvvHelpModal, setShowCvvHelpModal] = useState(false); // CVV help modal
  const [isFormValid, setIsFormValid] = useState(false); // Form validation state

  // Form validation effect
  useEffect(() => {
    const { firstName, lastName, cardNumber, expiry, cvv, address, city, postalCode } = cardFormData;
    // MM/YY format check
    const expiryValid = /^\d{2}\/\d{2}$/.test(expiry);
    const isValid = firstName.trim() && 
                   lastName.trim() && 
                   cardNumber.replace(/\s/g, '').length >= 13 && 
                   expiryValid &&
                   cvv.length >= 3 && 
                   address.trim() &&
                   city.trim() &&
                   postalCode.trim();
    setIsFormValid(isValid);
  }, [cardFormData]);

  // Credit card form handlers
  const handleCardFormChange = (field, value) => {
    setCardFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardNumberChange = (value) => {
    // Format card number with spaces
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    handleCardFormChange('cardNumber', formatted);
  };

  // MM/YY Expiry input handler
  const [lastExpiry, setLastExpiry] = useState('');
  const handleExpiryInput = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    // Only allow digits and '/'
    value = value.replace(/[^\d/]/g, '');
    // Remove extra slashes
    if (value.length > 0) {
      const parts = value.split('/');
      if (parts.length > 2) {
        value = parts[0] + '/' + parts[1];
      }
    }
    // 只在从2位变3位且不是删除时自动补'/'
    if (
      lastExpiry.length === 2 &&
      value.length === 3 &&
      !lastExpiry.endsWith('/') &&
      value[2] !== '/'
    ) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    // Prevent typing '/' at position 1 or 0
    if (value.length === 1 && value === '/') value = '';
    if (value.length === 2 && value[1] === '/') value = value[0];
    // Max length 5
    if (value.length > 5) value = value.slice(0, 5);
    setCardFormData(prev => ({ ...prev, expiry: value }));
    setLastExpiry(value);
  };

  const handleCvvChange = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const cvv = cleaned.slice(0, 4);
    handleCardFormChange('cvv', cvv);
  };

  const handleCardFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(cardFormData);
      // Reset form
      setCardFormData({
        firstName: '',
        lastName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'China (中国)'
      });
      setShowCvv(false);
      setInputStatus(initialInputStatus);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setCardFormData({
      firstName: '',
      lastName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'China (中国)'
    });
    setShowCvv(false);
    setInputStatus(initialInputStatus);
    onClose();
  };

  // 用于所有输入框的样式
  const getInputStyle = (field) => {
    let borderColor = '#d1d5db';
    if (inputStatus[field].focused) borderColor = '#60a5fa'; // 浅蓝色
    else if (isFieldError(field) || isFieldFormatError(field)) borderColor = '#ef4444'; // 红色
    return {
      width: '100%',
      padding: '8px 10px',
      border: `1px solid ${borderColor}`,
      borderRadius: 6,
      fontSize: 14,
      outline: 'none',
    };
  };

  // 主模态框内容
  const mainModalContent = (
    <div className="deposit-modal-overlay" onClick={handleClose}>
      <div
        className="deposit-modal-content"
        style={{ maxWidth: 400, padding: 0, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div style={{ padding: '20px 20px 16px 20px' }}>
          {/* Header */}
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>
            {t('buyCryptoNewCard.addNewCard')}
          </div>

          {/* Form */}
          <form onSubmit={handleCardFormSubmit}>
            {/* Card Information Section */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
                {t('buyCryptoNewCard.cardInformation')}
              </div>
              
              {/* Name Row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    {t('buyCryptoNewCard.firstName')}
                  </label>
                  <input
                    type="text"
                    value={cardFormData.firstName}
                    onChange={(e) => handleCardFormChange('firstName', e.target.value)}
                    style={getInputStyle('firstName')}
                    onFocus={() => handleFocus('firstName')}
                    onBlur={() => handleBlur('firstName')}
                    placeholder={t('buyCryptoNewCard.enterFirstName')}
                  />
                  {isFieldError('firstName') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    {t('buyCryptoNewCard.lastName')}
                  </label>
                  <input
                    type="text"
                    value={cardFormData.lastName}
                    onChange={(e) => handleCardFormChange('lastName', e.target.value)}
                    style={getInputStyle('lastName')}
                    onFocus={() => handleFocus('lastName')}
                    onBlur={() => handleBlur('lastName')}
                    placeholder={t('buyCryptoNewCard.enterLastName')}
                  />
                  {isFieldError('lastName') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                  )}
                </div>
              </div>

              {/* Card Number Row */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                  {t('buyCryptoNewCard.cardNumber')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={cardFormData.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    style={getInputStyle('cardNumber')}
                    onFocus={() => handleFocus('cardNumber')}
                    onBlur={() => handleBlur('cardNumber')}
                    placeholder={t('buyCryptoNewCard.enterCardNumber')}
                    maxLength={19}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: 4
                  }}>
                    <img src={formatUrl("/asserts/visa-be5f3a92ce95.png")} alt="visa" style={{ width: 24, height: 15, objectFit: 'contain' }} />
                    <img src={formatUrl("/asserts/mastercard-03c8dede9001.png")} alt="mastercard" style={{ width: 24, height: 15, objectFit: 'contain' }} />
                  </div>
                </div>
                {isFieldError('cardNumber') && (
                  <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                )}
                {isFieldFormatError('cardNumber') && (
                  <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.cardNumberFormatError')}</div>
                )}
              </div>

              {/* Expiry and CVV Row */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    {t('buyCryptoNewCard.expiryDate')}
                  </label>
                  <input
                    type="text"
                    value={cardFormData.expiry}
                    onChange={handleExpiryInput}
                    style={getInputStyle('expiry')}
                    onFocus={() => handleFocus('expiry')}
                    onBlur={() => handleBlur('expiry')}
                    placeholder="MM/YY"
                    maxLength={5}
                    inputMode="numeric"
                  />
                  {isFieldError('expiry') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                  )}
                  {isFieldFormatError('expiry') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.expiryFormatError')}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <label style={{ fontSize: 12, color: '#6b7280' }}>CVV/CVC</label>
                    <button type="button" onClick={() => setShowCvvHelpModal(true)} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }} aria-label="什么是CVV/CVC?">
                      <HelpCircle size={15} />
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCvv ? "text" : "password"}
                      value={cardFormData.cvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      style={{ ...getInputStyle('cvv')}}
                      onFocus={() => handleFocus('cvv')}
                      onBlur={() => handleBlur('cvv')}
                      placeholder={t('buyCryptoNewCard.cvvPlaceholder', '3位数')}
                      maxLength={3}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        paddingRight: 5,
                      }}
                    >
                      {showCvv ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {isFieldError('cvv') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                  )}
                  {isFieldFormatError('cvv') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.cvvFormatError')}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
                {t('buyCryptoNewCard.billingAddress')}
              </div>
              
              {/* Address */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                  {t('buyCryptoNewCard.address')}
                </label>
                <input
                  type="text"
                  value={cardFormData.address}
                  onChange={(e) => handleCardFormChange('address', e.target.value)}
                  style={getInputStyle('address')}
                  onFocus={() => handleFocus('address')}
                  onBlur={() => handleBlur('address')}
                  placeholder={t('buyCryptoNewCard.enterAddress')}
                />
                {isFieldError('address') && (
                  <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                )}
              </div>
              {/* City & Postal Code */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('buyCryptoNewCard.city')}</label>
                  <input
                    type="text"
                    value={cardFormData.city}
                    onChange={e => handleCardFormChange('city', e.target.value)}
                    style={getInputStyle('city')}
                    onFocus={() => handleFocus('city')}
                    onBlur={() => handleBlur('city')}
                    placeholder={t('buyCryptoNewCard.enterCity')}
                  />
                  {isFieldError('city') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('buyCryptoNewCard.postalCode')}</label>
                  <input
                    type="text"
                    value={cardFormData.postalCode}
                    onChange={e => handleCardFormChange('postalCode', e.target.value)}
                    style={getInputStyle('postalCode')}
                    onFocus={() => handleFocus('postalCode')}
                    onBlur={() => handleBlur('postalCode')}
                    placeholder={t('buyCryptoNewCard.enterPostalCode')}
                    maxLength={20}
                  />
                  {isFieldError('postalCode') && (
                    <div style={{color:'#ef4444',fontSize:12,marginTop:2}}>{t('buyCryptoNewCard.fieldRequired')}</div>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                  {t('buyCryptoNewCard.country')}
                </label>
                <select
                  value={cardFormData.country}
                  onChange={(e) => handleCardFormChange('country', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14,
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="China (中国)">China (中国)</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`submit-btn${isFormValid ? ' enabled' : ''}`}
              style={{
                width: '100%',
                padding: '10px 0',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {t('buyCryptoNewCard.confirm')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // CVV/CVC Help Modal 内容
  const cvvHelpModalContent = (
    <div className="deposit-modal-overlay" style={{ zIndex: 100000 }} onClick={e => e.stopPropagation()}>
      <div
        className="deposit-modal-content"
        style={{ 
          width: 360, maxWidth: 360, maxHeight: 400, padding: 0, 
          position: 'relative', display: 'flex', flexDirection: 'column', 
          justifyContent: 'flex-start', alignItems: 'center'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowCvvHelpModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          style={{ zIndex: 2 }}
        >
          <X className="w-6 h-6" />
        </button>
        <div style={{ width: '100%', padding: '28px 24px 0 24px', textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('buyCryptoNewCard.whatIsCvvCvc')}</div>
          <div style={{ fontSize: 14, color: '#444', marginBottom: 18, lineHeight: 1.6 }}>
            {t('buyCryptoNewCard.cvvCvcDescription')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <img src={formatUrl("/asserts/whatis-CVV-CVC.svg")} alt="CVV/CVC说明" style={{ width: 156, height: 108, objectFit: 'contain' }} />
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
          <button
            onClick={() => setShowCvvHelpModal(false)}
            style={{
              minWidth: 120,
              width: '100%',
              padding: '10px 0',
              marginLeft: 20,
              marginRight: 20,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 6,
              border: 'none',
              background: '#fcd535',
              color: '#111827',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            {t('buyCryptoNewCard.ok')}
          </button>
        </div>
      </div>
    </div>
  );

  // 使用 Portal 渲染模态框
  if (!isOpen) return null;

  return (
    <>
      {createPortal(mainModalContent, document.body)}
      {showCvvHelpModal && createPortal(cvvHelpModalContent, document.body)}
    </>
  );
};

export default BuyCryptoNewCard;
