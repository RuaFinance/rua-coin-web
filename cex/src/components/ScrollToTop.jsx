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

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when the route changes.
 * This component addresses the common SPA issue where scroll position
 * is preserved between route navigations.
 * 
 * Features:
 * - Smooth scroll to top on route change
 * - Performance optimized with minimal re-renders
 * - Supports both instant and smooth scroll options
 * - Ignores hash-only route changes (for anchor links)
 * 
 * @component
 * @example
 * // In Layout component
 * <div>
 *   <ScrollToTop />
 *   <Header />
 *   <main>
 *     <Outlet />
 *   </main>
 * </div>
 */
const ScrollToTop = ({ 
  behavior = 'smooth', // 'smooth' | 'instant' | 'auto'
  top = 0,
  left = 0,
  excludeHashChanges = true 
}) => {
  const location = useLocation();

  useEffect(() => {
    // 如果设置了排除hash变化，并且只是hash改变，则不滚动
    if (excludeHashChanges && location.hash) {
      // 检查是否只是hash变化（路径相同）
      const currentPathWithoutHash = location.pathname + location.search;
      const prevPath = sessionStorage.getItem('prevScrollPath');
      
      if (prevPath === currentPathWithoutHash) {
        return; // 只是hash变化，不滚动
      }
    }

    // 使用 requestAnimationFrame 确保DOM完全渲染后再滚动
    const scrollToTop = () => {
      try {
        // 优先使用现代浏览器的 scrollTo API
        if ('scrollTo' in window) {
          window.scrollTo({
            top,
            left,
            behavior
          });
        } else {
          // 兼容旧浏览器
          window.scrollTo(left, top);
        }
      } catch (error) {
        // 兜底方案
        console.warn('ScrollToTop: Failed to scroll, using fallback', error);
        document.documentElement.scrollTop = top;
        document.body.scrollTop = top;
      }
    };

    // 小延迟确保页面内容已加载
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 0);

    // 保存当前路径以供下次比较
    sessionStorage.setItem('prevScrollPath', location.pathname + location.search);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, behavior, top, left, excludeHashChanges]);

  // 这个组件不渲染任何内容
  return null;
};

export default ScrollToTop; 