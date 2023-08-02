import tw from 'twin.macro';
import 'styled-components/macro';
import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

export const Toast = ({ title, children, ...props }) => {
  return (
    <ToastPrimitive.Root
      tw="bg-white rounded-sm shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
      {...props}
    >
      <ToastPrimitive.Title tw="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
        {title}
      </ToastPrimitive.Title>
      <ToastPrimitive.Description asChild>
        <div tw="[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]">{children}</div>
      </ToastPrimitive.Description>
      <ToastPrimitive.Close tw="[grid-area:_action]" asChild altText="Goto schedule to undo">
        <button tw="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-green2 text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8">
          Close
        </button>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};
