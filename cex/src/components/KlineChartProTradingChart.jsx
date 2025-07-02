// KlineChartProCustom.jsx
import { KLineChartPro } from '@klinecharts/pro';
import { dispose } from 'klinecharts';
import React, { useRef, useEffect } from 'react';

import '@klinecharts/pro/dist/klinecharts-pro.css';
import { fetchMockBars } from '../api/market';
import klineStyleConfig from '../config/KlineChartProConfig';

// 示例：自定义数据源，前期只使用 mock 数据
class CustomDatafeed {
  async searchSymbols(search) {
    return [];  // 暂不实现搜索功能
  }
  async getHistoryKLineData(symbol, period, from, to) {
    // 忽略真实 symbol、period，直接 return mock 数据
    const data = await fetchMockBars();
    return data;
  }
  subscribe(symbol, period, callback) {
    // 如需模拟实时，可轮询 mock 接口并通过 callback 推送
    this._timer = setInterval(async () => {
      const data = await fetchMockBars();
      // 这里以全量刷新为例
      callback(data);
    }, 5000);
  }
  unsubscribe() {
    clearInterval(this._timer);
  }
}

export default function KlineTradingChartPro({ symbol }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const hasInitializedRef = useRef(false); // 防止 useEffect 重复执行

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new window.ResizeObserver(() => {
      window.dispatchEvent(new Event('resize'));
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }
    
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);

    // 样式注入，适配移动端
    const style = document.createElement('style');
    style.innerHTML = `
      .klinecharts-pro-period-bar {
        overflow-x: auto !important;
        scrollbar-width: none !important;
      }
      .klinecharts-pro-period-bar::-webkit-scrollbar {
        display: none !important;
      }
      /* 针对 tools 区域的修复 */
      .klinecharts-pro-period-bar > div:last-child {
        min-width: unset !important;
      }
    `;
    document.head.appendChild(style);

    // 创建 Pro 实例，使用自定义 datafeed
    const chart = new KLineChartPro({
      container: "k-line-chart",
      symbol: {
        exchange: 'rua-coin',
        market: 'spot',
        name: 'Mock Symbol',
        shortName: symbol,
        ticker: 'MOCK',
        // priceCurrency: 'USD',
        type: 'Stock',
      },
      period: { multiplier: 1, timespan: 'day', text: '1D' },
      datafeed: new CustomDatafeed(),
      subIndicators: ["VOL", "MA"],
    });

    chart.setStyles(klineStyleConfig)
    chart.setLocale("zh-EN");

    hasInitializedRef.current = true;
    // chartRef.current = chart;

    // 清理函数：组件卸载时销毁实例
    return () => {
      dispose("k-line-chart");
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div 
        id="k-line-chart" className='klinecharts-pro' 
        // data-theme="dark"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
