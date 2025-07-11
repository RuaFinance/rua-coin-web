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

import { X, Search, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import LanguageAwareLink from '../components/LanguageAware/LanguageAwareLink';
import { useLocalizedNavigation, useCurrentLocale } from '../components/LanguageRouter/AdvancedLanguageRouter';
import { Currencies } from '../config/Currencies';
import { TokenList, SymbolSet } from '../config/SymbolSetConfig';
import { formatUrl } from '../router/config';
import VisaPaymentCard from '../components/VisaPaymentCard';
import BuyCryptoNewCard from '../components/BuyCryptoNewCard';

const allCurrencies = Currencies;
const tokens = TokenList;

const BuyCryptoPage = () => {
  // ===== Route Params =====
  const { currency = 'USD', token = 'USDT' } = useParams();

  // ===== I18n / Localization =====
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useCurrentLocale();
  const { navigateLocalized } = useLocalizedNavigation();

  // ===== Main Business State =====
  const [selectedFiat, setSelectedFiat] = useState(currency.toUpperCase()); // Selected fiat currency
  const [selectedToken, setSelectedToken] = useState(token.toUpperCase()); // Selected crypto token
  const [fiatAmount, setFiatAmount] = useState(''); // Fiat input amount
  const [touched, setTouched] = useState(false); // Whether amount input is touched
  const minAmount = 10; // Minimum amount
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card'); // Selected payment method

  // ===== Modal / Dialog State =====
  const [showCurrencyModal, setShowCurrencyModal] = useState(false); // Fiat currency modal
  const [showTokenModal, setShowTokenModal] = useState(false); // Token modal
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Payment method modal
  const [showCreditCardModal, setShowCreditCardModal] = useState(false); // Credit card modal
  const [tempSelectedPaymentMethod, setTempSelectedPaymentMethod] = useState(selectedPaymentMethod); // Temp payment method in modal
  const [highlightedIndex, setHighlightedIndex] = useState(0); // Highlighted index in fiat modal
  const [highlightedTokenIndex, setHighlightedTokenIndex] = useState(0); // Highlighted index in token modal
  const currencyListRef = React.useRef(null);
  const tokenListRef = React.useRef(null);
  const modalRef = React.useRef(null);
  const tokenModalRef = React.useRef(null);

  // ===== Search / Filter State =====
  const [searchCurrency, setSearchCurrency] = useState(''); // Fiat currency search
  const [searchToken, setSearchToken] = useState(''); // Token search

  // ===== Other UI State =====
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Search bar focus
  const [hotSearches, setHotSearches] = useState([]); // Hot searches
  const [isLoadingHotSearches, setIsLoadingHotSearches] = useState(true); // Hot searches loading
  const [searchHistory, setSearchHistory] = useState(() => {
    // Init from localStorage
    try {
      const data = localStorage.getItem('ruacoin_search_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // 搜索过滤
  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchCurrency.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  const filteredTokens = tokens.filter(token =>
    token.toLowerCase().includes(searchToken.toLowerCase())
  );

  // 获取币种logo的函数（参考TradingPairs.jsx）
  const getCoinLogo = (symbol) => {
    // USDT作为基准币种，直接返回其logo
    if (symbol === 'USDT') {
      return formatUrl(`/asserts/logo/USDT.png`);
    }

    const baseCurrency = symbol.split('/')[0];

    // 处理杠杆币种，去掉3L、3S等后缀
    const cleanSymbol = baseCurrency.replace(/3[LS]$/, '');
    
    // 构建完整的交易对符号来检查
    const fullSymbol = `${cleanSymbol}/USDT`;
    
    // 检查symbolSet中是否包含该币种
    if (SymbolSet.has(fullSymbol)) {
      return formatUrl(`/asserts/logo/${cleanSymbol}.png`);
    }
    
    // 如果没有找到，返回默认的none.png
    return formatUrl('/asserts/logo/none.png');
  };

  // 关闭弹窗
  const closeCurrencyModal = () => {
    setShowCurrencyModal(false);
    setSearchCurrency('');
    setHighlightedIndex(0);
    
    // 恢复viewport设置
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setSearchToken('');
    setHighlightedTokenIndex(0);
    
    // 恢复viewport设置
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  };

  // 选择货币
  const handleCurrencySelect = (currencyCode, fromKeyboard = false) => {
    setSelectedFiat(currencyCode);
    setShowCurrencyModal(false); // 选择后关闭弹窗
    setSearchCurrency(''); // 清空搜索
    // 如果是键盘操作，同步高亮索引；如果是鼠标操作，清除高亮状态
    if (fromKeyboard) {
      const index = filteredCurrencies.findIndex(c => c.code === currencyCode);
      if (index !== -1) {
        setHighlightedIndex(index);
      }
    } else {
      setHighlightedIndex(-1); // 鼠标操作时清除键盘高亮状态
    }
    navigate(`/${locale}/crypto/buy/${currencyCode}/${selectedToken}`);
  };

  // 选择加密币
  const handleTokenSelect = (tokenCode, fromKeyboard = false) => {
    setSelectedToken(tokenCode);
    setShowTokenModal(false); // 选择后关闭弹窗
    setSearchToken(''); // 清空搜索
    // 如果是键盘操作，同步高亮索引；如果是鼠标操作，清除高亮状态
    if (fromKeyboard) {
      const index = filteredTokens.findIndex(t => t === tokenCode);
      if (index !== -1) {
        setHighlightedTokenIndex(index);
      }
    } else {
      setHighlightedTokenIndex(-1); // 鼠标操作时清除键盘高亮状态
    }
    navigate(`/${locale}/crypto/buy/${selectedFiat}/${tokenCode}`);
  };

  // 键盘导航处理 - 法币弹窗
  useEffect(() => {
    if (!showCurrencyModal) return;
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredCurrencies.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCurrencies.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredCurrencies[highlightedIndex]) {
            handleCurrencySelect(filteredCurrencies[highlightedIndex].code, true);
          }
          break;
        case 'Escape':
          event.preventDefault();
          closeCurrencyModal();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCurrencyModal, filteredCurrencies, highlightedIndex]);

  // 键盘导航处理 - 加密币弹窗
  useEffect(() => {
    if (!showTokenModal) return;
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedTokenIndex(prev => 
            prev < filteredTokens.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedTokenIndex(prev => 
            prev > 0 ? prev - 1 : filteredTokens.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredTokens[highlightedTokenIndex]) {
            handleTokenSelect(filteredTokens[highlightedTokenIndex], true);
          }
          break;
        case 'Escape':
          event.preventDefault();
          closeTokenModal();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTokenModal, filteredTokens, highlightedTokenIndex]);

  // 搜索内容变化时重置高亮索引
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchCurrency]);

  useEffect(() => {
    setHighlightedTokenIndex(0);
  }, [searchToken]);

  // 处理移动端输入框自动放大问题
  useEffect(() => {
    if (showCurrencyModal || showTokenModal) {
      // 保存原始的viewport设置
      const originalViewport = document.querySelector('meta[name="viewport"]');
      const originalContent = originalViewport ? originalViewport.getAttribute('content') : '';
      
      // 设置viewport防止自动放大
      if (originalViewport) {
        originalViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // 清理函数：恢复原始viewport设置
      return () => {
        if (originalViewport && originalContent) {
          originalViewport.setAttribute('content', originalContent);
        }
      };
    }
  }, [showCurrencyModal, showTokenModal]);

  // 滚动到高亮的选项
  useEffect(() => {
    if (currencyListRef.current && highlightedIndex >= 0) {
      const highlightedElement = currencyListRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (tokenListRef.current && highlightedTokenIndex >= 0) {
      const highlightedElement = tokenListRef.current.children[highlightedTokenIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [highlightedTokenIndex]);

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeCurrencyModal();
      }
    };

    if (showCurrencyModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCurrencyModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tokenModalRef.current && !tokenModalRef.current.contains(event.target)) {
        closeTokenModal();
      }
    };

    if (showTokenModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTokenModal]);

  // Update state when route parameters change
  useEffect(() => {
    setSelectedFiat(currency.toUpperCase());
    setSelectedToken(token.toUpperCase());
  }, [currency, token]);

  // Form validation effect
  // Removed credit card form validation effect as it's now in BuyCryptoNewCard

  // Credit card form handlers
  const handleCreditCardSubmit = (cardData) => {
    // TODO: Submit card data to backend
    console.log('Card form submitted:', cardData);
    setShowCreditCardModal(false);
  };

  const handleFiatChange = (e) => {
    const newFiat = e.target.value;
    setSelectedFiat(newFiat);
    navigate(`/${locale}/crypto/buy/${newFiat}/${selectedToken}`);
  };

  const handleTokenChange = (e) => {
    const newToken = e.target.value;
    setSelectedToken(newToken);
    navigate(`/${locale}/crypto/buy/${selectedFiat}/${newToken}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate payment flow
    alert(`Buy ${selectedToken} with ${fiatAmount} ${selectedFiat}`);
  };

  const isAmountInvalid = fiatAmount !== '' && Number(fiatAmount) < minAmount;

  // Check if form is valid for button state
  const isFormValidForButton = () => {
    const amountValid = fiatAmount !== '' && Number(fiatAmount) >= minAmount && !isNaN(Number(fiatAmount));
    return amountValid;
  };

  // Debug: Log validation state
  useEffect(() => {
    console.log('Amount validation:', {
      fiatAmount,
      minAmount,
      isValid: isFormValidForButton(),
      selectedPaymentMethod
    });
  }, [fiatAmount, selectedPaymentMethod]);

  return (
    <div className="buy-crypto-container">
      <div style={{height: '20px'}}></div>
      <main className="buy-main">
        <div className="buy-main-left-col">
          <header className="buy-header">
            <h1 className="buy-title">
              {t('buyCryptoPage.buyWithCurrency', {
                currency: selectedFiat,
                token: selectedToken,
              })}
            </h1>
            {/* Supported logos */}
            <div className="supported-payments">
              <span>{t('buyCryptoPage.supported')}</span>
              {['visa-be5f3a92ce95.png', 'mastercard-03c8dede9001.png', 'google-pay-395fb1c2dc1a.png'].map((img) => (
                <img
                  key={img}
                  src={formatUrl(`/asserts/${img}`)}
                  alt="payment-logo"
                  className="payment-logo"
                />
              ))}
            </div>
          </header>

          {/* 左侧内容：根据支付方式切换，直接作为buy-main-left-col子元素 */}
          {selectedPaymentMethod === 'card' ? (
            <VisaPaymentCard 
              cardNumber="4000 1234 5678 9010"
              cardHolderName="PHILIP GOODWIN"
              cvv="123"
              isFlipped={false}
              onCardClick={() => console.log('Card clicked!')}
              style={{ transform: 'scale(0.8)' }}
              className="visa-card-container"
            />
          ) : (
            <section className="popular-coins" style={{ maxWidth: 500, width: '100%' }}>
              <h3 className="section-title">{t('buyCryptoPage.popularCrypto')}</h3>
              <div>
                {[
                  { symbol: 'BNB', price: '4,799.61', change: '+0.84%' },
                  { symbol: 'BTC', price: '798,990.26', change: '+2.14%' },
                  { symbol: 'ETH', price: '19,892.05', change: '+4.47%' },
                  { symbol: 'SOL', price: '1,123.81', change: '+1.80%' },
                  { symbol: 'HYPER', price: '3.93', change: '+381.85%' },
                  { symbol: 'XRP', price: '2.56', change: '+67.80%' },
                ].map((item) => (
                  <div key={item.symbol} className="coin-row">
                    <div style={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                      <img src={getCoinLogo(item.symbol)} alt={item.symbol} style={{ width: 20, height: 20, marginRight: 8, verticalAlign: 'middle' }} />
                      <span style={{ fontWeight: 500, paddingLeft: 8 }}>{item.symbol}</span>
                    </div>
                    <span className="price">¥{item.price}</span>
                    <span className="change">{item.change}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right buy form */}
        <div className="buy-form-card">
          <div className="tabs">
            <button className="tab active">{t('buyCryptoPage.buyTab')}</button>
            <button className="tab disabled" disabled>{t('buyCryptoPage.sellTab')}</button>
          </div>

          <form onSubmit={handleSubmit} className="buy-form">
            {/* Spend */}
            <div className="form-group">
              <label className="group-label">{t('buyCryptoPage.spend')}</label>
              <div className={`input-select-row${isAmountInvalid && touched ? ' input-error' : ''}`}>
                <input
                  type="text"
                  placeholder={`≥ ${minAmount}`}
                  value={fiatAmount}
                  onChange={(e) => { setFiatAmount(e.target.value); setTouched(true); }}
                  min={minAmount}
                  onBlur={() => setTouched(true)}
                />
                {/* 币种选择区域，点击弹窗 */}
                <div 
                  style={{ 
                    minWidth: 80, cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', borderRadius: 8, padding: '0 12px', 
                    background: '#f9fafb', height: 40, marginLeft: 8, marginRight: 0
                  }}
                  onClick={() => {
                    setShowCurrencyModal(true);
                    setHighlightedIndex(0); // 打开时重置高亮索引
                  }}
                  tabIndex={0}
                >
                  <span style={{ fontWeight: 600, fontSize: 16, marginRight: 6 }}>
                    {allCurrencies.find(c => c.code === selectedFiat)?.symbol || selectedFiat}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{selectedFiat}</span>
                  <ChevronDown style={{ marginLeft: 6, width: 18, height: 18, color: '#888' }} />
                </div>
              </div>
              {isAmountInvalid && touched && (
                <div className="input-error-tip">
                  {t('buyCryptoPage.errorAmount', { min: minAmount })}
                </div>
              )}
            </div>

            {/* Receive */}
            <div className="form-group">
              <label className="group-label">{t('buyCryptoPage.receive')}</label>
              <div className="input-select-row">
                <input type="text" placeholder="0" disabled />
                {/* 加密币选择区域，点击弹窗 */}
                <div 
                  style={{ 
                    minWidth: 80, cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', borderRadius: 8, padding: '0 12px', 
                    background: '#f9fafb', height: 40, marginLeft: 8, marginRight: 0
                  }}
                  onClick={() => {
                    setShowTokenModal(true);
                    setHighlightedTokenIndex(0); // 打开时重置高亮索引
                  }}
                  tabIndex={0}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src={getCoinLogo(selectedToken)} 
                      alt={selectedToken}
                      style={{ width: 20, height: 20, marginRight: 8 }}
                      onError={(e) => {
                        e.target.src = formatUrl('/asserts/logo/none.png');
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{selectedToken}</span>
                  </div>
                  <ChevronDown style={{ marginLeft: 6, width: 18, height: 18, color: '#888' }} />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="form-group">
              <label className="group-label">{t('buyCryptoPage.paymentMethod')}</label>
              <div
                className="payment-method-row"
                style={{ cursor: 'pointer', height: 58 }}
                onClick={() => {
                  setTempSelectedPaymentMethod(selectedPaymentMethod);
                  setShowPaymentModal(true);
                }}
              >
                {selectedPaymentMethod === 'card' && (
                  <>
                    <img src={formatUrl("/asserts/visa-mastercord-7fce451ceb.png")} alt="visa-mastercard" className="payment-logo" />
                    <span className="method-name">{t('buyCryptoPage.bankCard')}</span>
                  </>
                )}
                {selectedPaymentMethod === 'googlepay' && (
                  <>
                    <img src={formatUrl("/asserts/google-dc10d89cbf89.png")} alt="googlepay" className="payment-logo" />
                    <span className="method-name">{t('buyCryptoPage.googlePay')}</span>
                  </>
                )}
                {selectedPaymentMethod === 'c2c' && (
                  <>
                    <img src={formatUrl("/asserts/currency/aaa-p2p-icon.png")} alt="c2c-buy" className="payment-logo" />
                    <span className="method-name">{t('buyCryptoPage.c2cBuy')}</span>
                  </>
                )}
                <span name="payment-method-row-span-icon" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    style={{ color: '#9c9c9c', display: 'block' }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.698 12.568a.9.9 0 00-.061-1.205l-6-6-.069-.061a.9.9 0 00-1.266 1.266l.061.069L13.727 12l-5.364 5.363a.9.9 0 001.274 1.274l6-6 .061-.069z" fill="currentColor"></path>
                  </svg>
                </span>
              </div>
            </div>

            <button 
              type="button" 
              className={`submit-btn ${isFormValidForButton() ? 'enabled' : ''}`}
              onClick={() => {
                if (!isFormValidForButton()) return;
                
                if (selectedPaymentMethod === 'card') {
                  setShowCreditCardModal(true);
                } else {
                  // TODO: Handle other payment methods
                  console.log(`Buy ${selectedToken} with ${selectedPaymentMethod}`);
                }
              }}
            >
              {selectedPaymentMethod === 'card'
                ? t('buyCryptoPage.addNewCard')
                : `买入 ${selectedToken}`}
            </button>
          </form>
        </div>
      </main>

      {/* 币种选择弹窗 */}
      {showCurrencyModal && (
        <div
          className="deposit-modal-overlay"
          onClick={closeCurrencyModal}
        >
          <div
            ref={modalRef}
            className="deposit-modal-content"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeCurrencyModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('userDashboard.modal.selectPaymentCurrency')}
            </h2>

            {/* Currency Selector */}
            <div className="mb-6">
              <div className="relative">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t('userDashboard.modal.searchCurrency')}
                      value={searchCurrency}
                      onChange={(e) => setSearchCurrency(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                      autoFocus
                      style={{
                        fontSize: '16px', // 确保字体大小至少16px
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none'
                      }}
                      // 移动端优化属性
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                </div>

                {/* Currency Options */}
                <div ref={currencyListRef} className="max-h-[380px] overflow-y-auto">
                  {filteredCurrencies.map((currency, index) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className={`w-full flex items-center justify-between p-3 border-l-4 transition-all duration-200 ${
                        selectedFiat === currency.code 
                          ? 'bg-blue-50 border-blue-500' 
                          : index === highlightedIndex && highlightedIndex >= 0
                          ? 'bg-gray-50 border-transparent'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 flex items-center justify-center mr-3">
                          <span className="text-lg font-medium">{currency.symbol}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium">{currency.code}</span>
                          <span className="text-gray-500 text-sm">{currency.name}</span>
                        </div>
                      </div>
                      {selectedFiat === currency.code && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 加密币选择弹窗 */}
      {showTokenModal && (
        <div
          className="deposit-modal-overlay"
          onClick={closeTokenModal}
        >
          <div
            ref={tokenModalRef}
            className="deposit-modal-content"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeTokenModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('buyCryptoPage.selectCrypto')}
            </h2>

            {/* Token Selector */}
            <div className="mb-6">
              <div className="relative">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t('buyCryptoPage.searchCrypto')}
                      value={searchToken}
                      onChange={(e) => setSearchToken(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                      autoFocus
                      style={{
                        fontSize: '16px', // 确保字体大小至少16px
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none'
                      }}
                      // 移动端优化属性
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                </div>

                {/* Token Options */}
                <div ref={tokenListRef} className="max-h-[380px] overflow-y-auto">
                  {filteredTokens.map((token, index) => (
                    <button
                      key={token}
                      onClick={() => handleTokenSelect(token)}
                      className={`w-full flex items-center justify-between p-3 border-l-4 transition-all duration-200 ${
                        selectedToken === token 
                          ? 'bg-blue-50 border-blue-500' 
                          : index === highlightedTokenIndex && highlightedTokenIndex >= 0
                          ? 'bg-gray-50 border-transparent'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
                          <img 
                            src={getCoinLogo(token)} 
                            alt={token}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.target.src = formatUrl('/asserts/logo/none.png');
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium">{token}</span>
                        </div>
                      </div>
                      {selectedToken === token && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 支付方式弹窗 */}
      {showPaymentModal && (
        <div className="deposit-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div
            className="deposit-modal-content"
            style={{ maxWidth: 400, padding: 0, position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {/* 支付方式 */}
            <div style={{ padding: '32px 32px 16px 32px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
                {t('buyCryptoPage.paymentMethods')}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
                {t('buyCryptoPage.recommended')}
              </div>
              {/* option1: 银行卡 */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, 
                  background: tempSelectedPaymentMethod === 'card' ? '#eff6ff' : '#f9fafb', 
                  borderRadius: 8, padding: '12px 16px', marginBottom: 18, 
                  border: tempSelectedPaymentMethod === 'card' ? '1px solid #60a5fa' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s', height: 60,
                }}
                onClick={() => setTempSelectedPaymentMethod('card')}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = tempSelectedPaymentMethod === 'card' ? '#eff6ff' : '#f9fafb'}
              >
                <img src={formatUrl("/asserts/visa-mastercord-7fce451ceb.png")} alt="visa-mastercard" style={{ width: 32, height: 20, objectFit: 'contain' }} />
                <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 8 }}>
                  {t('buyCryptoPage.bankCard')}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
                {t('buyCryptoPage.other')}
              </div>
              {/* option2: google pay */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, 
                  background: tempSelectedPaymentMethod === 'googlepay' ? '#eff6ff' : '#f9fafb', 
                  borderRadius: 8, padding: '12px 16px', marginBottom: 18, 
                  border: tempSelectedPaymentMethod === 'googlepay' ? '1px solid #60a5fa' : '1px solid transparent', 
                  cursor: 'pointer', transition: 'all 0.15s', height: 60,
                }}
                onClick={() => setTempSelectedPaymentMethod('googlepay')}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = tempSelectedPaymentMethod === 'googlepay' ? '#eff6ff' : '#f9fafb'}
              >
                <img src={formatUrl("/asserts/google-dc10d89cbf89.png")} alt="googlepay" style={{ width: 32, height: 20, objectFit: 'contain' }} />
                <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 8 }}>
                  {t('buyCryptoPage.googlePay')}
                </span>
              </div>
              {/* option3: C2C */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, 
                  background: tempSelectedPaymentMethod === 'c2c' ? '#eff6ff' : '#f9fafb', 
                  borderRadius: 8, padding: '12px 16px', marginBottom: 18, 
                  border: tempSelectedPaymentMethod === 'c2c' ? '1px solid #60a5fa' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s', height: 60,
                }}
                onClick={() => setTempSelectedPaymentMethod('c2c')}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = tempSelectedPaymentMethod === 'c2c' ? '#eff6ff' : '#f9fafb'}
              >
                <img src={formatUrl("/asserts/currency/aaa-p2p-icon.png")} alt="c2c-buy" style={{ width: 32, height: 20, objectFit: 'contain' }} />
                <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 8 }}>
                  {t('buyCryptoPage.c2cBuy')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    style={{ color: '#9c9c9c', display: 'block' }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.698 12.568a.9.9 0 00-.061-1.205l-6-6-.069-.061a.9.9 0 00-1.266 1.266l.061.069L13.727 12l-5.364 5.363a.9.9 0 001.274 1.274l6-6 .061-.069z" fill="currentColor"></path>
                  </svg>
                </span>
              </div>
              <button
                onClick={() => {
                  // if choose c2c, then jump to c2c page
                  if (tempSelectedPaymentMethod === 'c2c') {
                    navigateLocalized(`/trade/c2c/${selectedToken}?fiat=${selectedFiat}`);
                  } else {
                    // if choose other, then close the modal
                    setSelectedPaymentMethod(tempSelectedPaymentMethod);
                    setShowPaymentModal(false);
                  }
                }}
                style={{ 
                  width: '100%', padding: '12px 0', fontSize: 16, fontWeight: 600, 
                  borderRadius: 8, background: '#fcd535', color: '#111', 
                  border: 'none', marginTop: 8 , marginBottom: 16
                }}
              >
                {t('buyCryptoPage.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加新卡弹窗 */}
      <BuyCryptoNewCard
        isOpen={showCreditCardModal}
        onClose={() => setShowCreditCardModal(false)}
        onSubmit={handleCreditCardSubmit}
      />
    </div>
  );
};

export default BuyCryptoPage; 