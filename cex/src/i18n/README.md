# 🌍 RuaCoin 多语言国际化系统

本文档详细介绍了 RuaCoin 交易所的多语言国际化（i18n）系统架构、使用方法和最佳实践。

## 📋 目录

- [系统架构](#系统架构)
- [快速开始](#快速开始)
- [文件结构](#文件结构)
- [使用方法](#使用方法)
- [组件说明](#组件说明)
- [最佳实践](#最佳实践)
- [扩展语言](#扩展语言)
- [故障排除](#故障排除)

## 🏗️ 系统架构

### 技术栈

- **react-i18next**: React 国际化核心库
- **i18next**: 国际化框架
- **i18next-browser-languagedetector**: 浏览器语言检测
- **i18next-http-backend**: 按需加载语言包

### 核心特性

✅ **双语支持**: 中文（zh）、英文（en）  
✅ **运行时切换**: 无需刷新页面即可切换语言  
✅ **持久化存储**: 语言偏好保存到 localStorage  
✅ **URL 路由支持**: 支持 `/zh/trading` 和 `/en/trading` 格式  
✅ **按需加载**: 语言包懒加载，提升性能  
✅ **响应式设计**: 语言切换器适配移动端  
✅ **键盘导航**: 支持键盘操作  
✅ **类型安全**: 完整的 TypeScript 支持

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
```

### 2. 初始化配置

在 `src/main.jsx` 中导入 i18n 配置：

```jsx
import "./i18n";
```

### 3. 在组件中使用

```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation(["common", "header"]);

  return (
    <div>
      <h1>{t("common:welcome")}</h1>
      <button>{t("header:login")}</button>
    </div>
  );
}
```

## 📁 文件结构

```
src/i18n/
├── index.js                 # 核心配置文件
├── locales/                 # 语言资源目录
│   ├── zh/                  # 中文资源
│   │   ├── common.json      # 通用词条
│   │   ├── header.json      # 头部相关
│   │   ├── trading.json     # 交易相关
│   │   └── footer.json      # 底部相关
│   └── en/                  # 英文资源
│       ├── common.json      # 通用词条
│       ├── header.json      # 头部相关
│       ├── trading.json     # 交易相关
│       └── footer.json      # 底部相关
├── hooks/                   # 自定义 Hooks
│   └── useLanguage.js       # 语言相关 Hook
├── utils/                   # 工具函数
│   └── languageUtils.js     # 语言工具函数
└── README.md               # 本文档
```

## 🎯 使用方法

### 基本用法

```jsx
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation("common");

  return <span>{t("welcome")}</span>;
}
```

### 命名空间用法

```jsx
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation(["common", "trading"]);

  return (
    <div>
      <span>{t("common:welcome")}</span>
      <span>{t("trading:buy")}</span>
    </div>
  );
}
```

### 插值用法

```jsx
// 语言文件中: "greeting": "Hello {{name}}!"
const { t } = useTranslation();
return <span>{t("greeting", { name: "John" })}</span>;
```

### 复数用法

```jsx
// 语言文件中: "item": "{{count}} item", "item_plural": "{{count}} items"
const { t } = useTranslation();
return <span>{t("item", { count: 5 })}</span>;
```

## 🧩 组件说明

### LanguageSwitcher

语言切换组件，支持 icon + 弹窗方式切换语言。

```jsx
import LanguageSwitcher from "./components/LanguageSwitcher";

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

**特性:**

- 🎨 美观的 UI 设计
- 📱 响应式布局
- ⌨️ 键盘导航支持
- 🔄 平滑动画效果
- 💾 自动持久化

### LanguageRouter

多语言路由增强组件，支持语言 URL 路径。

```jsx
import LanguageRouter from "./components/LanguageRouter";

function App() {
  return (
    <Router>
      <LanguageRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trading" element={<TradingPage />} />
        </Routes>
      </LanguageRouter>
    </Router>
  );
}
```

**特性:**

- 🔗 支持 `/zh/trading` 和 `/en/trading` 格式
- 🔄 自动重定向到正确语言路径
- 🎯 URL 与语言状态同步
- 🚀 无刷新切换

### useLanguage Hook

自定义语言 Hook，提供完整的语言管理功能。

```jsx
import { useLanguage } from "../i18n/hooks/useLanguage";

function Component() {
  const { currentLanguage, changeLanguage, supportedLanguages, t } =
    useLanguage();

  return (
    <div>
      <span>Current: {currentLanguage}</span>
      <button onClick={() => changeLanguage("en")}>Switch to English</button>
    </div>
  );
}
```

## 🎨 最佳实践

### 1. 命名规范

```json
{
  "camelCase": "使用驼峰命名",
  "nested": {
    "key": "支持嵌套结构"
  },
  "withInterpolation": "Hello {{name}}!",
  "withCount": "{{count}} item",
  "withCount_plural": "{{count}} items"
}
```

### 2. 文件组织

按功能模块组织语言文件：

```
locales/
├── zh/
│   ├── common.json      # 通用词条
│   ├── auth.json        # 认证相关
│   ├── trading.json     # 交易相关
│   └── settings.json    # 设置相关
└── en/
    ├── common.json
    ├── auth.json
    ├── trading.json
    └── settings.json
```

### 3. 性能优化

```jsx
// 使用 React.memo 避免不必要的重渲染
const MyComponent = React.memo(({ data }) => {
  const { t } = useTranslation("common");
  return <div>{t("title")}</div>;
});

// 预加载关键命名空间
i18n.loadNamespaces(["common", "trading"]);
```

### 4. 错误处理

```jsx
const { t } = useTranslation("common", {
  fallbackLng: "zh",
  fallbackNS: "common",
});
```

## 🌐 扩展语言

### 1. 添加新语言

1. 在 `src/i18n/index.js` 中添加语言配置：

```javascript
export const SUPPORTED_LANGUAGES = {
  zh: { code: "zh", name: "中文", nativeName: "中文", flag: "🇨🇳" },
  en: { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  ja: { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
};
```

2. 创建语言资源文件：

```
src/i18n/locales/ja/
├── common.json
├── header.json
├── trading.json
└── footer.json
```

3. 更新资源导入：

```javascript
import jaCommon from "./locales/ja/common.json";
// ...

const resources = {
  zh: {
    /* ... */
  },
  en: {
    /* ... */
  },
  ja: {
    common: jaCommon,
    // ...
  },
};
```

### 2. RTL 语言支持

对于阿拉伯语等 RTL 语言：

```javascript
// 在 languageUtils.js 中添加
export const isRTL = (language) => {
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  return rtlLanguages.includes(language);
};

// 在组件中使用
const { currentLanguage } = useLanguage();
const isRTLLang = isRTL(currentLanguage);

return <div dir={isRTLLang ? "rtl" : "ltr"}>{/* 内容 */}</div>;
```

## 🔧 故障排除

### 常见问题

1. **语言切换不生效**

   - 检查是否正确导入 `./i18n`
   - 确认语言资源文件路径正确
   - 检查浏览器控制台是否有错误

2. **翻译文本不显示**

   - 确认 key 名称正确
   - 检查命名空间是否正确加载
   - 验证 JSON 文件格式是否正确

3. **URL 路由不工作**
   - 确认 `LanguageRouter` 组件正确包裹路由
   - 检查路由配置是否支持语言前缀

### 调试技巧

```javascript
// 开启调试模式
i18n.init({
  debug: true, // 开发环境下开启
  // ...
});

// 检查当前语言
console.log("Current language:", i18n.language);

// 检查资源加载状态
console.log("Resources:", i18n.store.data);
```

## 📝 更新日志

### v1.0.0 (2025-01-XX)

- ✨ 初始版本发布
- 🌍 支持中英双语
- 🎨 语言切换组件
- 🔗 URL 路由支持
- 💾 持久化存储

---

## 🤝 贡献指南

欢迎贡献代码和翻译！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

本项目采用 Apache License 2.0 许可证。
