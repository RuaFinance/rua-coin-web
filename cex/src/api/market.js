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

const mockData = [
  { time: '2025-06-01', open: 100.50, high: 103.20, low: 99.80, close: 102.75, volume: 1200000 },
  { time: '2025-06-02', open: 103.00, high: 105.40, low: 101.60, close: 104.30, volume: 1350000 },
  { time: '2025-06-03', open: 104.50, high: 107.25, low: 103.90, close: 106.80, volume: 1420000 },
  { time: '2025-06-04', open: 107.00, high: 107.50, low: 104.20, close: 105.10, volume: 1280000 },
  { time: '2025-06-05', open: 105.25, high: 106.00, low: 102.75, close: 103.40, volume: 1310000 },
  { time: '2025-06-06', open: 103.60, high: 104.90, low: 101.30, close: 102.85, volume: 1250000 },
  { time: '2025-06-07', open: 102.00, high: 103.75, low: 98.50, close: 103.20, volume: 1190000 },
  { time: '2025-06-08', open: 103.50, high: 105.80, low: 102.40, close: 105.25, volume: 1400000 },
  { time: '2025-06-09', open: 105.75, high: 108.60, low: 105.30, close: 107.90, volume: 1500000 },
  { time: '2025-06-10', open: 108.20, high: 110.25, low: 107.50, close: 109.40, volume: 1550000 },
  { time: '2025-06-11', open: 109.50, high: 111.30, low: 108.20, close: 110.75, volume: 1600000 },
  { time: '2025-06-12', open: 111.00, high: 112.40, low: 109.60, close: 110.90, volume: 1580000 },
  { time: '2025-06-13', open: 110.80, high: 112.60, low: 109.20, close: 111.40, volume: 1490000 },
  { time: '2025-06-14', open: 111.60, high: 113.80, low: 110.75, close: 112.90, volume: 1530000 },
  { time: '2025-06-15', open: 113.20, high: 114.50, low: 112.10, close: 113.75, volume: 1470000 },
  { time: '2025-06-16', open: 114.00, high: 115.20, low: 112.40, close: 114.60, volume: 1620000 }, // Peak
  { time: '2025-06-17', open: 114.30, high: 114.80, low: 111.90, close: 112.25, volume: 1510000 }, // Reversal
  { time: '2025-06-18', open: 112.50, high: 113.40, low: 110.60, close: 111.80, volume: 1440000 },
  { time: '2025-06-19', open: 111.20, high: 112.00, low: 108.50, close: 109.30, volume: 1390000 },
  { time: '2025-06-20', open: 109.50, high: 110.80, low: 107.20, close: 108.40, volume: 1370000 },
  { time: '2025-06-21', open: 108.60, high: 109.90, low: 106.80, close: 107.50, volume: 1330000 },
  { time: '2025-06-22', open: 107.80, high: 108.70, low: 105.30, close: 106.20, volume: 1300000 },
  { time: '2025-06-23', open: 106.50, high: 108.40, low: 105.90, close: 107.80, volume: 1290000 },
  { time: '2025-06-24', open: 108.20, high: 109.50, low: 107.60, close: 108.90, volume: 1340000 },
  { time: '2025-06-25', open: 109.20, high: 110.80, low: 108.40, close: 110.25, volume: 1380000 },
  { time: '2025-06-26', open: 110.50, high: 111.20, low: 108.70, close: 109.40, volume: 1360000 }, 
  { time: '2025-06-27', open: 109.60, high: 110.90, low: 108.10, close: 108.50, volume: 1320000 },
  { time: '2025-06-28', open: 108.80, high: 109.60, low: 106.40, close: 107.20, volume: 1270000 },
  { time: '2025-06-29', open: 107.40, high: 108.30, low: 105.20, close: 106.80, volume: 1240000 },
  { time: '2025-06-30', open: 107.00, high: 108.80, low: 106.50, close: 107.60, volume: 1260000 },
  { time: '2025-07-01', open: 108.20, high: 109.40, low: 107.80, close: 108.90, volume: 1290000 },
  { time: '2025-07-02', open: 109.20, high: 111.50, low: 108.70, close: 110.80, volume: 1410000 },
  { time: '2025-07-03', open: 111.00, high: 112.80, low: 110.50, close: 112.30, volume: 1480000 },
  { time: '2025-07-04', open: 112.60, high: 113.20, low: 111.40, close: 112.80, volume: 1320000 }, // 假突破
  { time: '2025-07-05', open: 112.40, high: 112.40, low: 109.70, close: 110.20, volume: 1850000 }, // 放量下跌
  { time: '2025-07-06', open: 109.80, high: 111.50, low: 109.30, close: 110.90, volume: 1570000 },
  { time: '2025-07-07', open: 111.20, high: 112.00, low: 108.80, close: 109.40, volume: 1630000 }, // 下降通道
  { time: '2025-07-08', open: 109.60, high: 110.20, low: 107.50, close: 108.00, volume: 1760000 },
  { time: '2025-07-09', open: 107.80, high: 108.60, low: 106.20, close: 106.80, volume: 1920000 }, // 加速下跌
  { time: '2025-07-10', open: 106.50, high: 107.80, low: 105.30, close: 107.20, volume: 2050000 }, // 下影线探底
  { time: '2025-07-11', open: 107.40, high: 108.90, low: 107.10, close: 108.60, volume: 1680000 }, // 超跌反弹
  { time: '2025-07-12', open: 108.80, high: 109.40, low: 107.90, close: 108.30, volume: 1420000 },
  // 盘整阶段（7月13日-17日）
  { time: '2025-07-13', open: 108.50, high: 109.20, low: 107.80, close: 108.70, volume: 1260000 },
  { time: '2025-07-14', open: 108.90, high: 109.60, low: 108.30, close: 108.90, volume: 1180000 },
  { time: '2025-07-15', open: 109.10, high: 109.80, low: 108.40, close: 109.20, volume: 1350000 },
  { time: '2025-07-16', open: 109.40, high: 110.00, low: 108.70, close: 109.60, volume: 1480000 }, // 突破前高
  { time: '2025-07-17', open: 109.80, high: 111.50, low: 109.50, close: 111.20, volume: 1820000 }, // 放量突破
  // 上升阶段（7月18日-22日）
  { time: '2025-07-18', open: 111.50, high: 112.80, low: 111.20, close: 112.40, volume: 1750000 },
  { time: '2025-07-19', open: 112.60, high: 113.40, low: 112.00, close: 113.00, volume: 1610000 },
  { time: '2025-07-20', open: 113.20, high: 114.60, low: 112.80, close: 114.20, volume: 1980000 }, // 跳空缺口
  { time: '2025-07-21', open: 114.50, high: 115.30, low: 113.70, close: 114.80, volume: 1870000 },
  { time: '2025-07-22', open: 115.00, high: 116.20, low: 114.60, close: 115.90, volume: 2030000 }, // 新高收盘
  { time: '2025-07-23', open: 114.00, high: 114.20, low: 109.60, close: 112.90, volume: 2500000 },
];

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
    // await new Promise(resolve => setTimeout(resolve, 500));
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
    // await new Promise(resolve => setTimeout(resolve, 500));
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

// 模拟数据
const generateKLineData = () => {
  const data = []
  let basePrice = 5000
  let baseVolume = 10000
  let timestamp = new Date('2023-01-01').getTime()
  for (let i = 0; i < 1000; i++) {
    const open = basePrice + Math.random() * 20 - 10
    const close = open + Math.random() * 20 - 10
    const high = Math.max(open, close) + Math.random() * 10
    const low = Math.min(open, close) - Math.random() * 10
    const volume = baseVolume + Math.random() * 5000 - 2500
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    })
    basePrice = close
    timestamp += 24 * 60 * 60 * 1000 // 增加一天
  }
  return data
}

// 测试 kline charts
export async function fetchMockBars() {
  // 模拟的K线数据，时间戳必须是毫秒级

  // const data = []
  // let basePrice = 5000
  // let baseVolume = 10000
  // let timestamp = new Date('2023-01-01').getTime()
  // for (let i = 0; i < 100; i++) {
  //   const open = basePrice + Math.random() * 20 - 10
  //   const close = open + Math.random() * 20 - 10
  //   const high = Math.max(open, close) + Math.random() * 10
  //   const low = Math.min(open, close) - Math.random() * 10
  //   const volume = baseVolume + Math.random() * 5000 - 2500
  //   data.push({
  //     timestamp,
  //     open,
  //     high,
  //     low,
  //     close,
  //     volume
  //   })
  //   basePrice = close
  //   timestamp += 24 * 60 * 60 * 1000 // 增加一天
  // }
  return generateKLineData();
}
