import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Use Geist Mono + tabular-nums for currency/amount fields. */
  mono?: boolean;
}
