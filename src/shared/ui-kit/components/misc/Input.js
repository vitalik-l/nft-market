import tw from 'twin.macro';
import { forwardRef, useCallback } from 'react';

export const InputBase = tw.input`border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500 disabled:opacity-80`;

export const Input = forwardRef(({ numeric, onKeyDown, disableDecimals, ...props }, ref) => {
  // allow only numeric values
  const numericKeyDownHandler = useCallback(
    (event) => {
      const { key, target } = event;
      if (key?.length === 1 && Number.isNaN(parseInt(key))) {
        if (disableDecimals && ['.', ','].includes(key)) {
          event.preventDefault();
        } else if (
          (['.', ','].includes(key) && (target.value?.indexOf('.') !== -1 || !target.value?.length)) ||
          !/^[0-9.,]/.test(key)
        )
          event.preventDefault();
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [onKeyDown]
  );

  return <InputBase ref={ref} {...props} onKeyDown={numeric ? numericKeyDownHandler : onKeyDown} />;
});
