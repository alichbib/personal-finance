import { forwardRef } from 'react';
import { inputClass, moneyInputClass } from '../form';
import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { mono = false, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`${mono ? moneyInputClass : inputClass} ${className}`}
      {...props}
    />
  );
});
