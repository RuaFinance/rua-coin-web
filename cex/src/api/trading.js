import api from './index';

/**
 * 获取交易对详情数据
 * @param {string} symbol - 交易对符号，如 BTC/USDT
 */
export const fetchTradingPairData = async (symbol) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get(`/trading/pair/${symbol}`);
    
    // 模拟API延迟
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    return {
      symbol: symbol || 'BTC/USDT',
      price: 43250.50,
      change: 2.45,
      high24h: 44100.00,
      low24h: 42800.00,
      volume24h: '1.2B USDT',
      trades24h: '28,456 BTC'
    };
  } catch (error) {
    console.error(`Failed to fetch data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * 获取K线数据
 * @param {string} symbol - 交易对符号，如 BTC/USDT
 * @param {string} interval - 时间间隔，如 1m, 5m, 15m, 1H, 4H, 1D, 1W
 * @param {number} limit - 返回的K线数量
 */
export const fetchKlineData = async (symbol, interval, limit = 100) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get(`/trading/kline/${symbol}?interval=${interval}&limit=${limit}`);
    
    // 模拟API延迟
    // await new Promise(resolve => setTimeout(resolve, 300));
    
    // 解析交易对
    const baseAsset = symbol.split('/')[0];
    
    // 生成模拟K线数据
    const klines = [];
    const now = new Date();
    let basePrice = 43250.50;
    let lastClose = basePrice;
    
    // 确定时间间隔（毫秒）
    const getIntervalMs = (interval) => {
      switch(interval) {
        case '1m': return 60 * 1000;
        case '5m': return 5 * 60 * 1000;
        case '15m': return 15 * 60 * 1000;
        case '1H': return 60 * 60 * 1000;
        case '4H': return 4 * 60 * 60 * 1000;
        case '1D': return 24 * 60 * 60 * 1000;
        case '1W': return 7 * 24 * 60 * 60 * 1000;
        default: return 60 * 60 * 1000; // 默认1小时
      }
    };
    
    const intervalMs = getIntervalMs(interval);
    
    // 生成K线数据
    for (let i = 0; i < limit; i++) {
      // 计算这根K线的时间
      const time = new Date(now.getTime() - (i * intervalMs));
      
      // 生成随机价格变动（-1%到+1%之间）
      const priceChange = lastClose * (Math.random() * 0.02 - 0.01);
      const open = lastClose;
      const close = open + priceChange;
      
      // 确保价格不会变化太大
      const volatility = Math.min(0.01, Math.abs(priceChange / open)) * 1.5;
      
      // 生成高低点
      const high = Math.max(open, close) * (1 + Math.random() * volatility);
      const low = Math.min(open, close) * (1 - Math.random() * volatility);
      
      // 生成成交量（基于价格和波动率）
      const volume = (basePrice * (0.5 + Math.random() * 1.5) * (1 + volatility * 10)) / 10;
      
      // 添加K线
      klines.push({
        time: time.getTime(),
        open,
        high,
        low,
        close,
        volume
      });
      
      // 为下一根K线设置开盘价
      lastClose = close;
    }
    
    // 按时间排序（最新的在前）
    klines.sort((a, b) => b.time - a.time);
    
    return klines;
  } catch (error) {
    console.error(`Failed to fetch kline data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * 获取订单簿数据
 * @param {string} symbol - 交易对符号，如 BTC/USDT
 * @param {number} limit - 返回的订单数量
 */
export const fetchOrderBook = async (symbol, limit = 20) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get(`/trading/orderbook/${symbol}?limit=${limit}`);
    
    // 模拟API延迟
    // await new Promise(resolve => setTimeout(resolve, 300));
    
    // 生成模拟数据
    const basePrice = 43250.50;
    const asks = [];
    const bids = [];
    
    // 生成卖单（asks）
    for (let i = 0; i < limit / 2; i++) {
      const price = basePrice + (Math.random() * 100);
      const amount = Math.random() * 5;
      const total = price * amount;
      asks.push({
        price: price.toFixed(2),
        amount: amount.toFixed(4),
        total: total.toFixed(2)
      });
    }
    
    // 生成买单（bids）
    for (let i = 0; i < limit / 2; i++) {
      const price = basePrice - (Math.random() * 100);
      const amount = Math.random() * 5;
      const total = price * amount;
      bids.push({
        price: price.toFixed(2),
        amount: amount.toFixed(4),
        total: total.toFixed(2)
      });
    }
    
    // 按价格排序
    asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    
    return { asks, bids };
  } catch (error) {
    console.error(`Failed to fetch order book for ${symbol}:`, error);
    throw error;
  }
};

/**
 * 获取最近成交记录
 * @param {string} symbol - 交易对符号，如 BTC/USDT
 * @param {number} limit - 返回的成交记录数量
 */
export const fetchRecentTrades = async (symbol, limit = 20) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get(`/trading/trades/${symbol}?limit=${limit}`);
    
    // 模拟API延迟
    // await new Promise(resolve => setTimeout(resolve, 300));
    
    // 生成模拟数据
    const basePrice = 43250.50;
    const trades = [];
    
    for (let i = 0; i < limit; i++) {
      const price = basePrice + (Math.random() * 100) - 50;
      const amount = Math.random() * 2;
      const isBuy = Math.random() > 0.5;
      
      // 生成时间，最近的交易在前面
      const now = new Date();
      const time = new Date(now.getTime() - i * 3000);
      
      trades.push({
        id: `trade-${i}`,
        price: price.toFixed(2),
        amount: amount.toFixed(6),
        time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: isBuy ? 'buy' : 'sell'
      });
    }
    
    return trades;
  } catch (error) {
    console.error(`Failed to fetch recent trades for ${symbol}:`, error);
    throw error;
  }
};

/**
 * 创建订单
 * @param {Object} orderData - 订单数据
 */
export const createOrder = async (orderData) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.post('/trading/order', orderData);
    
    // 模拟API延迟
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟成功响应
    return {
      orderId: `ORD-${Date.now()}`,
      status: 'success',
      message: '订单已提交'
    };
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

/**
 * 获取用户余额
 */
export const fetchUserBalance = async () => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get('/user/balance');
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟数据
    return {
      USDT: 1250.50,
      BTC: 0.0325,
      ETH: 1.245,
      BNB: 5.78,
      SOL: 12.34
    };
  } catch (error) {
    console.error('Failed to fetch user balance:', error);
    throw error;
  }
};