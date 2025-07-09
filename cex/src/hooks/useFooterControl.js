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
 * useFooterControl - Footer控制Hook集合
 * 
 * 提供多种Footer控制方式：
 * - useFooterControl: 通用控制Hook
 * - useHideFooter: 强制隐藏Footer
 * - useShowFooter: 强制显示Footer
 * 
 * 支持页面级的手动控制，覆盖自动显示逻辑
 */

import { useEffect } from 'react';

import { useFooter } from '../contexts/FooterContext';

/**
 * 自定义Hook，用于控制footer的显示和隐藏
 * @param {boolean} show - 是否显示footer
 * @param {boolean} override - 是否覆盖默认的路径检查逻辑
 */
export const useFooterControl = (show = true, override = false) => {
  const { setShowFooter } = useFooter();

  useEffect(() => {
    if (override) {
      setShowFooter(show);
    }
  }, [show, override, setShowFooter]);

  return { setShowFooter };
};

/**
 * 自定义Hook，用于在特定页面强制隐藏footer
 */
export const useHideFooter = () => {
  const { setShowFooter } = useFooter();

  useEffect(() => {
    setShowFooter(false);
    
    // 组件卸载时恢复默认行为
    return () => {
      setShowFooter(true);
    };
  }, [setShowFooter]);
};

/**
 * 自定义Hook，用于在特定页面强制显示footer
 */
export const useShowFooter = () => {
  const { setShowFooter } = useFooter();

  useEffect(() => {
    setShowFooter(true);
  }, [setShowFooter]);
}; 