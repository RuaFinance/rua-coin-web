import { Calculator, Percent, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import React, { useState } from 'react';

import WarningAlert from './MsgAlert';
import SyntheticEventHandlers from './SyntheticEventHandlers';

const TradingPanel = ({ pairData, symbol }) => {
  const [orderType, setOrderType] = useState('limit'); // limit, market, stop
  const [side, setSide] = useState('buy'); // buy, sell
  const [price, setPrice] = useState('50000.00');
  const [amount, setAmount] = useState('1');
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState(null);
  const FEE_RATE = 0.0001; // 万1
  const [showAlert, setShowAlert] = useState(false);
  const { handleKeyDown } = SyntheticEventHandlers();

  const [balance] = useState({
    BTC: 0.12345678,
    USDT: 1250.50
  });

  const orderTypes = [
    { value: 'limit', label: '限价单' },
    { value: 'market', label: '市价单' },
    { value: 'stop', label: '止损单' }
  ];

  const percentageOptions = [25, 50, 75, 100];

  const toFixedFloor = (value, decimals = 8) => {
    const factor = 10 ** decimals;
    return Math.floor(value * factor) / factor;
  };

  const handlePercentageClick = (percent) => {
    setPercentage(prev => prev === percent ? null : percent); // 相同值则重置
    if (side === 'buy') {
      const availableBalance = balance.USDT;
      const calculatedTotal = (availableBalance * percent) / 100;
      handleTotalChange(calculatedTotal);
      if (price) {
        setAmount(toFixedFloor((calculatedTotal / parseFloat(price))));
      }
    } else {
      const availableBalance = balance.BTC;
      const calculatedAmount = (availableBalance * percent) / 100;
      setAmount(calculatedAmount.toFixed(8));
      if (price) {
        setTotal((calculatedAmount * parseFloat(price)).toFixed(2));
      }
    }
  };

  // ------------
  // Amount
  // ------------
  const handleAmountChange = (value) => {
    setAmount(value);
    if (price && value) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handleAmountIncrement = () => {
    const newValue = (parseFloat(amount || "0") + 1).toFixed(1);
    handleAmountChange(newValue);
  };

  const handleAmountDecrement = () => {
    const newValue = Math.max(0, parseFloat(amount || "0") - 1).toFixed(1);
    handleAmountChange(newValue);
  };

  // ------------
  // Total
  // ------------
  // When the amount or price is edited
  const handleTotalChange = (value) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue) && value != "") {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);

    setTotal(value);
    if (price && value) {
      // setAmount((parseFloat(value) / parseFloat(price)).toFixed(8));
      let fee = numValue * FEE_RATE;
      let numPrice = parseFloat(price);

      let calAmount = toFixedFloor(
        (numValue / numPrice) * (1 / (1 + FEE_RATE))
      );
      let numAmount = parseFloat(calAmount);
      fee = numAmount * numPrice * FEE_RATE;

      if ((numAmount * numPrice + fee) > numValue) {

      }

      setTotal(numAmount * numPrice);
      setAmount(numAmount);
    }
  };

  // When the total is edited
  const handleTotalAmount = (value) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return;
    }

    if (price && parseFloat(price) > 0 && value) {
      let fee = numValue * FEE_RATE;
      let numPrice = parseFloat(price);

      let calAmount = toFixedFloor(
        (numValue / numPrice) * (1 / (1 + FEE_RATE))
      );
      let numAmount = parseFloat(calAmount);
      fee = numAmount * numPrice * FEE_RATE;

      setTotal(numAmount * numPrice);
      setAmount(numAmount);
    }
  };

  const handleTotalIncrement = () => {
    const newValue = (parseFloat(total || "0") + 1).toFixed(1);
    handleTotalAmount(newValue);
  };

  const handleTotalDecrement = () => {
    const newValue = Math.max(0, parseFloat(total || "0") - 1).toFixed(1);
    handleTotalAmount(newValue);
  };

  const handleTotalOnBlur = (value) => {
    let numValue = parseFloat(value)

    if (balance.USDT > toFixedFloor(numValue + numValue * FEE_RATE)) {
      return
    }
    handleTotalAmount(value);
  }

  // ------------
  // Price
  // ------------
  const handlePriceChange = (value) => {
    setPrice(value);
    if (amount && value) {
      setTotal((parseFloat(amount) * parseFloat(value)).toFixed(2));
    }
  };

  const handlePriceIncrement = () => {
    const newValue = (parseFloat(price || "0") + 1).toFixed(1);
    handlePriceChange(newValue);
  };
  
  const handlePriceDecrement = () => {
    const newValue = Math.max(0, parseFloat(price || "0") - 1).toFixed(1);
    handlePriceChange(newValue);
  };
  
  const calculateFee = () => {
    if (!total) return '0.00';
    return (parseFloat(total) * 0.0001).toFixed(8); // 0.01% 手续费
  };

  const getAvailableBalance = () => {
    return side === 'buy' ? balance.USDT : balance.BTC;
  };

  const getBalanceSymbol = () => {
    return side === 'buy' ? 'USDT' : symbol;
  };

  return (
    <div className="card-dark h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">交易</h2>
        <div className="flex items-center space-x-1">
          {/* <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Calculator className="h-4 w-4" />
          </button> */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Buy/Sell Tabs */}
        <div className="grid grid-cols-2 gap-1 mb-4 card-inner-form rounded-lg">
          <button
            onClick={() => setSide('buy')}
            className={`py-2 px-2 sm:px-4 rounded-md text-sm font-medium transition-colors ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>买入</span>
            </div>
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`py-2 px-2 sm:px-4 rounded-md text-sm font-medium transition-colors ${
              side === 'sell'
                ? 'bg-[#f1493f] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <TrendingDown className="h-4 w-4" />
              <span>卖出</span>
            </div>
          </button>
        </div>

        {/* Order Type Selector */}
        <div className="mb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {orderTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setOrderType(type.value)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition-colors whitespace-nowrap flex-shrink-0 ${
                  orderType === type.value
                    ? 'text-[#f0f0f0] font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-[#1d1d1d]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Input */}
        {orderType !== 'market' && (
          <div className="mb-4">
            <div className="
              relative 
              w-full 
              font-mono 
              flex 
              items-center 
              bg-[#1d1d1d] 
              rounded 
              px-3 
              py-2 
              text-sm
              border 
              border-transparent 
              hover:border-[#acacac]
              transition-colors
              duration-200
            ">
              {/* 前缀：价格 */}
              <span className="text-gray-400 whitespace-nowrap mr-2">价格</span>

              {/* 输入框本体：右对齐 */}
              <input
                type="text"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-right bg-[#1d1d1d] rounded-[4px] text-white placeholder-gray-400 focus:outline-none focus:border-transparent text-sm"
                inputMode="decimal"
              />
          
              {/* 后缀：USDT + 上下箭头 */}
              <div className="flex items-center gap-1 ml-2">
                <span className="text-gray-400 text-sm">USDT</span>
                <div className="flex flex-col items-center">
                  <button
                    onClick={handlePriceIncrement}
                    className="w-[16px] h-[12px] text-xs text-gray-400 hover:text-white leading-none"
                  >
                    ▲
                  </button>
                  <button
                    onClick={handlePriceDecrement}
                    className="w-[16px] h-[12px] text-xs text-gray-400 hover:text-white leading-none"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-4">
          <div className="
            relative 
            w-full 
            font-mono 
            flex 
            items-center 
            bg-[#1d1d1d] 
            rounded 
            px-3 
            py-2 
            text-sm
            border 
            border-transparent 
            hover:border-[#acacac]
            transition-colors
            duration-200
          ">
            {/* 前缀：数量 */}
            <span className="text-gray-400 whitespace-nowrap mr-2">数量</span>

            {/* 输入框本体：右对齐 */}
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00000000"
              className="w-full px-3 py-2 text-right bg-[#1d1d1d] rounded-[4px] text-white placeholder-gray-400 focus:outline-none focus:border-transparent text-sm"
              inputMode="decimal"
            />
        
            {/* 后缀：BTC + 上下箭头 */}
            <div className="flex items-center gap-1 ml-2">
              <span className="text-gray-400 text-sm">{symbol}</span>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleAmountIncrement}
                  className="w-[16px] h-[12px] text-xs text-gray-400 hover:text-white leading-none"
                >
                  ▲
                </button>
                <button
                  onClick={handleAmountDecrement}
                  className="w-[16px] h-[12px] text-xs text-gray-400 hover:text-white leading-none"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-4">
          {percentageOptions.map((percent) => (
            <button
              key={percent}
              onClick={() => handlePercentageClick(percent)}
              className={`py-2 px-1 sm:px-2 text-xs rounded transition-colors ${
                percentage === percent
                  ? 'bg-[#efb90b] text-[#1d1d1d] font-bold'
                  : 'bg-[#1d1d1d] text-gray-400 hover:text-[#ffffff] font-bold hover:bg-[#2b2b2b]'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* Total Input */}
        <div className="mb-4">
          <div className="
            relative 
            w-full 
            font-mono 
            flex 
            items-center 
            bg-[#1d1d1d] 
            rounded 
            px-3 
            py-2 
            text-sm
            border 
            border-transparent 
            hover:border-[#acacac]
            transition-colors
            duration-200
          ">
            {/* 前缀：总额 */}
            <span className="text-gray-400 whitespace-nowrap mr-2">总额</span>

            {/* 输入框本体：右对齐 */}
            <input
              type="text"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              onBlur={(e) => handleTotalOnBlur(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full px-3 py-2 text-right bg-[#1d1d1d] rounded-[4px] text-white placeholder-gray-400 focus:outline-none focus:border-transparent text-sm"
              inputMode="decimal"
            />
        
            {/* 后缀：USDT + 上下箭头 */}
            <div className="flex items-center gap-1 ml-2">
              <span className="text-gray-400 text-sm">USDT</span>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleTotalIncrement}
                  className="w-[16px] h-[12px] text-xs text-gray-400 hover:text-white leading-none"
                >
                  ▲
                </button>
                <button
                  onClick={handleTotalDecrement}
                  className="w-[16px] h-[12px] text-xs text-gray-400 hover:text-white leading-none"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="mb-4 p-3 bg-[#1d1d1d] rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">可用余额</span>
            <span className="text-white font-mono text-xs sm:text-sm">
              {getAvailableBalance().toFixed(8)} {getBalanceSymbol()}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">手续费:</span>
            <span className="text-white font-mono text-xs sm:text-sm">{calculateFee()} USDT</span>
          </div>
          {total && (
            <div className="flex justify-between">
              <span className="text-gray-400">实际{side === 'buy' ? '支付' : '获得'}:</span>
              <span className="text-white font-mono text-xs sm:text-sm">
                {side === 'buy' 
                  ? (parseFloat(total) + parseFloat(calculateFee())).toFixed(8)
                  : (parseFloat(total) - parseFloat(calculateFee())).toFixed(8)
                } USDT
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex-shrink-0">
        <button
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-[#f1493f] hover:bg-red-700'
          }`}
          disabled={!amount || (!price && orderType !== 'market')}
        >
          {side === 'buy' ? '买入' : '卖出'} {symbol}
        </button>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-[#424242]">
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 px-2 sm:px-3 text-xs bg-[#1d1d1d] text-gray-400 hover:text-white hover:bg-slate-600 rounded transition-colors">
              止盈止损
            </button>
            <button className="py-2 px-2 sm:px-3 text-xs bg-[#1d1d1d] text-gray-400 hover:text-white hover:bg-slate-600 rounded transition-colors">
              OCO订单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;