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