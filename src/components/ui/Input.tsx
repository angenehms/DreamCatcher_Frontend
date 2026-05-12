import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-[16px] bg-[#F2F4F6] px-4 py-2 text-base text-[#191F28] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8B95A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
