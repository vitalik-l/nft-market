import tw from 'twin.macro';
import 'styled-components/macro';
import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

export const Select = React.forwardRef(
  ({ placeholder, children, value, name, onChange, defaultValue, disabled, ...props }, ref) => {
    const onValueChange = (value) => {
      onChange?.({ target: { value, name } });
    };

    return (
      <RadixSelect.Root
        value={value}
        ref={ref}
        name={name}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={disabled}
        {...props}
      >
        <RadixSelect.Trigger
          css={tw`inline-flex items-center gap-[5px] h-[48px] hover:bg-gray-200 justify-between 
        border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content css={tw`shadow-xl bg-white z-50`}>
            <RadixSelect.ScrollUpButton>
              <ChevronUpIcon />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton>
              <ChevronDownIcon />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  }
);

const Option = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Item
      css={tw`flex gap-2 px-2 cursor-pointer items-center h-[48px] outline-none hover:bg-gray-200`}
      {...props}
      ref={forwardedRef}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator>
        <CheckIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

Select.Option = Option;
