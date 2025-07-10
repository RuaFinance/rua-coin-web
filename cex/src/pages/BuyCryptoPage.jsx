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
import { useCurrentLocale } from '../components/LanguageRouter/AdvancedLanguageRouter';
import { Currencies } from '../config/Currencies';
import { TokenList, SymbolSet } from '../config/SymbolSetConfig';
import { formatUrl } from '../router/config';

const allCurrencies = Currencies;
const tokens = TokenList;

const BuyCryptoPage = () => {
  const { currency = 'USD', token = 'USDT' } = useParams();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useCurrentLocale();

  const [selectedFiat, setSelectedFiat] = useState(currency.toUpperCase());
  const [selectedToken, setSelectedToken] = useState(token.toUpperCase());
  const [fiatAmount, setFiatAmount] = useState('');
  const [touched, setTouched] = useState(false);
  const minAmount = 10;

  // 弹窗相关 state
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [searchCurrency, setSearchCurrency] = useState('');
  const [searchToken, setSearchToken] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [highlightedTokenIndex, setHighlightedTokenIndex] = useState(0);
  const currencyListRef = React.useRef(null);
  const tokenListRef = React.useRef(null);
  const modalRef = React.useRef(null);
  const tokenModalRef = React.useRef(null);

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
    
    // 构建完整的交易对符号来检查
    const fullSymbol = `${symbol}/USDT`;
    
    // 检查symbolSet中是否包含该币种
    if (SymbolSet.has(fullSymbol)) {
      return formatUrl(`/asserts/logo/${symbol}.png`);
    }
    
    // 如果没有找到，返回默认的none.png
    return formatUrl('/asserts/logo/none.png');
  };

  // 关闭弹窗
  const closeCurrencyModal = () => {
    setShowCurrencyModal(false);
    setSearchCurrency('');
    setHighlightedIndex(0);
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setSearchToken('');
    setHighlightedTokenIndex(0);
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
          {/* Left popular list */}
          <section className="popular-coins">
            <h3 className="section-title">{t('buyCryptoPage.popularCrypto')}</h3>
            <ul>
              {[
                { symbol: 'BNB', price: '4,799.61', change: '+0.84%' },
                { symbol: 'BTC', price: '798,990.26', change: '+2.14%' },
                { symbol: 'ETH', price: '19,892.05', change: '+4.47%' },
                { symbol: 'HYPER', price: '3.93', change: '+381.85%' },
                { symbol: 'SOL', price: '1,123.81', change: '+1.80%' },
              ].map((item) => (
                <li key={item.symbol} className="coin-row">
                  <span>{item.symbol}</span>
                  <span className="price">¥{item.price}</span>
                  <span className="change">{item.change}</span>
                </li>
              ))}
            </ul>
          </section>
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
              <div className="payment-method-row">
                <img
                  src={formatUrl('/asserts/visa-be5f3a92ce95.png')}
                  alt="visa"
                  className="payment-logo"
                />
                <span className="method-name">{t('buyCryptoPage.defaultCard')}</span>
                <LanguageAwareLink to="#" className="method-change">
                  &gt;
                </LanguageAwareLink>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled>
              {t('buyCryptoPage.addNewCard')}
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Currency Options */}
                <div ref={currencyListRef} className="max-h-40 overflow-y-auto">
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Token Options */}
                <div ref={tokenListRef} className="max-h-40 overflow-y-auto">
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
    </div>
  );
};

export default BuyCryptoPage; 