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
  