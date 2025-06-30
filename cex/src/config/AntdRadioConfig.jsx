/**
 * @example usage in antd:
 * ```jsx
 * import React from 'react';
 * import { ConfigProvider, Radio } from 'antd';
 * import { RadioConfigTheme } from '../config/AntdRadioConfig'
 * 
 * <ConfigProvider
 *     theme={{
 *     components: {
 *     Radio: RadioConfig,
 * >
 *     <Radio />
 * </ConfigProvider>
 * ```
 */
export const RadioConfigTheme = {
    token: {
      colorText: '#ffffff',
      controlOutline: '#ffffff',
      controlOutlineWidth: 2,
    },
    components: {
      Radio: {
        // 单选框按钮文本颜色	
        buttonColor: '#ffffff',

        // 未选中时的边框颜色
        colorBorder: '#424242',

        // 圆角（可选）
        borderRadius: 4,
      },
    },
}