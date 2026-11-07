import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-light text-primary',
  success: 'bg-green-50 text-success',
  warning: 'bg-orange-50 text-warning',
  danger: 'bg-red-50 text-red-600',
  outline: 'border border-border text-secondary-text bg-transparent',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
