import React from 'react';
import { cn } from '../../utils/cn';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[24px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#f2f4f6]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
