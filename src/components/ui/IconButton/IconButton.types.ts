import type { ButtonHTMLAttributes } from 'react';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'delete' | 'neutral';
  /** Square size in px. */
  size?: number;
}
