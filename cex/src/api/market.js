import api from './index';

// 模拟数据 - 实际项目中应该从API获取
const mockMarketOverview = {
  totalMarketCap: '$1.2T',
  marketCapChange: 2.45,
  volume24h: '$89.5B',
  volumeChange: -1.23,
  btcDominance: 48.2,
  btcDominanceChange: 0.15,
  activeCoins: 2456
};

const mockPopularCoins = [
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    price: '43,250.5', 
    change: 2.45, 
    icon: '₿',
    volume: '1.2B'
  },
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    price: '2,650.3', 
    change: -1.23, 
    icon: 'Ξ',
    volume: '890M'
  },
  { 
    symbol: 'BNB', 
    name: 'BNB', 
    price: '315.8', 
    change: 3.67, 
    icon: '🔶',
    volume: '245M'
  },
  { 
    symbol: 'SOL', 
    name: 'Solana', 
    price: '98.45', 
    change: -2.15, 
    icon: '◎',
    volume: '320M'
  }
];

/**
 * 获取市场概览数据
 */
export const fetchMarketOverview = async () => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get('/market/overview');
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMarketOverview;
  } catch (error) {
    console.error('Failed to fetch market overview:', error);
    throw error;
  }
};

/**
 * 获取热门币种数据
 */
export const fetchPopularCoins = async () => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get('/market/popular-coins');
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPopularCoins;
  } catch (error) {
    console.error('Failed to fetch popular coins:', error);
    throw error;
  }
};

/**
 * 获取所有交易对列表
 */
export const fetchAllTradingPairs = async () => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get('/market/trading-pairs');
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    return [
      { symbol: 'BTC/USDT', price: 43259.47, change: 2.43, volume: '1.2B' },
      { symbol: 'ETH/USDT', price: 2654.32, change: -1.23, volume: '890M' },
      { symbol: 'BNB/USDT', price: 315.95, change: 3.57, volume: '245M' },
      { symbol: 'ADA/USDT', price: 0.4521, change: 5.24, volume: '156M' },
      { symbol: 'SOL/USDT', price: 98.63, change: -2.10, volume: '320M' },
      { symbol: 'DOT/USDT', price: 7.22, change: 1.83, volume: '89M' },
      { symbol: 'AVAX/USDT', price: 36.72, change: 4.20, volume: '178M' },
      { symbol: 'MATIC/USDT', price: 0.8949, change: -0.84, volume: '134M' }
    ];
  } catch (error) {
    console.error('Failed to fetch trading pairs:', error);
    throw error;
  }
};