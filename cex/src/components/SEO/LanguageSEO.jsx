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

import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import {
  SUPPORTED_LOCALES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  SEO_CONFIG
} from '../../i18n/config/languageConfig';
import {
  generateLocalizedPath,
  removeLocaleFromPath,
  extractLocaleFromPath
} from '../../router/languageRouter';

/**
 * 🔍 Language SEO Component
 * 
 * Provides comprehensive SEO optimization for multi-language websites:
 * - Canonical URLs for each language variant
 * - Hreflang tags for all supported languages
 * - Language-specific meta tags
 * - Open Graph locale tags
 * - Structured data for language variants
 * - Proper HTML lang and dir attributes
 * 
 * Following Google's best practices for international SEO:
 * @see https://developers.google.com/search/docs/advanced/crawling/localized-versions
 * 
 * @component
 * @example
 * <LanguageSEO 
 *   currentLocale="zh-CN"
 *   pageTitle="Trading Platform"
 *   pageDescription="Secure cryptocurrency trading"
 *   keywords={["crypto", "trading", "bitcoin"]}
 * />
 */
const LanguageSEO = ({
  currentLocale,
  pageTitle,
  pageDescription,
  keywords = [],
  image,
  canonical,
  noindex = false,
  nofollow = false,
  structuredData
}) => {
  const location = useLocation();

  // 获取当前语言配置
  const languageConfig = useMemo(() => {
    return getLanguageConfig(currentLocale || DEFAULT_LANGUAGE);
  }, [currentLocale]);

  // 生成所有语言版本的URL
  const alternateURLs = useMemo(() => {
    const currentPath = location.pathname;
    const pathWithoutLocale = removeLocaleFromPath(currentPath);
    
    return SUPPORTED_LOCALES.map(locale => {
      const config = getLanguageConfig(locale);
      const localizedPath = generateLocalizedPath(pathWithoutLocale, locale);
      
      return {
        locale,
        hreflang: config.htmlLang,
        url: `${window.location.origin}${localizedPath}`,
        isDefault: locale === DEFAULT_LANGUAGE
      };
    });
  }, [location.pathname]);

  // 生成canonical URL
  const canonicalURL = useMemo(() => {
    if (canonical) return canonical;
    
    const currentPath = location.pathname;
    const hasLocalePrefix = extractLocaleFromPath(currentPath);
    
    if (hasLocalePrefix) {
      return `${window.location.origin}${currentPath}`;
    } else {
      // 如果没有语言前缀，重定向到默认语言版本
      const pathWithLocale = generateLocalizedPath(currentPath, currentLocale || DEFAULT_LANGUAGE);
      return `${window.location.origin}${pathWithLocale}`;
    }
  }, [location.pathname, currentLocale, canonical]);

  // 生成语言特定的关键词
  const localizedKeywords = useMemo(() => {
    const baseKeywords = Array.isArray(keywords) ? keywords : [];
    
    // 添加语言特定的关键词
    const languageSpecificKeywords = {
      'zh-CN': ['加密货币', '比特币', '交易平台', '数字资产'],
      'zh-TC': ['加密貨幣', '比特幣', '交易平台', '數位資產'], 
      'ja': ['暗号資産', 'ビットコイン', '取引所', 'クリプト'],
      'ko': ['암호화폐', '비트코인', '거래소', '디지털자산'],
      'en-IN': ['cryptocurrency india', 'bitcoin trading', 'crypto exchange india', 'digital assets'],
      'en': ['cryptocurrency', 'bitcoin', 'crypto trading', 'digital assets']
    };

    const additionalKeywords = languageSpecificKeywords[currentLocale] || [];
    return [...baseKeywords, ...additionalKeywords];
  }, [keywords, currentLocale]);

  // 生成结构化数据
  const structuredDataLD = useMemo(() => {
    if (!structuredData) return null;

    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDescription,
      url: canonicalURL,
      inLanguage: languageConfig.htmlLang,
      isPartOf: {
        '@type': 'WebSite',
        name: 'RuaCoin Exchange',
        url: window.location.origin,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    };

    // 添加多语言版本信息
    if (alternateURLs.length > 1) {
      baseData.availableLanguage = alternateURLs.map(alt => ({
        '@type': 'Language',
        name: getLanguageConfig(alt.locale).name,
        alternateName: alt.hreflang
      }));
    }

    return JSON.stringify({ ...baseData, ...structuredData });
  }, [structuredData, pageTitle, pageDescription, canonicalURL, languageConfig, alternateURLs]);

  // Robots meta content
  const robotsContent = useMemo(() => {
    const directives = [];
    if (noindex) directives.push('noindex');
    if (nofollow) directives.push('nofollow');
    if (directives.length === 0) directives.push('index', 'follow');
    return directives.join(', ');
  }, [noindex, nofollow]);

  return (
    <Helmet>
      {/* 基本语言设置 */}
      <html lang={languageConfig.htmlLang} dir={languageConfig.dir} />
      
      {/* 页面标题 */}
      {pageTitle && <title>{pageTitle}</title>}
      
      {/* Meta描述 */}
      {pageDescription && <meta name="description" content={pageDescription} />}
      
      {/* 关键词 */}
      {localizedKeywords.length > 0 && (
        <meta name="keywords" content={localizedKeywords.join(', ')} />
      )}
      
      {/* Robots指令 */}
      <meta name="robots" content={robotsContent} />
      
      {/* 语言相关meta */}
      <meta name="language" content={languageConfig.htmlLang} />
      <meta httpEquiv="content-language" content={languageConfig.htmlLang} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalURL} />
      
      {/* Hreflang标签 */}
      {alternateURLs.map((alt, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.url}
        />
      ))}
      
      {/* x-default hreflang */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={alternateURLs.find(alt => alt.isDefault)?.url || canonicalURL}
      />
      
      {/* Open Graph语言标签 */}
      <meta property="og:locale" content={languageConfig.htmlLang.replace('-', '_')} />
      
      {/* 其他语言的Open Graph */}
      {alternateURLs
        .filter(alt => alt.locale !== currentLocale)
        .map((alt, index) => (
          <meta
            key={index}
            property="og:locale:alternate"
            content={getLanguageConfig(alt.locale).htmlLang.replace('-', '_')}
          />
        ))}
      
      {/* Open Graph基本信息 */}
      {pageTitle && <meta property="og:title" content={pageTitle} />}
      {pageDescription && <meta property="og:description" content={pageDescription} />}
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="RuaCoin Exchange" />
      
      {/* Open Graph图片 */}
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:alt" content={pageTitle || 'RuaCoin Exchange'} />
        </>
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      {pageTitle && <meta name="twitter:title" content={pageTitle} />}
      {pageDescription && <meta name="twitter:description" content={pageDescription} />}
      {image && <meta name="twitter:image" content={image} />}
      
      {/* 地理和货币信息 */}
      <meta name="geo.region" content={languageConfig.regions?.[0] || 'Global'} />
      <meta name="geo.placename" content={languageConfig.region} />
      <meta name="currency" content={languageConfig.currency} />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* DNS预取优化 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* 性能提示 */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 结构化数据 */}
      {structuredDataLD && (
        <script type="application/ld+json">
          {structuredDataLD}
        </script>
      )}
      
      {/* 语言特定的样式表 */}
      {languageConfig.dir === 'rtl' && (
        <link rel="stylesheet" href="/css/rtl.css" />
      )}
      
      {/* 浏览器配置 */}
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      
      {/* 搜索引擎验证（如果需要） */}
      {/* <meta name="google-site-verification" content="verification-code" /> */}
      {/* <meta name="msvalidate.01" content="verification-code" /> */}
      
    </Helmet>
  );
};

export default LanguageSEO;

/**
 * Hook for generating SEO data
 */
export const useSEOData = (locale, path) => {
  return useMemo(() => {
    const config = getLanguageConfig(locale);
    const pathWithoutLocale = removeLocaleFromPath(path);
    
    const alternateUrls = SUPPORTED_LOCALES.map(supportedLocale => ({
      locale: supportedLocale,
      url: generateLocalizedPath(pathWithoutLocale, supportedLocale),
      hreflang: getLanguageConfig(supportedLocale).htmlLang
    }));
    
    return {
      currentLanguage: config,
      alternateUrls,
      canonicalUrl: generateLocalizedPath(pathWithoutLocale, locale),
      pathWithoutLocale
    };
  }, [locale, path]);
}; 