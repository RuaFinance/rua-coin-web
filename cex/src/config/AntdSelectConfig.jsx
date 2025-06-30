/**
 * @example usage in antd:
 * ```jsx
 * import React from 'react';
 * import { ConfigProvider, Select } from 'antd';
 * import { SelectConfig } from '../config/AntdSelectConfig'
 * 
 * <ConfigProvider
 *     theme={{
 *     components: {
 *     Select: SelectConfig,
 * >
 *     <Select />
 * </ConfigProvider>
 * ```
 */
export const SelectConfig = {
    // 主色调，选中项的 checkmark 颜色等
    // 在 select 是字体颜色
    colorPrimary: '#000000',

    // 下拉框选项 hover 背景色
    optionActiveBg: '#2a2a2a',

    // 选中项 背景色
    optionSelectedBg: '#2a2a2a',

    // 选中项 文字颜色
    optionSelectedColor: '#ffffff',

    // 下拉框背景色
    colorBgContainer: '#000000',

    // 边框色
    colorBorder: '#424242',

    // 文本颜色
    colorText: '#ffffff',

    // 圆角
    borderRadius: 4,

    // 激活态边框色	
    activeBorderColor: '#424242',

    // 悬浮态边框色	
    hoverBorderColor: '#ffffff',
};
