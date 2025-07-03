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
 * SyntheticEventHandlers
 *
 * Encapsulates commonly used React synthetic event handlers such as
 * onClick, onKeyDown, and onBlur.
 *
 * @returns {Object} An object containing multiple event handling functions.
 *
 * @example example:
 * ```jsx
 * import React from 'react';
 * import SyntheticEventHandlers from './SyntheticEventHandlers';
 * 
 * const MyInputComponent = () => {
 *   const { handleKeyDown, handleBlur, handleClick } = SyntheticEventHandlers();
 *
 *   return (
 *     <input
 *       onClick={handleClick}
 *       onKeyDown={handleKeyDown}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 * ```
 */

const SyntheticEventHandlers = () => {
    const handleClick = (e) => {
      console.log('Clicked', e);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    };
  
    const handleBlur = (e) => {
      console.log('Blurred', e.target.value);
    };
  
    return {
      handleClick,
      handleKeyDown,
      handleBlur,
    };
  };
  
  export default SyntheticEventHandlers;
  