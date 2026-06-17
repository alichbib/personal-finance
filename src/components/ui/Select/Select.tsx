import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { selectClass } from '../form';
import type { SelectProps } from './Select.types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = '', children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`${selectClass} pr-9 ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
    </div>
  );
});
