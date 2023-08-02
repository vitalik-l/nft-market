import tw, { styled } from 'twin.macro';
import 'styled-components/macro';

import { ReactComponent as Spinner } from '../../images/spinner.svg';
import { forwardRef } from 'react';

export const ButtonBase = styled.button(({ disabled }) => [disabled && tw`pointer-events-none opacity-80`]);

export const PrimaryButton = tw(
  ButtonBase
)`rounded-3xl px-8 py-3 inline-flex items-center justify-between border-primary-500 border-2 text-primary-500 font-bold focus:outline-none transition duration-300 hocus:border-primary-400 hocus:text-primary-400`;

export const Button = forwardRef(({ children, loading, disabled, icon, ...props }, ref) => {
  return (
    <PrimaryButton
      {...props}
      disabled={loading || disabled}
      tw="inline-flex items-center gap-2 justify-center"
      ref={ref}
    >
      {children}
      {loading ? <Spinner /> : icon}
    </PrimaryButton>
  );
});
