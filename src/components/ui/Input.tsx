import React from 'react';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export function Input({ icon, label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-main-text mb-1.5">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full h-9 rounded-lg border border-border bg-white px-3 py-2 text-sm text-main-text',
            'placeholder:text-secondary-text',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-all duration-150',
            icon && 'pl-9',
            error && 'border-red-400 focus:ring-red-200',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
      <input
        className={cn(
          'w-full h-9 rounded-lg border border-border bg-white pl-9 pr-3 py-2 text-sm text-main-text',
          'placeholder:text-secondary-text',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-all duration-150',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-main-text mb-1.5">{label}</label>
      )}
      <select
        className={cn(
          'w-full h-9 rounded-lg border border-border bg-white px-3 py-2 text-sm text-main-text',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-all duration-150 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-main-text mb-1.5">{label}</label>
      )}
      <textarea
        className={cn(
          'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-main-text',
          'placeholder:text-secondary-text resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-all duration-150',
          className
        )}
        {...props}
      />
    </div>
  );
}
