import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, hint, leftIcon, rightIcon, id, className = '', placeholder, ...rest },
  ref
): React.JSX.Element => {
  const hasLeftIcon = leftIcon !== undefined || placeholder?.toLowerCase().includes('search');
  const iconNode = leftIcon ?? (placeholder?.toLowerCase().includes('search') ? <SearchIcon /> : null);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          placeholder={placeholder}
          className={`
            w-full text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
            bg-white dark:bg-slate-700 border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}
            ${hasLeftIcon ? 'pl-9 pr-3 py-2.5' : 'px-3 py-2.5'}
            ${rightIcon ? 'pr-9' : ''}
            ${className}
          `}
          {...rest}
        />
        {iconNode && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {iconNode}
          </span>
        )}
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-[11.5px] text-red-500">{error}</p>}
      {hint && !error && <p className="text-[11.5px] text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
