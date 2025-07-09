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

/**
 * SimplifiedFooter Component
 * 
 * A simplified footer component with essential links and branding.
 * Used in specific layouts where a full footer might be too heavy.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

import LanguageAwareLink from './LanguageAware/LanguageAwareLink';

const SimplifiedFooter = () => {
  const { t } = useTranslation(['footer', 'common']);

  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <LanguageAwareLink to="/" className="text-xl font-bold gradient-text">RuaCoin</LanguageAwareLink>
            <p className="text-gray-400 text-sm mt-2">
              © 2025 RuaCoin. {t('footer:allRightsReserved', 'All rights reserved')}.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
            <LanguageAwareLink 
              to="/help" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('footer:help', 'Help')}
            </LanguageAwareLink>
            <LanguageAwareLink 
              to="/privacy" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('footer:privacy', 'Privacy')}
            </LanguageAwareLink>
            <LanguageAwareLink 
              to="/terms" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('footer:terms', 'Terms')}
            </LanguageAwareLink>
            <LanguageAwareLink 
              to="/contact" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('footer:contact', 'Contact')}
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimplifiedFooter; 