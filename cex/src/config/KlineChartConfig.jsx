/**
 * @example usage in klinecharts:
 * ```jsx
 * import React from 'react';
 * import { registerLocale } from 'klinecharts'
 * import { twLocale } from '../config/KlineChartConfig'
 * 
 * registerLocale('zh-TW', twLocale);
 * ```
 */
export const twLocale = { // named export
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
};

/**
 * @example usage in klinecharts:
 * ```jsx
 * import React from 'react';
 * import { init, dispose, registerLocale } from 'klinecharts'
 * import { klineStyleConfig } from '../config/KlineChartConfig'
 * 
 * const chart = init('k-line-chart', klineStyleConfig)
 * ```
 */
export const klineStyleConfig = {
    grid: {
      show: true,
      horizontal: {
        show: true,
        size: 1,
        color: '#EDEDED',
        style: 'dashed',
        dashedValue: [2, 2]
      },
      vertical: {
        show: true,
        size: 1,
        color: '#EDEDED',
        style: 'dashed',
        dashedValue: [2, 2]
      },
    },
    candle: {
      // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
      type: 'candle_solid',
      bar: {
        // 'current_open' | 'previous_close'
        compareRule: 'current_open',
        upColor: '#2DC08E',
        downColor: '#F92855',
        noChangeColor: '#888888',
        upBorderColor: '#2DC08E',
        downBorderColor: '#F92855',
        noChangeBorderColor: '#888888',
        upWickColor: '#2DC08E',
        downWickColor: '#F92855',
        noChangeWickColor: '#888888'
      },
      area: {
        lineSize: 2,
        lineColor: '#2196F3',
        smooth: true,
        value: 'close',
        backgroundColor: [{
          offset: 0,
          color: 'rgba(33, 150, 243, 0.01)'
        }, {
          offset: 1,
          color: 'rgba(33, 150, 243, 0.2)'
        }],
      },
      priceMark: {
        show: true,
        high: {
          show: true,
          color: '#000000', // 最高点 文字颜色
          textMargin: 5,
          textSize: 10,
          textFamily: 'Helvetica Neue',
          textWeight: 'normal'
        },
        low: {
          show: true,
          color: '#000000', // 最低点 文字颜色
          textMargin: 5,
          textSize: 10,
          textFamily: 'Helvetica Neue',
          textWeight: 'normal',
        },
        last: {
          show: true,
          // 'current_open' | 'previous_close'
          compareRule: 'current_open',
          upColor: '#2DC08E',
          downColor: '#F92855',
          noChangeColor: '#888888',
          line: {
            show: true,
            // 'solid' | 'dashed'
            style: 'dashed',
            dashedValue: [4, 4],
            size: 1
          },
          text: {
            show: true,
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            size: 12,
            paddingLeft: 4,
            paddingTop: 4,
            paddingRight: 4,
            paddingBottom: 4,
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 0,
            borderColor: 'transparent',
            borderDashedValue: [2, 2],
            color: '#FFFFFF',
            family: 'Helvetica Neue',
            weight: 'normal',
            borderRadius: 2
          }
        },
      },
      tooltip: {
        offsetLeft: 4,
        offsetTop: 6,
        offsetRight: 4,
        offsetBottom: 6,
        // 'always' | 'follow_cross' | 'none'
        showRule: 'always',
        // 'standard' | 'rect'
        showType: 'standard',
        rect: {
          // 'fixed' | 'pointer'
          position: 'pointer',
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          offsetLeft: 4,
          offsetTop: 4,
          offsetRight: 4,
          offsetBottom: 4,
          borderRadius: 4,
          borderSize: 1,
          borderColor: '#f2f3f5',
          color: '#FEFEFE'
        },
        title: {
          show: true,
          size: 14,
          family: 'Helvetica Neue',
          weight: 'normal',
          // color: Color.GREY,
          marginLeft: 8,
          marginTop: 4,
          marginRight: 8,
          marginBottom: 4,
          template: '{ticker} · {period}'
        },
        legend: {
          size: 12,
          family: 'Helvetica Neue',
          weight: 'normal',
          color: '#76808F',
          marginLeft: 8,
          marginTop: 4,
          marginRight: 8,
          marginBottom: 4,
          defaultValue: 'n/a',
          template: [
            { title: 'time', value: '{time}' },
            { title: 'open', value: '{open}' },
            { title: 'high', value: '{high}' },
            { title: 'low', value: '{low}' },
            { title: 'close', value: '{close}' },
            { title: 'volume', value: '{volume}' }
          ]
        },
        // e.g.
        features: [{
          id: 'icon_id',
          position: 'left', // 'left' | 'middle' | 'right'
          marginLeft: 8,
          marginTop: 6,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 1,
          paddingTop: 1,
          paddingRight: 1,
          paddingBottom: 1,
          size: 12,
          color: '#76808F',
          activeColor: '#76808F',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
          type: 'path', // 'path', 'icon_font'
          content: {
            style: 'stroke', // 'stroke', 'fill'
            path: 'M6.81029,6.02908L11.7878,1.02746C12.0193,0.79483,12.0193,0.445881,11.7878,0.213247C11.5563,-0.019386,11.209,-0.019386,10.9775,0.213247L6,5.21486L1.02251,0.174475C0.790997,-0.0581583,0.44373,-0.0581583,0.212219,0.174475C-0.0192925,0.407108,-0.0192925,0.756058,0.212219,0.988691L5.18971,6.02908L0.173633,11.0307C-0.0578778,11.2633,-0.0578778,11.6123,0.173633,11.8449C0.289389,11.9612,0.44373,12,0.598071,12C0.752411,12,0.906752,11.9612,1.02251,11.8449L6,6.8433L10.9775,11.8449C11.0932,11.9612,11.2476,12,11.4019,12C11.5563,12,11.7106,11.9612,11.8264,11.8449C12.0579,11.6123,12.0579,11.2633,11.8264,11.0307L6.81029,6.02908Z',
            lineWidth: 1,
          }
        }]
      }
    },
    // 技术指标
    technicalIndicator: {
      margin: {
        top: 0.2,
        bottom: 0.1
      },
      bar: {
        upColor: '#26A69A',
        downColor: '#EF5350',
        noChangeColor: '#888888'
      },
      line: {
        size: 1,
        colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
      },
      circle: {
        upColor: '#26A69A',
        downColor: '#EF5350',
        noChangeColor: '#888888'
      },
      // 最新值标记
      lastValueMark: {
        show: false,
        text: {
          show: false,
          color: '#ffffff',
          size: 12,
          family: 'Helvetica Neue',
          weight: 'normal',
          paddingLeft: 3,
          paddingTop: 2,
          paddingRight: 3,
          paddingBottom: 2,
          borderRadius: 2
        }
      },
      // 提示
      tooltip: {
        // 'always' | 'follow_cross' | 'none'
        showRule: 'always',
        // 'standard' | 'rect'
        showType: 'standard',
        showName: true,
        showParams: true,
        defaultValue: 'n/a',
        text: {
          size: 12,
          family: 'Helvetica Neue',
          weight: 'normal',
          color: '#D9D9D9',
          marginTop: 6,
          marginRight: 8,
          marginBottom: 0,
          marginLeft: 8
        }
      }
    },
    crosshair: {
      show: true,
      // 十字光标水平线及文字
      horizontal: {
        show: true,
        line: {
          show: true,
          // style: "solid",
          // size: 1,
          // color: "#333",
        },
     
      },
      vertical: {
        show: true,
        line: {
          show: true,
          // style: 'solid',
          // size: 1,
          // color: '#333'
        },
      },
    },
    locale: 'zh-TW',
}