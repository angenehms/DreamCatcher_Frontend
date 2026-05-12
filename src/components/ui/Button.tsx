import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[12px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-[#3182F6] text-white hover:bg-[#1b64da]': variant === 'primary',
            'bg-[#F2F4F6] text-[#191F28] hover:bg-[#e5e8eb]': variant === 'secondary',
            'border border-[#E5E8EB] bg-white text-[#191F28] hover:bg-[#F2F4F6]': variant === 'outline',
            'bg-transparent text-[#4E5968] hover:bg-[#F2F4F6]': variant === 'ghost',
            'h-10 px-4 text-sm': size === 'sm',
            'h-12 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg rounded-[16px]': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
