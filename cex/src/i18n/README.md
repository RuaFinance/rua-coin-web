# 🌍 Advanced i18n System - RuaCoin CEX

A comprehensive internationalization system with advanced language routing, regional support, and performance optimization.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Components](#components)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Performance](#performance)
- [Contributing](#contributing)

## 🎯 Overview

This advanced i18n system provides enterprise-grade internationalization for the RuaCoin cryptocurrency exchange platform. It supports multiple languages, regions, and currencies with advanced features like automatic language detection, SEO optimization, and comprehensive analytics.

### Supported Languages

- **English (en)** - Global default
- **简体中文 (zh-CN)** - Mainland China
- **繁體中文 (zh-TC)** - Traditional Chinese
- **日本語 (ja)** - Japan
- **한국어 (ko)** - Korea
- **English (en-IN)** - India region

## ✨ Features

### Core Features

- ✅ **Multi-language URL routing** (`/en/trading`, `/zh-CN/trading`)
- ✅ **Automatic language detection** (browser, IP geolocation, user preference)
- ✅ **Regional currency and timezone support**
- ✅ **SEO-optimized hreflang tags**
- ✅ **RTL language support**
- ✅ **Performance-optimized caching**

### Advanced Features

- ✅ **Language middleware** for route protection
- ✅ **Advanced analytics tracking**
- ✅ **Fallback strategies** for unsupported languages
- ✅ **Persistence management** with multiple storage backends
- ✅ **Component-level language awareness**

## 🏗️ Architecture

```
src/i18n/
├── config/
│   └── languageConfig.js          # Language configurations
├── services/
│   └── languageDetectionService.js # Language detection logic
├── middleware/
│   ├── urlRedirectMiddleware.js    # URL redirection
│   └── languageMiddleware.js       # Route protection
├── utils/
│   ├── advancedLanguageUtils.js    # Utility functions
│   └── languagePersistence.js      # Persistence management
├── analytics/
│   └── languageAnalytics.js        # Analytics tracking
└── components/
    └── SEO/
        └── LanguageSEO.jsx         # SEO components
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react-i18next i18next react-router-dom
```

### 2. Initialize the System

```javascript
import { initializeI18nSystem } from "./i18n/config/languageConfig";

// Initialize with default configuration
await initializeI18nSystem();
```

### 3. Wrap Your App

```jsx
import { AdvancedLanguageRouter } from "./i18n/router/AdvancedLanguageRouter";
import { LanguageSEO } from "./i18n/components/SEO/LanguageSEO";

function App() {
  return (
    <AdvancedLanguageRouter>
      <LanguageSEO />
      {/* Your app components */}
    </AdvancedLanguageRouter>
  );
}
```

### 4. Use Language-Aware Components

```jsx
import LanguageAwareLink from "./components/LanguageAware/LanguageAwareLink";
import AdvancedLanguageSwitcher from "./components/LanguageSwitcher/AdvancedLanguageSwitcher";

function Navigation() {
  return (
    <nav>
      <LanguageAwareLink to="/trading">Trading</LanguageAwareLink>
      <AdvancedLanguageSwitcher showRegion={true} />
    </nav>
  );
}
```

## ⚙️ Configuration

### Language Configuration

```javascript
// config/languageConfig.js
export const ADVANCED_LANGUAGE_CONFIG = {
  en: {
    name: "English",
    nativeName: "English",
    code: "en",
    htmlLang: "en-US",
    dir: "ltr",
    currency: "USD",
    region: "Global",
    // ... more configuration
  },
  "zh-CN": {
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    code: "zh-CN",
    htmlLang: "zh-CN",
    dir: "ltr",
    currency: "CNY",
    region: "China",
    // ... more configuration
  },
};
```

### Detection Configuration

```javascript
// services/languageDetectionService.js
const DETECTION_CONFIG = {
  enableBrowserDetection: true,
  enableGeoDetection: true,
  enablePersistenceDetection: true,
  fallbackLanguage: "en",
  confidenceThreshold: 0.7,
};
```

## 🧩 Components

### AdvancedLanguageRouter

Enhanced router with language prefix support:

```jsx
<AdvancedLanguageRouter
  enableRedirect={true}
  enableMiddleware={true}
  enableAnalytics={true}
>
  <Routes>
    <Route path="/trading" element={<TradingPage />} />
  </Routes>
</AdvancedLanguageRouter>
```

### LanguageAwareLink

Automatically generates localized URLs:

```jsx
<LanguageAwareLink
  to="/trading/BTCUSDT"
  preserveQuery={true}
  locale="zh-CN" // Optional override
>
  Trade BTC/USDT
</LanguageAwareLink>
```

### AdvancedLanguageSwitcher

Feature-rich language switcher:

```jsx
<AdvancedLanguageSwitcher
  variant="dropdown" // dropdown | inline | mobile
  showRegion={true}
  showFlag={true}
  showNativeName={true}
  onLanguageChange={(locale) => console.log(locale)}
/>
```

### LanguageSEO

SEO optimization component:

```jsx
<LanguageSEO
  generateHreflang={true}
  generateCanonical={true}
  generateMeta={true}
/>
```

## 📚 API Reference

### Language Detection

```javascript
import languageDetectionService from "./services/languageDetectionService";

// Detect language for a specific context
const result = await languageDetectionService.detectLanguage("/trading");
// Returns: { language: 'en', source: 'browser', confidence: 0.8 }
```

### URL Generation

```javascript
import { generateAdvancedLocalizedPath } from "./utils/advancedLanguageUtils";

// Generate localized URL with query parameters
const url = generateAdvancedLocalizedPath("/trading", "zh-CN", {
  query: { symbol: "BTCUSDT" },
  preserveQuery: true,
});
// Returns: '/zh-CN/trading?symbol=BTCUSDT'
```

### Persistence Management

```javascript
import languagePersistenceManager from "./utils/languagePersistence";

// Save language preference
await languagePersistenceManager.saveLanguagePreference(
  "zh-CN",
  "user_selection"
);

// Load language preference
const preference = await languagePersistenceManager.loadLanguagePreference();
```

### Middleware

```javascript
import languageMiddleware from "./middleware/languageMiddleware";

// Execute middleware checks
const result = await languageMiddleware.execute({
  pathname: "/zh-CN/trading",
  userPermissions: ["trading", "user"],
});
```

### Analytics

```javascript
import { useLanguageAnalytics } from "./analytics/languageAnalytics";

function MyComponent() {
  const { trackLanguageChange, trackRouteAccess } = useLanguageAnalytics();

  // Track language change
  trackLanguageChange("en", "zh-CN", "user_selection");

  // Track route access
  trackRouteAccess("/trading", "zh-CN", 250);
}
```

## 📊 Performance

### Optimization Features

- **Memory caching** with automatic cleanup
- **Request batching** for analytics
- **Lazy loading** of language resources
- **Performance monitoring** with thresholds

### Performance Metrics

```javascript
import { getPerformanceStats } from "./utils/advancedLanguageUtils";

const stats = getPerformanceStats();
console.log(`Cache hit rate: ${stats.cacheHitRate}%`);
```

### Benchmarks

- **Path generation**: < 1ms per operation
- **Language detection**: < 10ms average
- **Middleware execution**: < 50ms average
- **Memory usage**: < 5MB additional overhead

## 🔧 Advanced Configuration

### Custom Language Detection

```javascript
// Add custom detection source
languageDetectionService.addDetectionSource("custom", async (context) => {
  // Your custom detection logic
  return {
    language: "en",
    confidence: 0.9,
    source: "custom",
  };
});
```

### Analytics Integration

```javascript
// Configure analytics providers
languageAnalyticsTracker.configure({
  googleAnalytics: {
    enabled: true,
    measurementId: "G-XXXXXXXXXX",
  },
  customEndpoint: {
    enabled: true,
    url: "https://api.yourdomain.com/analytics",
    headers: { Authorization: "Bearer token" },
  },
});
```

### Middleware Configuration

```javascript
// Configure route protection
languageMiddleware.configure({
  protectedRoutes: ["/user", "/trading", "/admin"],
  publicRoutes: ["/", "/register", "/login"],
  enableAutoCorrection: true,
});
```

## 🛡️ Security Considerations

- **Input validation** for all language codes
- **XSS protection** in URL generation
- **CSRF protection** for language switching
- **Rate limiting** for detection requests

## 📈 Monitoring and Analytics

### Language Usage Analytics

```javascript
const insights = languageAnalyticsTracker.getAnalyticsInsights();

console.log("Language usage:", insights.languageUsage);
console.log("Route patterns:", insights.routePatterns);
console.log("Performance metrics:", insights.performance);
```

### Error Tracking

```javascript
languageAnalyticsTracker.trackError(
  {
    type: "detection_failure",
    message: "Failed to detect browser language",
  },
  { context: "header_component" }
);
```

## 🔄 Migration Guide

### From Basic i18next

1. **Update imports**:

   ```javascript
   // Before
   import { useTranslation } from "react-i18next";

   // After
   import { useTranslation } from "react-i18next";
   import { useCurrentLocale } from "./i18n/router/AdvancedLanguageRouter";
   ```

2. **Replace Links**:

   ```jsx
   // Before
   <Link to="/trading">Trading</Link>

   // After
   <LanguageAwareLink to="/trading">Trading</LanguageAwareLink>
   ```

3. **Add Language Routing**:
   ```jsx
   // Wrap your app with AdvancedLanguageRouter
   <AdvancedLanguageRouter>
     <App />
   </AdvancedLanguageRouter>
   ```

## 🤝 Contributing

### Development Setup

```bash
# Clone and install
git clone https://github.com/your-repo/rua-coin-web.git
cd rua-coin-web/cex
npm install

# Run tests
npm run test:i18n

# Start development server
npm run dev
```

### Adding New Languages

1. **Add language configuration** in `config/languageConfig.js`
2. **Create locale files** in `locales/[language]/`
3. **Update supported locales array**
4. **Add tests** for the new language
5. **Update documentation**

### Code Style

- Use TypeScript for new components
- Follow existing naming conventions
- Add comprehensive tests
- Document all public APIs

## 📄 License

Copyright 2025 chenjjiaa

Licensed under the Apache License, Version 2.0. See LICENSE file for details.

## 🙋‍♂️ Support

- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]
- **Discussions**: [GitHub Discussions]
- **Email**: support@ruacoin.com

---

Built with ❤️ for the global crypto community by the RuaCoin team.
