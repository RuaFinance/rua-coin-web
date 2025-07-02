/**
 * @example usage in klinecharts pro:
 * ```jsx
 * import React from 'react';
 * import { KLineChartPro } from '@klinecharts/pro';
 * import klineStyleConfig from '../config/KlineChartProConfig'
 * 
 * const chart = new KLineChartPro({ ... })
 * chart.setStyles(klineStyleConfig)
 * ```
 */
const klineStyleConfig = {
    "grid": {
        "show": true,
        "horizontal": {
            "show": true,
            "size": 1,
            "color": "#EDEDED", // dark theme use this grid color #282828
            "style": "dashed",
            "dashedValue": [
                2,
                2
            ]
        },
        "vertical": {
            "show": true,
            "size": 1,
            "color": "#EDEDED", // dark theme use this grid color #282828
            "style": "dashed",
            "dashedValue": [
                2,
                2
            ]
        }
    },
    "candle": {
        "type": "candle_solid",
        "bar": {
            "upColor": "#2DC08E",
            "downColor": "#F92855",
            "noChangeColor": "#888888",
            "upBorderColor": "#2DC08E",
            "downBorderColor": "#F92855",
            "noChangeBorderColor": "#888888",
            "upWickColor": "#2DC08E",
            "downWickColor": "#F92855",
            "noChangeWickColor": "#888888"
        },
        "area": {
            "lineSize": 2,
            "lineColor": "#1677FF",
            "smooth": false,
            "value": "close",
            "backgroundColor": [
                {
                    "offset": 0,
                    "color": "rgba(22, 119, 255, 0.01)"
                },
                {
                    "offset": 1,
                    "color": "rgba(22, 119, 255, 0.2)"
                }
            ],
            "point": {
                "show": true,
                "color": "#1677FF",
                "radius": 4,
                "rippleColor": "rgba(22, 119, 255, 0.3)",
                "rippleRadius": 8,
                "animation": true,
                "animationDuration": 1000
            }
        },
        "priceMark": {
            "show": true,
            "high": {
                "show": true,
                "color": "#76808F",
                "textOffset": 5,
                "textSize": 10,
                "textFamily": "Helvetica Neue",
                "textWeight": "normal"
            },
            "low": {
                "show": true,
                "color": "#76808F",
                "textOffset": 5,
                "textSize": 10,
                "textFamily": "Helvetica Neue",
                "textWeight": "normal"
            },
            "last": {
                "show": true,
                "upColor": "#2DC08E",
                "downColor": "#F92855",
                "noChangeColor": "#888888",
                "line": {
                    "show": true,
                    "style": "dashed",
                    "dashedValue": [
                        4,
                        4
                    ],
                    "size": 1
                },
                "text": {
                    "show": true,
                    "style": "fill",
                    "size": 12,
                    "paddingLeft": 4,
                    "paddingTop": 4,
                    "paddingRight": 4,
                    "paddingBottom": 4,
                    "borderColor": "transparent",
                    "borderStyle": "solid",
                    "borderSize": 0,
                    "borderDashedValue": [
                        2,
                        2
                    ],
                    "color": "#FFFFFF",
                    "family": "Helvetica Neue",
                    "weight": "normal",
                    "borderRadius": 2
                }
            }
        },
        "tooltip": {
            "offsetLeft": 4,
            "offsetTop": 6,
            "offsetRight": 4,
            "offsetBottom": 6,
            "showRule": "always",
            "showType": "standard",
            "custom": [
                {
                    "title": "time",
                    "value": "{time}"
                },
                {
                    "title": "open",
                    "value": "{open}"
                },
                {
                    "title": "high",
                    "value": "{high}"
                },
                {
                    "title": "low",
                    "value": "{low}"
                },
                {
                    "title": "close",
                    "value": "{close}"
                },
                {
                    "title": "volume",
                    "value": "{volume}"
                }
            ],
            "defaultValue": "n/a",
            "rect": {
                "position": "fixed",
                "paddingLeft": 4,
                "paddingRight": 4,
                "paddingTop": 4,
                "paddingBottom": 4,
                "offsetLeft": 4,
                "offsetTop": 4,
                "offsetRight": 4,
                "offsetBottom": 4,
                "borderRadius": 4,
                "borderSize": 1,
                "borderColor": "#F2F3F5",
                "color": "#FEFEFE"
            },
            "text": {
                "size": 12,
                "family": "Helvetica Neue",
                "weight": "normal",
                "color": "#76808F",
                "marginLeft": 8,
                "marginTop": 4,
                "marginRight": 8,
                "marginBottom": 4
            },
            "icons": [

            ]
        }
    },
    "indicator": {
        "ohlc": {
            "upColor": "rgba(45, 192, 142, .7)",
            "downColor": "rgba(249, 40, 85, .7)",
            "noChangeColor": "#888888"
        },
        "bars": [
            {
                "style": "fill",
                "borderStyle": "solid",
                "borderSize": 1,
                "borderDashedValue": [
                    2,
                    2
                ],
                "upColor": "rgba(45, 192, 142, .7)",
                "downColor": "rgba(249, 40, 85, .7)",
                "noChangeColor": "#888888"
            }
        ],
        "lines": [
            {
                "style": "solid",
                "smooth": false,
                "size": 1,
                "dashedValue": [
                    2,
                    2
                ],
                "color": "#FF9600"
            },
            {
                "style": "solid",
                "smooth": false,
                "size": 1,
                "dashedValue": [
                    2,
                    2
                ],
                "color": "#935EBD"
            },
            {
                "style": "solid",
                "smooth": false,
                "size": 1,
                "dashedValue": [
                    2,
                    2
                ],
                "color": "#1677FF"
            },
            {
                "style": "solid",
                "smooth": false,
                "size": 1,
                "dashedValue": [
                    2,
                    2
                ],
                "color": "#E11D74"
            },
            {
                "style": "solid",
                "smooth": false,
                "size": 1,
                "dashedValue": [
                    2,
                    2
                ],
                "color": "#01C5C4"
            }
        ],
        "circles": [
            {
                "style": "fill",
                "borderStyle": "solid",
                "borderSize": 1,
                "borderDashedValue": [
                    2,
                    2
                ],
                "upColor": "rgba(45, 192, 142, .7)",
                "downColor": "rgba(249, 40, 85, .7)",
                "noChangeColor": "#888888"
            }
        ],
        "lastValueMark": {
            "show": false,
            "text": {
                "show": false,
                "style": "fill",
                "color": "#FFFFFF",
                "size": 12,
                "family": "Helvetica Neue",
                "weight": "normal",
                "borderStyle": "solid",
                "borderColor": "transparent",
                "borderSize": 0,
                "borderDashedValue": [
                    2,
                    2
                ],
                "paddingLeft": 4,
                "paddingTop": 4,
                "paddingRight": 4,
                "paddingBottom": 4,
                "borderRadius": 2
            }
        },
        "tooltip": {
            "offsetLeft": 4,
            "offsetTop": 6,
            "offsetRight": 4,
            "offsetBottom": 6,
            "showRule": "always",
            "showType": "standard",
            "showName": true,
            "showParams": true,
            "defaultValue": "n/a",
            "text": {
                "size": 12,
                "family": "Helvetica Neue",
                "weight": "normal",
                "color": "#76808F",
                "marginLeft": 8,
                "marginTop": 4,
                "marginRight": 8,
                "marginBottom": 4
            },
            "icons": [
                {
                    "id": "visible",
                    "position": "middle",
                    "marginLeft": 8,
                    "marginTop": 7,
                    "marginRight": 0,
                    "marginBottom": 0,
                    "paddingLeft": 0,
                    "paddingTop": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "icon": "",
                    "fontFamily": "icomoon",
                    "size": 14,
                    "color": "#76808F",
                    "activeColor": "#76808F",
                    "backgroundColor": "transparent",
                    "activeBackgroundColor": "rgba(22, 119, 255, 0.15)"
                },
                {
                    "id": "invisible",
                    "position": "middle",
                    "marginLeft": 8,
                    "marginTop": 7,
                    "marginRight": 0,
                    "marginBottom": 0,
                    "paddingLeft": 0,
                    "paddingTop": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "icon": "",
                    "fontFamily": "icomoon",
                    "size": 14,
                    "color": "#76808F",
                    "activeColor": "#76808F",
                    "backgroundColor": "transparent",
                    "activeBackgroundColor": "rgba(22, 119, 255, 0.15)"
                },
                {
                    "id": "setting",
                    "position": "middle",
                    "marginLeft": 6,
                    "marginTop": 7,
                    "marginBottom": 0,
                    "marginRight": 0,
                    "paddingLeft": 0,
                    "paddingTop": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "icon": "",
                    "fontFamily": "icomoon",
                    "size": 14,
                    "color": "#76808F",
                    "activeColor": "#76808F",
                    "backgroundColor": "transparent",
                    "activeBackgroundColor": "rgba(22, 119, 255, 0.15)"
                },
                {
                    "id": "close",
                    "position": "middle",
                    "marginLeft": 6,
                    "marginTop": 7,
                    "marginRight": 0,
                    "marginBottom": 0,
                    "paddingLeft": 0,
                    "paddingTop": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "icon": "",
                    "fontFamily": "icomoon",
                    "size": 14,
                    "color": "#76808F",
                    "activeColor": "#76808F",
                    "backgroundColor": "transparent",
                    "activeBackgroundColor": "rgba(22, 119, 255, 0.15)"
                }
            ]
        }
    },
    "xAxis": {
        "show": true,
        "size": "auto",
        "axisLine": {
            "show": true,
            "color": "#DDDDDD",
            "size": 1
        },
        "tickText": {
            "show": true,
            "color": "#76808F",
            "size": 12,
            "family": "Helvetica Neue",
            "weight": "normal",
            "marginStart": 4,
            "marginEnd": 4
        },
        "tickLine": {
            "show": true,
            "size": 1,
            "length": 3,
            "color": "#DDDDDD"
        }
    },
    "yAxis": {
        "show": true,
        "size": "auto",
        "axisLine": {
            "show": true,
            "color": "#DDDDDD",
            "size": 1
        },
        "tickText": {
            "show": true,
            "color": "#76808F",
            "size": 12,
            "family": "Helvetica Neue",
            "weight": "normal",
            "marginStart": 4,
            "marginEnd": 4
        },
        "tickLine": {
            "show": true,
            "size": 1,
            "length": 3,
            "color": "#DDDDDD"
        },
        "type": "normal",
        "position": "right",
        "inside": false,
        "reverse": false
    },
    "separator": {
        "size": 1,
        "color": "#DDDDDD",
        "fill": true,
        "activeBackgroundColor": "rgba(22, 119, 255, 0.08)"
    },
    "crosshair": {
        "show": true,
        "horizontal": {
            "show": true,
            "line": {
                "show": true,
                "style": "dashed",
                "dashedValue": [
                    4,
                    2
                ],
                "size": 1,
                "color": "#76808F"
            },
            "text": {
                "show": true,
                "style": "fill",
                "color": "#FFFFFF",
                "size": 12,
                "family": "Helvetica Neue",
                "weight": "normal",
                "borderStyle": "solid",
                "borderDashedValue": [
                    2,
                    2
                ],
                "borderSize": 1,
                "borderColor": "#686D76",
                "borderRadius": 2,
                "paddingLeft": 4,
                "paddingRight": 4,
                "paddingTop": 4,
                "paddingBottom": 4,
                "backgroundColor": "#686D76"
            }
        },
        "vertical": {
            "show": true,
            "line": {
                "show": true,
                "style": "dashed",
                "dashedValue": [
                    4,
                    2
                ],
                "size": 1,
                "color": "#76808F"
            },
            "text": {
                "show": true,
                "style": "fill",
                "color": "#FFFFFF",
                "size": 12,
                "family": "Helvetica Neue",
                "weight": "normal",
                "borderStyle": "solid",
                "borderDashedValue": [
                    2,
                    2
                ],
                "borderSize": 1,
                "borderColor": "#686D76",
                "borderRadius": 2,
                "paddingLeft": 4,
                "paddingRight": 4,
                "paddingTop": 4,
                "paddingBottom": 4,
                "backgroundColor": "#686D76"
            }
        }
    },
    "overlay": {
        "point": {
            "color": "#1677FF",
            "borderColor": "rgba(22, 119, 255, 0.35)",
            "borderSize": 1,
            "radius": 5,
            "activeColor": "#1677FF",
            "activeBorderColor": "rgba(22, 119, 255, 0.35)",
            "activeBorderSize": 3,
            "activeRadius": 5
        },
        "line": {
            "style": "solid",
            "smooth": false,
            "color": "#1677FF",
            "size": 1,
            "dashedValue": [
                2,
                2
            ]
        },
        "rect": {
            "style": "fill",
            "color": "rgba(22, 119, 255, 0.25)",
            "borderColor": "#1677FF",
            "borderSize": 1,
            "borderRadius": 0,
            "borderStyle": "solid",
            "borderDashedValue": [
                2,
                2
            ]
        },
        "polygon": {
            "style": "fill",
            "color": "#1677FF",
            "borderColor": "#1677FF",
            "borderSize": 1,
            "borderStyle": "solid",
            "borderDashedValue": [
                2,
                2
            ]
        },
        "circle": {
            "style": "fill",
            "color": "rgba(22, 119, 255, 0.25)",
            "borderColor": "#1677FF",
            "borderSize": 1,
            "borderStyle": "solid",
            "borderDashedValue": [
                2,
                2
            ]
        },
        "arc": {
            "style": "solid",
            "color": "#1677FF",
            "size": 1,
            "dashedValue": [
                2,
                2
            ]
        },
        "text": {
            "style": "fill",
            "color": "#FFFFFF",
            "size": 12,
            "family": "Helvetica Neue",
            "weight": "normal",
            "borderStyle": "solid",
            "borderDashedValue": [
                2,
                2
            ],
            "borderSize": 1,
            "borderRadius": 2,
            "borderColor": "#1677FF",
            "paddingLeft": 4,
            "paddingRight": 4,
            "paddingTop": 4,
            "paddingBottom": 4,
            "backgroundColor": "#1677FF"
        },
        "rectText": {
            "style": "fill",
            "color": "#FFFFFF",
            "size": 12,
            "family": "Helvetica Neue",
            "weight": "normal",
            "borderStyle": "solid",
            "borderDashedValue": [
                2,
                2
            ],
            "borderSize": 1,
            "borderRadius": 2,
            "borderColor": "#1677FF",
            "paddingLeft": 4,
            "paddingRight": 4,
            "paddingTop": 4,
            "paddingBottom": 4,
            "backgroundColor": "#1677FF"
        }
    }
}

export default klineStyleConfig;
