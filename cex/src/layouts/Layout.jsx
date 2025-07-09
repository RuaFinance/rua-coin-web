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

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import AlertManager from '../components/AlertManager';
import FooterAnimation from '../components/FooterAnimation';
import Header from '../components/Header';
import { useCurrentLocale } from '../components/LanguageRouter/AdvancedLanguageRouter';
import ScrollToTop from '../components/ScrollToTop';
import LanguageSEO from '../components/SEO/LanguageSEO';
import { FooterProvider } from '../contexts/FooterContext';

// Import language utilities
import { getLanguageConfig } from '../i18n/config/languageConfig';

const Layout = () => {
  const location = useLocation();
  const { locale: currentLocale } = useCurrentLocale();
  const languageConfig = getLanguageConfig(currentLocale);

  // Generate page-specific SEO data
  const generateSEOData = () => {
    const pathname = location.pathname;
    const baseData = {
      locale: currentLocale,
      path: pathname,
      site: {
        name: 'RuaCoin',
        description: 'Professional Cryptocurrency Exchange Platform',
        url: window.location.origin,
        logo: `${window.location.origin}/assets/logo.png`,
        twitterHandle: '@ruacoin',
      },
      organization: {
        name: 'RuaCoin Exchange',
        url: window.location.origin,
        logo: `${window.location.origin}/assets/logo.png`,
        foundingDate: '2024',
        address: {
          streetAddress: '',
          addressLocality: languageConfig?.region || 'Global',
          addressRegion: languageConfig?.regions?.[0] || 'US',
          addressCountry: languageConfig?.regions?.[0] || 'US'
        }
      }
    };

    // Page-specific SEO data
    if (pathname.includes('/trading/')) {
      const symbol = pathname.split('/').pop();
      return {
        ...baseData,
        page: {
          type: 'trading',
          title: `${symbol} Trading - RuaCoin Exchange`,
          description: `Trade ${symbol} with advanced charts and tools on RuaCoin Exchange. Real-time data, low fees, and professional trading features.`,
          keywords: ['cryptocurrency', 'trading', symbol, 'exchange', 'bitcoin', 'ethereum'],
          canonicalUrl: `${window.location.origin}${pathname}`,
        }
      };
    }

    if (pathname.includes('/user/dashboard')) {
      return {
        ...baseData,
        page: {
          type: 'dashboard',
          title: 'User Dashboard - RuaCoin Exchange',
          description: 'Manage your cryptocurrency portfolio, view trading history, and access account settings.',
          keywords: ['dashboard', 'portfolio', 'account', 'cryptocurrency'],
          canonicalUrl: `${window.location.origin}${pathname}`,
        }
      };
    }

    if (pathname.includes('/register')) {
      return {
        ...baseData,
        page: {
          type: 'register',
          title: 'Register - RuaCoin Exchange',
          description: 'Create your RuaCoin Exchange account and start trading cryptocurrencies today.',
          keywords: ['register', 'signup', 'account', 'cryptocurrency', 'exchange'],
          canonicalUrl: `${window.location.origin}${pathname}`,
        }
      };
    }

    if (pathname.includes('/login')) {
      return {
        ...baseData,
        page: {
          type: 'login',
          title: 'Login - RuaCoin Exchange',
          description: 'Access your RuaCoin Exchange account securely.',
          keywords: ['login', 'signin', 'account', 'secure'],
          canonicalUrl: `${window.location.origin}${pathname}`,
        }
      };
    }

    // Default homepage SEO
    return {
      ...baseData,
      page: {
        type: 'homepage',
        title: 'RuaCoin Exchange - Professional Cryptocurrency Trading Platform',
        description: 'Trade Bitcoin, Ethereum, and 500+ cryptocurrencies on RuaCoin Exchange. Advanced trading tools, low fees, and enterprise-grade security.',
        keywords: ['cryptocurrency', 'exchange', 'bitcoin', 'ethereum', 'trading', 'blockchain'],
        canonicalUrl: `${window.location.origin}${pathname}`,
      }
    };
  };

  const seoData = generateSEOData();

  return (
    <FooterProvider>
      <div className="min-h-screen flex flex-col" dir={languageConfig?.dir || 'ltr'}>
        {/* Scroll to top on route change */}
        <ScrollToTop behavior="smooth" />
        
        {/* SEO Components */}
        <LanguageSEO {...seoData} />
        
        {/* Original Header with language support */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
        
        {/* Footer with animations */}
        <FooterAnimation />
        
        {/* Alert Manager for notifications */}
        <AlertManager />
      </div>
    </FooterProvider>
  );
};

export default Layout;