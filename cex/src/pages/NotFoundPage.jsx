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

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LanguageAwareLink from '../components/LanguageAware/LanguageAwareLink';
import { formatUrl } from '../router/config';

const NotFoundPage = () => {
  const { t } = useTranslation(['pages', 'common']);

  return (
    <div className="bg-[#f1f2f3]" >
    <div className="mx-auto text-center error-container">
      <div className="h-[30px] bg-[#f1f2f3]"></div>
      <div className="bg-white" >
        <img src={formatUrl("/asserts/very_sorry.png")} className="mx-auto" alt="Not Found" />
        <div className="py-0" style={{padding: "0 0 40px 0"}}>
          <LanguageAwareLink to="/" 
            className="rollback-btn font-bold"
          >
            {t('pages:notFound.backToHome')}
          </LanguageAwareLink>
        </div>

        <div className="error-split" id="up"></div>

        <div className='error-manga'>
          <img src={formatUrl("/asserts/HtPXYfpuXU.png")} className="mx-auto" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFoundPage;