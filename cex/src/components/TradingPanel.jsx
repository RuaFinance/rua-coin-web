import React, { useState } from 'react';
import { Calculator, Percent, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const TradingPanel = () => {
  const [orderType, setOrderType] = useState('limit'); // limit, market, stop
  const [side, setSide] = useState('buy'); // buy, sell
  const [price, setPrice] = useState('43250.50');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState(0);

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

  const handlePercentageClick = (percent) => {
    setPercentage(percent);
    if (side === 'buy') {
      const availableBalance = balance.USDT;
      const calculatedTotal = (availableBalance * percent) / 100;
      setTotal(calculatedTotal.toFixed(2));
      if (price) {
        setAmount((calculatedTotal / parseFloat(price)).toFixed(8));
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

  const handleAmountChange = (value) => {
    setAmount(value);
    if (price && value) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handleTotalChange = (value) => {
    setTotal(value);
    if (price && value) {
      setAmount((parseFloat(value) / parseFloat(price)).toFixed(8));
    }
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    if (amount && value) {
      setTotal((parseFloat(amount) * parseFloat(value)).toFixed(2));
    }
  };

  const calculateFee = () => {
    if (!total) return '0.00';
    return (parseFloat(total) * 0.001).toFixed(2); // 0.1% 手续费
  };

  const getAvailableBalance = () => {
    return side === 'buy' ? balance.USDT : balance.BTC;
  };

  const getBalanceSymbol = () => {
    return side === 'buy' ? 'USDT' : 'BTC';
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">交易</h2>
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Calculator className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Buy/Sell Tabs */}
        <div className="grid grid-cols-2 gap-1 mb-4 p-1 bg-slate-700 rounded-lg">
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
                ? 'bg-red-600 text-white'
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
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
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
            <label className="block text-sm text-gray-400 mb-2">
              价格 (USDT)
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            数量 (BTC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0.00000000"
            />
          </div>
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-4">
          {percentageOptions.map((percent) => (
            <button
              key={percent}
              onClick={() => handlePercentageClick(percent)}
              className={`py-1 px-1 sm:px-2 text-xs rounded transition-colors ${
                percentage === percent
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* Total Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            总额 (USDT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={total}
              onChange={(e) => handleTotalChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Available Balance */}
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">可用余额:</span>
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
                  ? (parseFloat(total) + parseFloat(calculateFee())).toFixed(2)
                  : (parseFloat(total) - parseFloat(calculateFee())).toFixed(2)
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
              : 'bg-red-600 hover:bg-red-700'
          }`}
          disabled={!amount || (!price && orderType !== 'market')}
        >
          {side === 'buy' ? '买入' : '卖出'} BTC
        </button>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 px-2 sm:px-3 text-xs bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600 rounded transition-colors">
              止盈止损
            </button>
            <button className="py-2 px-2 sm:px-3 text-xs bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600 rounded transition-colors">
              OCO订单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;