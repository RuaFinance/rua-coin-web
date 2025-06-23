import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMarketOverview, fetchPopularCoins } from '../api/market';

const HomePage = () => {
  const [marketData, setMarketData] = useState(null);
  const [popularCoins, setPopularCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [marketOverview, coins] = await Promise.all([
          fetchMarketOverview(),
          fetchPopularCoins()
        ]);
        
        setMarketData(marketOverview);
        setPopularCoins(coins);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCoinClick = (symbol) => {
    navigate(`/trading/${symbol}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      {/* 市场概览 */}
      <section className="card mb-6">
        <h2 className="h2-word">市场概览</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div>
            <div className="text-2xl font-bold">{marketData?.totalMarketCap}</div>
            <div className="text-gray-400">总市值</div>
            <div className={`text-sm ${marketData?.marketCapChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData?.marketCapChange >= 0 ? '+' : ''}{marketData?.marketCapChange}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{marketData?.volume24h}</div>
            <div className="text-gray-400">24h成交量</div>
            <div className={`text-sm ${marketData?.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData?.volumeChange >= 0 ? '+' : ''}{marketData?.volumeChange}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{marketData?.btcDominance}%</div>
            <div className="text-gray-400">BTC占比</div>
            <div className={`text-sm ${marketData?.btcDominanceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData?.btcDominanceChange >= 0 ? '+' : ''}{marketData?.btcDominanceChange}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{marketData?.activeCoins}</div>
            <div className="text-gray-400">活跃币种</div>
            <div className="text-sm text-gray-400">--</div>
          </div>
        </div>
      </section>

      {/* 热门币种 */}
      <section className="card">
        <h2 className="h2-word">热门币种</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCoins.map((coin) => (
            <div 
              key={coin.symbol} 
              className="bg-slate-900 p-4 rounded-lg cursor-pointer hover:bg-slate-500 transition-colors"
              onClick={() => handleCoinClick(coin.symbol)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{coin.icon}</div>
                <div>
                  <div className="font-bold text-white">{coin.symbol}</div>
                  <div className="text-sm text-gray-400">{coin.name}</div>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="text-lg font-mono text-white">${coin.price}</div>
                <div className={`text-sm ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? '+' : ''}{coin.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;