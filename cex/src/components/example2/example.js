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

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 获取卡片和圆圈元素（避免每次查询）
  const card = document.querySelector('.card');
  const circles = document.querySelector('.circles');
  
  // 节流函数，减少频繁调用
  let isAnimating = false;
  
  // 鼠标移动事件监听
  window.addEventListener('mousemove', (e) => {
    if (isAnimating) return;
    isAnimating = true;
    
    requestAnimationFrame(() => {
      // 计算鼠标在窗口中的百分比位置
      const winPercent = { 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      };
      
      // 计算距离中心的距离（用于光照效果）
      const distFromCenter = 1 - Math.abs((e.clientX - window.innerWidth/2) / window.innerWidth * 2);
      
      if (card) {
        // 左右倾斜效果：从-10度到+10度
        const rotationY = -7 + 14 * winPercent.x;
        // 上下倾斜效果：从-7度到+7度
        const rotationX = -7 + 14 * winPercent.y;
        card.style.transform = `translate(-50%, -50%) rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        
        // 优化光照效果，减少频闪
        const lightOpacity = 0.15 + (distFromCenter * 0.15);
        card.style.setProperty('--light-opacity', lightOpacity);
      }
      
      if (circles) {
        // 背景圆圈的移动效果
        const moveX = 50 - 100 * winPercent.x;
        const moveY = 10 - 20 * winPercent.y;
        circles.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      }
      
      isAnimating = false;
    });
  });
  
  // 鼠标离开窗口时重置效果
  window.addEventListener('mouseleave', () => {
    if (card) {
      card.style.transform = 'translate(-50%, -50%) rotateY(0deg) rotateX(0deg)';
      card.style.setProperty('--light-opacity', 0.2);
    }
    
    if (circles) {
      circles.style.transform = 'translate(-50%, -50%)';
    }
  });
}); 