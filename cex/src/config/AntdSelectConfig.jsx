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

export const SelectLightConfig = {
    // 主色调，选中项的 checkmark 颜色等
    // 在 select 是字体颜色
    colorPrimary: '#000000',

    // 下拉框选项 hover 背景色
    // optionActiveBg: '#2a2a2a',

    // 选中项 背景色
    // optionSelectedBg: '#2a2a2a',

    // 选中项 文字颜色
    optionSelectedColor: '#000000',

    // 下拉框背景色
    colorBgContainer: '#ffffff',

    // 边框色
    colorBorder: '#ffffff',

    // 文本颜色
    colorText: '#000000',

    // 圆角
    borderRadius: 4,

    // 激活态边框色	
    activeBorderColor: '#424242',

    // 悬浮态边框色	
    hoverBorderColor: '#666666',
};
