import tw, { styled } from 'twin.macro';
import 'styled-components/macro';

import { ReactComponent as Spinner } from '../../images/spinner.svg';
import { forwardRef } from 'react';

export const ButtonBase = styled.button(({ disabled }) => [disabled && tw`pointer-events-none opacity-80`]);

export const PrimaryButton = tw(
  ButtonBase
)`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`;

export const Button = ({ children, loading, disabled, ...props }) => {
  return (
    <PrimaryButton {...props} disabled={loading || disabled} tw="inline-flex items-center gap-2 justify-center">
      {children}
      {loading && <Spinner />}
    </PrimaryButton>
  );
};

const OutlinedButtonBase = forwardRef(({ children, loading, disabled, icon, ...props }, ref) => {
  return (
    <ButtonBase {...props} disabled={loading || disabled} ref={ref}>
      {children}
      {loading ? <Spinner /> : icon}
    </ButtonBase>
  );
});

export const OutlinedButton = tw(
  OutlinedButtonBase
)`rounded px-8 py-3 inline-flex items-center justify-between border-primary-500 border-2 text-primary-500 font-bold focus:outline-none transition duration-300 hocus:border-primary-100 hocus:text-primary-100`;
