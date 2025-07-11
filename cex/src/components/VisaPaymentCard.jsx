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

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { formatUrl } from '../router/config';

const VisaPaymentCard = ({ 
  cardNumber = "4000 1234 5678 9010",
  cardHolderName = "PHILIP GOODWIN",
  cvv = "123",
  isFlipped = false,
  onCardClick,
  className = "",
  style = {}
}) => {
  const cardRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  // 移除 lightOpacity 状态，使用固定值
  const lightOpacity = 0.2;

  // 节流函数
  const throttle = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        func.apply(null, args);
        timeoutId = null;
      }, delay);
    };
  }, []);

  // 优化的鼠标移动处理函数 - 移除光效变化
  const handleMouseMove = useCallback((e) => {
    if (Math.abs(e.clientX - lastMouseX.current) < 2 && 
        Math.abs(e.clientY - lastMouseY.current) < 2) {
      return;
    }
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const winPercent = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
      const rotationY = -20 + 40 * winPercent.x;
      const rotationX = -20 + 40 * winPercent.y;
      // 只做 rotate，不做 translate，移除光效变化
      card.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
      // 移除动态光效计算
    });
  }, []);

  const throttledMouseMove = useCallback(
    throttle(handleMouseMove, 16),
    [handleMouseMove]
  );

  const handleMouseLeave = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
    // 移除光效重置
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [throttledMouseMove, handleMouseLeave]);

  const formatCardNumber = useCallback((number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  }, []);

  return (
    <div className={`visa-payment-card-container ${className}`} style={{...style, background: 'none', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="visa-card-group">
        <div 
          className={`visa-card ${isFlipped ? 'flipped' : ''}`}
          ref={cardRef}
          onClick={onCardClick}
          style={{ '--light-opacity': lightOpacity }}
        >
          {/* 卡片正面 */}
          <div className="visa-card-front">
            {/* Visa Logo */}
            <div className="visa-logo">
              <img 
                src={formatUrl("/asserts/Visa-Logo-PNG-Image.png")} 
                alt="Visa"
                loading="lazy"
              />
            </div>
            {/* 芯片 */}
            <div className="visa-chip">
              <svg width="76.5" height="58" viewBox="0 0 76.5 58">
                <defs>
                  <linearGradient id="visaChipGradient" x1="0%" y1="0%" x2="100%" y2="85%">
                    <stop offset="0%" stopColor="#f5eacc" />
                    <stop offset="80%" stopColor="#e0c677" />
                    <stop offset="110%" stopColor="#ebd8a0" />
                  </linearGradient>
                </defs>
                <g transform="translate(38.25, 29) rotate(90) translate(-29, -38.25)">
                  <rect fill="url(#visaChipGradient)" width="58" height="76.5" rx="9" ry="9" />
                  <path 
                    fill="none" 
                    opacity="0.8" 
                    stroke="#c9b678" 
                    d="M58,54.05 M0,25.72c2.11,0.21,3.75,0.47,4.03,0.74c2.92,3.64,5.83,7.28,8.67,10.98c0.77,1,1.52,1.72,2.89,1.47c0.95-0.18,1.28,0.3,1.27,1.25c-0.04,4.03-0.01,8.03-0.02,12.07c8.44,0,16.73,0,25.08,0c0-8.43,0-25.32,0-25.32l-26.77,0c0,0-1.95,0-1.95-1.96c-0.4-1.85-0.4-14.9-0.34-24.95 M45.96,0c0,8.65,0.01,18.65-0.01,24.19c-0.01,2.9,0.27,2.55-2.38,2.84c0,3.91,0,7.82,0,12.17c4.69-3.07,7.28-8.53,11.07-12.63C55,26.06,56.3,25.72,58,25.5 M58,54.05c-0.55,0-0.89,0.01-0.89,0.01c-2.46,0.26-9.33-10.83-12.02-13.2c-0.41-0.36-1.57,0.2-1.57,0.2s-0.02,7.37-0.02,11.13c2.56,0.32,2.56,0.32,2.56,2.77c0,4.4,0,12.9,0,21.04 M13.1,76c0.01-8.57,0.04-17.77,0.07-22.53c-0.01-0.82,0.36-1.2,1.17-1.17c0.28,0.01,1.03-0.06,1.03-0.06l0.05-11.81c0,0-1.73,0.15-2.12,0.72c-0.39,0.57-6.16,7.63-9.18,11.5C3.9,52.85,2.19,53.11,0,53.35"
                  />
                </g>
              </svg>
            </div>

            {/* 卡片封面内容 */}

            {/* 卡号 */}
            <div className="visa-number">
              {formatCardNumber(cardNumber)}
            </div>
            {/* 持卡人姓名 */}
            <div className="visa-name">
              {cardHolderName}
            </div>
            {/* 发卡日期​​ */}
            <div className="visa-from">
              <span>05/25</span>
            </div>
            {/* 有效期至 */}
            <div className="visa-to">
              <span>05/30</span>
            </div>
            {/* 环形背景装饰 */}
            <div className="visa-ring"></div>
          </div>
          {/* 卡片背面 */}
          <div className="visa-card-back">
            {/* 磁条 */}
            <div className="visa-magnetic-stripe"></div>
            {/* 签名条 */}
            <div className="visa-signature-panel">
              <div className="visa-signature-line"></div>
              <div className="visa-cvv">
                {cvv}
              </div>
            </div>
            {/* Visa Logo 背面 */}
            <div className="visa-logo-back">
              <img 
                src={formatUrl("/asserts/Visa-Logo-PNG-Image.png")} 
                alt="Visa"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaPaymentCard;
