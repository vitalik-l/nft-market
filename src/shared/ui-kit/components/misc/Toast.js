import tw from 'twin.macro';
import 'styled-components/macro';
import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Button } from './Buttons';
import { useTranslation } from 'react-i18next';
import { CrossCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';

export const Toast = ({ title, children, ...props }) => {
  const { t } = useTranslation();

  return (
    <ToastPrimitive.Root
      duration={7_000}
      tw="bg-white rounded-sm shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
      {...props}
    >
      <ToastPrimitive.Title tw="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[18px]">
        {title}
      </ToastPrimitive.Title>
      <ToastPrimitive.Description asChild>
        <div tw="[grid-area:_description] m-0 text-slate11 text-[16px] leading-[1.3]">{children}</div>
      </ToastPrimitive.Description>
      <ToastPrimitive.Close tw="[grid-area:_action]" asChild altText="Goto schedule to undo">
        <Button small>{t('Close')}</Button>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};

export const SuccessToast = ({ title, ...props }) => {
  return (
    <Toast
      title={
        <div className="flex gap-1 items-center text-green-600">
          <CheckCircledIcon className="w-[1.5em] h-[1.5em]" />
          <div>{title}</div>
        </div>
      }
      {...props}
    />
  );
};

export const ErrorToast = ({ message, ...props }) => {
  const { t } = useTranslation();

  return (
    <Toast
      title={
        <div className="flex gap-1 items-center text-red-700">
          <CrossCircledIcon className="w-[1em] h-[1em]" />
          <div>{t('Error')}</div>
        </div>
      }
      {...props}
    >
      {message}
    </Toast>
  );
};
