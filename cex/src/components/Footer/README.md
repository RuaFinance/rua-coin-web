# Footer 组件文档

## 概述

Footer 组件是一个功能完整的页脚组件，支持多种显示模式和灵活的控制方式。它参考了业界主流交易所（如 Binance、Coinbase）的设计，提供了专业的用户体验。

## 特性

### 🎨 设计特性

- **黑色主题**：与 Header 设计呼应，保持一致的视觉风格
- **响应式设计**：完美适配桌面端、平板和移动端
- **动画效果**：平滑的显示/隐藏过渡动画
- **交互反馈**：悬停效果和微动画

### 🔧 功能特性

- **智能显示控制**：根据页面路径自动显示/隐藏
- **多种显示模式**：完整版、简化版、隐藏模式
- **灵活配置**：支持自定义内容和链接
- **无障碍支持**：符合 WCAG 2.1 标准

### 📱 移动端优化

- **折叠式菜单**：移动端自动折叠，节省空间
- **触摸友好**：优化的触摸交互体验
- **性能优化**：懒加载和动画优化

## 组件结构

```
Footer/
├── Footer.jsx              # 主Footer组件
├── SimplifiedFooter.jsx    # 简化版Footer
├── FooterWrapper.jsx       # Footer包装器
├── FooterAnimation.jsx     # 动画版本Footer
├── README.md              # 本文档
└── styles/
    └── footer.css         # Footer样式文件
```

## 使用方法

### 基本使用

Footer 组件已经集成到 Layout 中，会自动根据页面路径显示或隐藏：

```jsx
// Layout.jsx
import FooterAnimation from "../components/FooterAnimation";

const Layout = () => {
  return (
    <FooterProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <FooterAnimation />
      </div>
    </FooterProvider>
  );
};
```

### 手动控制

在页面组件中使用 Hook 控制 Footer：

```jsx
import { useFooter } from "../contexts/FooterContext";
import {
  useFooterControl,
  useHideFooter,
  useShowFooter,
} from "../hooks/useFooterControl";

const MyPage = () => {
  // 获取Footer状态
  const { showFooter, footerType, setShowFooter } = useFooter();

  // 强制隐藏Footer
  useHideFooter();

  // 强制显示Footer
  useShowFooter();

  // 自定义控制
  const { setShowFooter: setShowFooterControl } = useFooterControl();

  const handleToggleFooter = () => {
    setShowFooter(!showFooter);
  };

  return (
    <div>
      <button onClick={handleToggleFooter}>
        {showFooter ? "隐藏Footer" : "显示Footer"}
      </button>
    </div>
  );
};
```

## 配置

### Footer 显示规则

在 `FooterConfig.jsx` 中配置显示规则：

```jsx
export const FOOTER_DISPLAY_RULES = {
  // 完全隐藏footer的路径
  HIDE_FOOTER_PATHS: ["/trading", "/login", "/register", "/404"],

  // 部分隐藏footer的路径（只显示简化版）
  SIMPLIFIED_FOOTER_PATHS: ["/api", "/docs"],

  // 强制显示footer的路径（即使匹配了隐藏规则）
  FORCE_SHOW_FOOTER_PATHS: ["/about", "/help", "/contact"],
};
```

### Footer 内容配置

在 `FooterConfig.jsx` 中配置内容：

```jsx
export const FOOTER_CONTENT_CONFIG = {
  company: {
    name: "RuaCoin",
    description: "全球领先的数字资产交易平台...",
    // ...
  },

  socialMedia: [
    {
      name: "Twitter",
      url: "https://twitter.com/ruacoin",
      icon: "Twitter",
      color: "hover:text-blue-400",
    },
    // ...
  ],

  // 更多配置...
};
```

## 显示模式

### 完整版 Footer

- 包含所有功能模块
- 适用于首页、关于页面等
- 包含产品、服务、支持、公司信息等完整内容

### 简化版 Footer

- 只显示核心信息
- 适用于 API 文档、技术文档等
- 包含 Logo、版权信息、基本法律链接

### 隐藏模式

- 完全不显示 Footer
- 适用于交易页面、登录页面等
- 最大化内容区域

## 样式定制

### CSS 类名

Footer 组件使用以下 CSS 类名，可以通过覆盖这些类来自定义样式：

```css
.footer-container          /* Footer容器 */
/* Footer容器 */
.footer-gradient          /* 渐变背景 */
.footer-content-fade-in   /* 内容淡入动画 */
.footer-social-icon       /* 社交媒体图标 */
.footer-contact-info      /* 联系信息 */
.footer-divider           /* 分割线 */
.footer-app-download      /* APP下载按钮 */
.footer-legal-link        /* 法律链接 */
.footer-risk-disclosure   /* 风险提示 */
.footer-certification; /* 认证信息 */
```

### 自定义样式

在 `footer.css` 中添加自定义样式：

```css
/* 自定义Footer背景 */
.footer-container {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
}

/* 自定义链接颜色 */
.footer-link:hover {
  color: #your-custom-color;
}
```

## 动画效果

### 显示/隐藏动画

- 使用 CSS transform 和 opacity 实现平滑过渡
- 支持减少动画模式（prefers-reduced-motion）
- 动画时长：300ms

### 交互动画

- 社交媒体图标：悬停时缩放和旋转
- 链接：悬停时下划线动画
- 按钮：悬停时阴影和位移效果

## 无障碍支持

### 键盘导航

- 所有交互元素都支持键盘导航
- Tab 键顺序合理
- 焦点状态清晰可见

### 屏幕阅读器

- 语义化 HTML 结构
- 适当的 ARIA 标签
- 描述性文本

### 高对比度模式

- 支持系统高对比度设置
- 自动调整颜色和边框

## 性能优化

### 懒加载

- 图标和图片懒加载
- 非关键内容延迟加载

### 动画优化

- 使用 CSS transform 而非改变布局属性
- 硬件加速优化
- 动画帧率优化

### 代码分割

- Footer 组件独立打包
- 按需加载样式

## 测试

### 测试页面

访问 `/footer-test` 页面可以测试 Footer 的各种功能：

- 显示/隐藏控制
- 类型切换
- 动画效果
- 响应式布局

### 测试用例

- 不同屏幕尺寸下的显示效果
- 各种交互状态
- 动画性能
- 无障碍功能

## 故障排除

### 常见问题

1. **Footer 不显示**

   - 检查路由配置
   - 确认 FooterProvider 是否正确包裹
   - 检查路径匹配规则

2. **样式不生效**

   - 确认 CSS 文件已导入
   - 检查类名是否正确
   - 确认 Tailwind CSS 配置

3. **动画卡顿**
   - 检查硬件加速
   - 优化动画属性
   - 考虑减少动画复杂度

### 调试技巧

```jsx
// 在组件中添加调试信息
const { showFooter, footerType } = useFooter();
console.log("Footer状态:", { showFooter, footerType });
```

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基本显示/隐藏功能
- 响应式设计
- 动画效果

### v1.1.0

- 添加简化版 Footer
- 优化移动端体验
- 增强无障碍支持

### v1.2.0

- 添加配置文件
- 支持自定义 Hook
- 性能优化

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

Apache License 2.0
