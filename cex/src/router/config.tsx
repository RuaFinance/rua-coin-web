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

/// <reference types="vite/client" />

/**
 * The `VITE_DEPLOY_ENV` variable's dynamic configuration 
 * is defined within the `ci.yaml` file.
 */
const DEPLOY_ENV = import.meta.env.VITE_DEPLOY_ENV;
export const BASE_URL = DEPLOY_ENV === 'GIT' ? '/rua-coin-web' : '';

/**
 * @example
 * ```jsx
 * import { formatUrl } from '../router/config';
 * 
 * const url = formatUrl('/asserts/apple-beb23ea0201e.png');
 * console.log(url); // /rua-coin-web/asserts/apple-beb23ea0201e.png
 * ```
 */
export const formatUrl = (path: string): string => {
    return BASE_URL + path;
}
