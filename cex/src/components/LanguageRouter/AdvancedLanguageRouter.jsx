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

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  ADVANCED_LANGUAGE_CONFIG,
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  getFallbackLanguage,
  SEO_CONFIG
} from '../../i18n/config/languageConfig';
import languageDetectionService, {
  quickDetectLanguage,
  DETECTION_SOURCES
} from '../../i18n/services/languageDetectionService';

// Import existing components
import Layout from '../../layouts/Layout';
import UserLayout from '../../layouts/UserLayout';
import DeviceTestPage from '../../pages/DeviceTestPage';
import FooterTestPage from '../../pages/FooterTestPage';
import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import NotFoundPage from '../../pages/NotFoundPage';
import RegisterPage from '../../pages/RegisterPage';
import TradingPage from '../../pages/TradingPage';
import UserDashboard from '../../pages/UserDashboard';
import { BASE_URL } from '../../router/config';
import {
  generateLocalizedPath,
  extractLocaleFromPath,
  hasValidLocalePrefix,
  removeLocaleFromPath
} from '../../router/languageRouter';

/**
 * 🌍 Advanced Language Router Component
 * 
 * This component provides sophisticated language routing following Binance's approach:
 * 
 * Features:
 * - BCP 47 language code support (en, zh-CN, zh-TC, ja, ko, en-IN)
 * - Automatic language detection and redirection
 * - SEO optimization with proper meta tags and hreflang
 * - URL state synchronization with language preferences
 * - Graceful fallback for unsupported languages
 * - Performance-optimized with minimal re-renders
 * - Analytics tracking for language switching
 * 
 * URL Patterns Supported:
 * ✅ /en/trading/BTCUSDT
 * ✅ /zh-CN/user/dashboard
 * ✅ /zh-TC/register
 * ✅ /ja/login
 * ✅ /ko/user/assets/spot
 * ✅ /en-IN/trading/ETHUSDT
 * 
 * Automatic Redirects:
 * ⚠️  /trading/BTCUSDT → /{detectedLanguage}/trading/BTCUSDT
 * ⚠️  /user/dashboard → /{detectedLanguage}/user/dashboard
 * 
 * @component
 * @example
 * <Router>
 *   <AdvancedLanguageRouter>
 *     <Routes>
 *       <Route path="/:locale/trading/:symbol" element={<TradingPage />} />
 *       <Route path="/:locale/user/dashboard" element={<UserDashboard />} />
 *     </Routes>
 *   </AdvancedLanguageRouter>
 * </Router>
 */

/**
 * Language-aware route wrapper component
 */
const LanguageAwareRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { i18n } = useTranslation();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(null);

  // Memoize current path analysis
  const pathAnalysis = useMemo(() => {
    const pathname = location.pathname;
    const extractedLocale = extractLocaleFromPath(pathname);
    const hasValidPrefix = hasValidLocalePrefix(pathname);
    const pathWithoutLocale = removeLocaleFromPath(pathname);

    return {
      pathname,
      extractedLocale,
      hasValidPrefix,
      pathWithoutLocale,
      paramLocale: params.locale
    };
  }, [location.pathname, params.locale]);

  /**
   * Handle language detection and redirection logic
   * Optimized to reduce unnecessary re-executions
   */
  const handleLanguageRouting = useCallback(async () => {
    if (isRedirecting) {
      return;
    }

    const { pathname, extractedLocale, hasValidPrefix, pathWithoutLocale } = pathAnalysis;

    try {
      // Case 1: URL has valid locale prefix - 只更新语言，不重定向
      if (hasValidPrefix && extractedLocale) {
        // 只在语言真正不同时才更新
        if (i18n.language !== extractedLocale) {
          await i18n.changeLanguage(extractedLocale);
          await languageDetectionService.saveLanguagePreference(
            extractedLocale, 
            DETECTION_SOURCES.URL
          );
        }
        
        // 确保状态同步
        if (currentLocale !== extractedLocale) {
          setCurrentLocale(extractedLocale);
        }
        
        return;
      }

      // Case 2: URL has no locale prefix - 只对根路径和无语言前缀的路径进行重定向
      if (pathname === '/' || (!hasValidPrefix && pathWithoutLocale && pathname !== '/')) {
        setIsRedirecting(true);
        
        const detectionResult = await languageDetectionService.detectLanguage(pathname);
        const detectedLanguage = detectionResult.language;
        
        // Generate new localized path
        const newPath = generateLocalizedPath(pathWithoutLocale || '', detectedLanguage);
        
        // 避免循环重定向 - 更严格的检查
        if (newPath === pathname || newPath === `${pathname}/` || `${newPath}/` === pathname) {
          setIsRedirecting(false);
          return;
        }
        
        // 额外检查：如果新路径只是在原路径基础上添加了语言前缀，确保是有效的
        const expectedPath = pathname === '/' ? `/${detectedLanguage}` : `/${detectedLanguage}${pathname}`;
        if (newPath !== expectedPath && expectedPath !== pathname) {
          // Update i18n before redirect
          if (i18n.language !== detectedLanguage) {
            await i18n.changeLanguage(detectedLanguage);
          }

          // Save preference
          await languageDetectionService.saveLanguagePreference(
            detectedLanguage, 
            detectionResult.source
          );

          // Redirect to localized URL
          navigate(expectedPath, { replace: true });
        } else {
          setIsRedirecting(false);
        }
      }
      
    } catch (error) {
      console.error('Language routing error:', error);
      
      // 更安全的错误处理
      if (!pathname.startsWith(`/${DEFAULT_LANGUAGE}`) && pathWithoutLocale) {
        const fallbackPath = generateLocalizedPath(pathWithoutLocale, DEFAULT_LANGUAGE);
        navigate(fallbackPath, { replace: true });
      }
    } finally {
      setIsRedirecting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // 只包含真正需要的依赖项，避免不必要的重新执行
    location.pathname,
    params.locale,
    isRedirecting,
    currentLocale,
    i18n.language
  ]);

  /**
   * Handle programmatic language changes (from language switcher)
   * Optimized to prevent unnecessary re-creations
   */
  const handleLanguageChange = useCallback(async (event) => {
    if (isRedirecting) return;

    const newLanguage = event.detail?.language;
    if (!newLanguage || !SUPPORTED_LOCALES.includes(newLanguage)) return;

    const pathname = location.pathname;
    const pathWithoutLocale = removeLocaleFromPath(pathname);
    
    try {
      setIsRedirecting(true);

      // Generate new localized path
      const newPath = generateLocalizedPath(pathWithoutLocale, newLanguage);
      
      // Only navigate if the path actually changes
      if (newPath !== pathname) {
        navigate(newPath, { replace: true });
      }

      // Update current locale state
      setCurrentLocale(newLanguage);

    } catch (error) {
      console.error('Language change navigation error:', error);
    } finally {
      setIsRedirecting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRedirecting]);

  /**
   * Handle language switcher specific changes with path context
   */
  const handleLanguageSwitcherChange = useCallback(async (event) => {
    if (isRedirecting) return;

    const { language: newLanguage, pathWithoutLocale, source } = event.detail || {};
    if (!newLanguage || !SUPPORTED_LOCALES.includes(newLanguage)) return;
    if (source !== 'language_switcher') return;

    try {
      setIsRedirecting(true);

      // Generate new localized path using the provided pathWithoutLocale
      const newPath = generateLocalizedPath(pathWithoutLocale, newLanguage);
      
      // Always navigate for language switcher changes
      navigate(newPath, { replace: true });

      // Update current locale state
      setCurrentLocale(newLanguage);

    } catch (error) {
      console.error('Language switcher navigation error:', error);
    } finally {
      setIsRedirecting(false);
    }
  }, [isRedirecting, navigate]);

  // Main routing effect
  useEffect(() => {
    handleLanguageRouting();
  }, [handleLanguageRouting]);

  // Listen for language change events
  useEffect(() => {
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('languageSwitcherChanged', handleLanguageSwitcherChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('languageSwitcherChanged', handleLanguageSwitcherChange);
    };
  }, [handleLanguageChange, handleLanguageSwitcherChange]);

  // Generate hreflang data for SEO (optimized)
  const hreflangData = useMemo(() => {
    const pathWithoutLocale = removeLocaleFromPath(location.pathname);
    return SUPPORTED_LOCALES.map(locale => ({
      locale,
      url: `${window.location.origin}${generateLocalizedPath(pathWithoutLocale, locale)}`
    }));
  }, [location.pathname]);

  // Render SEO meta tags (memoized for performance)
  const seoTags = useMemo(() => {
    if (!currentLocale) return null;

    const languageConfig = getLanguageConfig(currentLocale);
    const pathWithoutLocale = removeLocaleFromPath(location.pathname);

    return (
      <Helmet>
        <html lang={currentLocale} />
        <meta name="language" content={currentLocale} />
        <meta name="geo.region" content={languageConfig?.region || 'Global'} />
        <meta name="geo.placename" content={languageConfig?.markets?.[0] || 'global'} />
        
        {/* Hreflang tags for all supported languages */}
        {hreflangData.map(({ locale, url }) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={url}
          />
        ))}
        
        {/* Default/x-default hreflang */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${window.location.origin}${generateLocalizedPath(pathWithoutLocale, DEFAULT_LANGUAGE)}`}
        />
        
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`${window.location.origin}${generateLocalizedPath(pathWithoutLocale, currentLocale)}`}
        />
      </Helmet>
    );
  }, [currentLocale, location.pathname, hreflangData]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {seoTags}
      {children}
    </>
  );
};

// Create advanced router with language support
const createAdvancedLanguageRouter = () => {
  // 为每个支持的语言创建路由
  const createLanguageRoutes = () => {
    return SUPPORTED_LOCALES.flatMap(locale => [
      // 基础语言路由
      {
        path: `${locale}`,
        element: <HomePage />,
      },
      {
        path: `${locale}/trading/:symbol`,
        element: <TradingPage />,
      },
      {
        path: `${locale}/register`,
        element: <RegisterPage />,
      },
      {
        path: `${locale}/login`,
        element: <LoginPage />,
      },
      {
        path: `${locale}/footer-test`,
        element: <FooterTestPage />,
      },
      {
        path: `${locale}/device-test`,
        element: <DeviceTestPage />,
      },
      {
        path: `${locale}/user`,
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
    ]);
  };
  
  return createBrowserRouter([
    {
      path: '/',
      element: <LanguageAwareRoute><Layout /></LanguageAwareRoute>,
      children: [
        {
          // Root path - redirect to default language
          index: true,
          element: <HomePage />,
        },
        
        ...createLanguageRoutes(),
        
        // Legacy routes without locale - will be redirected
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
    },
  ], {
    basename: BASE_URL,
  });
};

// Global router instance (singleton pattern for optimal performance)
let globalRouterInstance = null;

/**
 * Get or create router instance (singleton pattern)
 * This ensures the router is only created once, preventing performance issues
 */
const getRouterInstance = () => {
  if (!globalRouterInstance) {
    globalRouterInstance = createAdvancedLanguageRouter();
  }
  return globalRouterInstance;
};

/**
 * Main AdvancedLanguageRouter Component
 * Optimized for performance - no unnecessary re-renders or recreations
 */
const AdvancedLanguageRouter = () => {
  // Use useMemo with empty dependency array to ensure router is created only once
  const router = useMemo(() => getRouterInstance(), []);
  
  return <RouterProvider router={router} />;
};

/**
 * Hook to get current locale
 */
export const useCurrentLocale = () => {
  const params = useParams();
  const location = useLocation();
  
  const locale = useMemo(() => {
    return extractLocaleFromPath(location.pathname) || params.locale || DEFAULT_LANGUAGE;
  }, [params.locale, location.pathname]);
  
  return { locale };
};

/**
 * Hook for localized navigation
 */
export const useLocalizedNavigation = () => {
  const navigate = useNavigate();
  const { locale: currentLocale } = useCurrentLocale();
  
  const navigateLocalized = useCallback((path, options = {}) => {
    const localizedPath = generateLocalizedPath(path, currentLocale);
    navigate(localizedPath, options);
  }, [navigate, currentLocale]);
  
  return {
    navigateLocalized,
    currentLocale,
    generatePath: (path) => generateLocalizedPath(path, currentLocale)
  };
};

export default AdvancedLanguageRouter; 