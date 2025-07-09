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

import { createBrowserRouter } from 'react-router-dom';

import { SUPPORTED_LOCALES } from '../i18n/config/languageConfig';
import Layout from '../layouts/Layout';
import UserLayout from '../layouts/UserLayout';
import DeviceTestPage from '../pages/DeviceTestPage';
import FooterTestPage from '../pages/FooterTestPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage';
import TradingPage from '../pages/TradingPage';
import UserDashboard from '../pages/UserDashboard';

import { BASE_URL } from './config';

/**
 * 🌍 Advanced Language-Aware Router
 * 
 * Features:
 * - BCP 47 language prefix support (/:locale/path)
 * - Automatic language detection and redirection
 * - SEO-optimized URL structure
 * - Fallback routes for non-language URLs
 * - Dynamic locale parameter validation
 * 
 * Supported URL patterns:
 * - /en/trading/BTCUSDT
 * - /zh-CN/user/dashboard
 * - /zh-TC/register
 * - /ja/login
 * - /ko/user/assets/spot
 * - /en-IN/trading/ETHUSDT
 */

/**
 * Generate locale regex pattern for React Router
 * Supports BCP 47 language codes like: en, zh-CN, zh-TC, ja, ko, en-IN
 */
const createLocalePattern = () => {
  // Escape special regex characters in locale codes
  const escapedLocales = SUPPORTED_LOCALES.map(locale => 
    locale.replace(/[-]/g, '\\-')
  );
  return escapedLocales.join('|');
};

const LOCALE_PATTERN = createLocalePattern();

/**
 * Define routes structure that will be used for both localized and non-localized routes
 */
const createRouteStructure = () => ({
  path: '/',
  element: <Layout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'trading/:symbol',
      element: <TradingPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'footer-test',
      element: <FooterTestPage />,
    },
    {
      path: 'device-test',
      element: <DeviceTestPage />,
    },
    {
      path: 'user',
      element: <UserLayout />,
      children: [
        {
          path: 'dashboard',
          element: <UserDashboard />,
        },
        {
          path: 'assets/spot',
          element: <div className="text-white p-8">现货账户页面 - 开发中</div>,
        },
        {
          path: 'assets/futures',
          element: <div className="text-white p-8">合约账户页面 - 开发中</div>,
        },
        {
          path: 'assets/earn',
          element: <div className="text-white p-8">理财账户页面 - 开发中</div>,
        },
        {
          path: 'assets/history',
          element: <div className="text-white p-8">资金流水页面 - 开发中</div>,
        },
        {
          path: 'orders/spot',
          element: <div className="text-white p-8">现货订单页面 - 开发中</div>,
        },
        {
          path: 'orders/futures',
          element: <div className="text-white p-8">合约订单页面 - 开发中</div>,
        },
        {
          path: 'orders/history',
          element: <div className="text-white p-8">订单历史页面 - 开发中</div>,
        },
        {
          path: 'account',
          element: <div className="text-white p-8">账户信息页面 - 开发中</div>,
        },
        {
          path: 'security',
          element: <div className="text-white p-8">安全设置页面 - 开发中</div>,
        },
        {
          path: 'api',
          element: <div className="text-white p-8">API管理页面 - 开发中</div>,
        },
        {
          path: 'rewards',
          element: <div className="text-white p-8">奖励页面 - 开发中</div>,
        },
        {
          path: 'settings/preferences',
          element: <div className="text-white p-8">偏好设置页面 - 开发中</div>,
        },
        {
          path: 'settings/notifications',
          element: <div className="text-white p-8">通知设置页面 - 开发中</div>,
        },
        {
          path: 'help',
          element: <div className="text-white p-8">帮助中心页面 - 开发中</div>,
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
});

/**
 * Create localized route structure
 * Prefixes all routes with /:locale parameter
 */
const createLocalizedRoutes = () => {
  const baseRoutes = createRouteStructure();
  
  return {
    path: `/:locale(${LOCALE_PATTERN})`,
    element: <Layout />,
    children: baseRoutes.children,
  };
};

/**
 * Create fallback routes for non-localized URLs
 * These will be redirected to localized versions by the LanguageRouter component
 */
const createFallbackRoutes = () => {
  return createRouteStructure();
};

/**
 * Advanced Language Router Configuration
 * 
 * Route Structure:
 * 1. Localized routes: /:locale/path (primary)
 * 2. Fallback routes: /path (for redirects)
 * 3. Catch-all 404 route
 * 
 * Examples:
 * ✅ /en/trading/BTCUSDT
 * ✅ /zh-CN/user/dashboard  
 * ✅ /zh-TC/register
 * ✅ /ja/login
 * ✅ /ko/user/assets/spot
 * ✅ /en-IN/trading/ETHUSDT
 * 
 * ⚠️  /trading/BTCUSDT (redirects to /{detectedLanguage}/trading/BTCUSDT)
 * ⚠️  /user/dashboard (redirects to /{detectedLanguage}/user/dashboard)
 */
const createLanguageRouter = () => {
  return createBrowserRouter(
    [
      // Primary localized routes with language prefix
      createLocalizedRoutes(),
      
      // Fallback routes for non-localized URLs (will be redirected)
      createFallbackRoutes(),
    ],
    {
      basename: BASE_URL,
    }
  );
};

// Create the router lazily to avoid initialization issues
let languageRouter = null;

const getLanguageRouter = () => {
  if (!languageRouter) {
    languageRouter = createLanguageRouter();
  }
  return languageRouter;
};

export default getLanguageRouter;

/**
 * Route utilities for generating localized URLs
 */

/**
 * Generate localized URL path
 * @param {string} path - Base path (e.g., '/trading/BTCUSDT')
 * @param {string} locale - Language locale (e.g., 'en', 'zh-CN')
 * @returns {string} Localized path (e.g., '/en/trading/BTCUSDT')
 */
export const generateLocalizedPath = (path, locale) => {
  // Handle root path specially
  if (!path || path === '/' || path === '') {
    return `/${locale}`;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Remove locale prefix if already present
  const pathWithoutLocale = removeLocaleFromPath(cleanPath);
  
  // Handle empty path after locale removal (means it was just a locale)
  if (!pathWithoutLocale || pathWithoutLocale === '') {
    return `/${locale}`;
  }
  
  return `/${locale}/${pathWithoutLocale}`;
};

/**
 * Remove locale from path
 * @param {string} path - Path with potential locale (e.g., 'en/trading/BTCUSDT')
 * @returns {string} Path without locale (e.g., 'trading/BTCUSDT')
 */
export const removeLocaleFromPath = (path) => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0])) {
    return segments.slice(1).join('/');
  }
  return path;
};

/**
 * Extract locale from path
 * @param {string} path - Full path (e.g., '/en/trading/BTCUSDT')
 * @returns {string|null} Extracted locale or null
 */
export const extractLocaleFromPath = (path) => {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const result = SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
  
  return result;
};

/**
 * Validate if path has valid locale prefix
 * @param {string} path - Path to validate
 * @returns {boolean} True if path has valid locale prefix
 */
export const hasValidLocalePrefix = (path) => {
  const result = extractLocaleFromPath(path) !== null;
  
  return result;
};

/**
 * Get all supported localized paths for a given base path
 * @param {string} basePath - Base path without locale
 * @returns {string[]} Array of localized paths
 */
export const getAllLocalizedPaths = (basePath) => {
  return SUPPORTED_LOCALES.map(locale => generateLocalizedPath(basePath, locale));
};

/**
 * Route configuration metadata
 */
export const ROUTE_CONFIG = {
  supportedLocales: SUPPORTED_LOCALES,
  localePattern: LOCALE_PATTERN,
  hasLanguagePrefix: true,
  baseUrl: BASE_URL,
  fallbackEnabled: true
};

export {
  createLocalePattern,
  createLocalizedRoutes,
  createFallbackRoutes,
  LOCALE_PATTERN,
  SUPPORTED_LOCALES
}; 