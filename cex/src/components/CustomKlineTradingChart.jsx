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

import { init, dispose, registerLocale } from 'klinecharts'
import React, { useEffect, useRef } from 'react'

import { fetchMockBars } from '../api/market'

registerLocale('zh-TW', {
  time: '時間：',
  open: '開：',
  high: '高：',
  low: '低：',
  close: '收：',
  volume: '量：',
  second: '秒',
  minute: '分鐘',
  hour: '小時',
  day: '天',
  week: '週',
  month: '月',
  year: '年'
})

// 可参考: https://juejin.cn/post/7155418341937512456
// 样式配置: https://klinecharts.com/guide/styles
export default function CustomKlineTradingChart() {
  const chartInstance = useRef(null)

  useEffect(() => {
    const chart = init('k-line-chart', styles)
    chartInstance.current = chart
    // chartInstance.setSymbol({ ticker: 'TestSymbol' })
    // chart.setStyles(styles)

    chart.createIndicator('MA', false, { id: 'candle_pane' })
    chart.createIndicator('VOL')
    chart.createIndicator('RSI')

    // chart.setSymbol({ ticker: 'TestSymbol' })

    // 加载 mock 数据
    fetchMockBars().then((data) => {
      chart.applyNewData(data)
    })

    return () => {
      dispose('k-line-chart')
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div id="k-line-chart" className="card-inner" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
