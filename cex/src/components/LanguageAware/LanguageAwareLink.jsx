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

import React, { useMemo, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { generateAdvancedLocalizedPath } from '../../i18n/utils/advancedLanguageUtils';
import { useCurrentLocale } from '../LanguageRouter/AdvancedLanguageRouter';

/**
 * 🔗 Language-Aware Link Component
 * 
 * Automatically generates localized URLs for navigation links.
 * Preserves current locale and handles language-specific routing.
 * 
 * Features:
 * - Automatic locale prefix injection
 * - Query parameter preservation
 * - External link detection
 * - SEO-friendly URL generation
 * - Accessibility optimizations
 * 
 * @component
 * @example
 * <LanguageAwareLink to="/trading/BTCUSDT">
 *   Start Trading
 * </LanguageAwareLink>
 * 
 * // Renders as: /en/trading/BTCUSDT (if current locale is 'en')
 */
const LanguageAwareLink = forwardRef(({
  to,
  locale: overrideLocale,
  preserveQuery = false,
  preserveFragment = false,
  external = false,
  children,
  className = '',
  title,
  'aria-label': ariaLabel,
  onClick,
  target,
  rel,
  ...props
}, ref) => {
  const { locale: currentLocale } = useCurrentLocale();
  const location = useLocation();

  // Determine target locale
  const targetLocale = overrideLocale || currentLocale;

  // Generate localized URL
  const localizedTo = useMemo(() => {
    // Handle external URLs
    if (external || (typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto:')))) {
      return to;
    }

    // Handle absolute paths
    if (typeof to === 'string') {
      return generateAdvancedLocalizedPath(to, targetLocale, {
        preserveQuery,
        preserveFragment
      });
    }

    // Handle pathname objects
    if (to && typeof to === 'object' && to.pathname) {
      const localizedPathname = generateAdvancedLocalizedPath(to.pathname, targetLocale, {
        preserveQuery: preserveQuery || !!to.search,
        preserveFragment: preserveFragment || !!to.hash
      });
      
      return {
        ...to,
        pathname: localizedPathname
      };
    }

    return to;
  }, [to, targetLocale, preserveQuery, preserveFragment, external]);

  // Handle external links with regular anchor tag
  if (external || (typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto:')))) {
    return (
      <a
        ref={ref}
        href={localizedTo}
        className={className}
        title={title}
        aria-label={ariaLabel}
        onClick={onClick}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Use React Router Link for internal navigation
  return (
    <Link
      ref={ref}
      to={localizedTo}
      className={className}
      title={title}
      aria-label={ariaLabel}
      onClick={onClick}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
});

LanguageAwareLink.displayName = 'LanguageAwareLink';

export default LanguageAwareLink; 