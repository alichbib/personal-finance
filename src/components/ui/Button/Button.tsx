import { Plus } from 'lucide-react';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/[.18]';

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  sm: 'h-[38px] px-4 text-[13.5px]',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white font-semibold shadow-primary-btn hover:bg-primary-hover',
  secondary:
    'bg-surface border border-border-strong text-ink-secondary hover:bg-app',
  ghost: 'bg-transparent text-primary hover:bg-primary-tint',
  danger: 'bg-danger text-white font-semibold hover:bg-danger-hover',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leadingPlus = false,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {leadingPlus && <Plus size={17} strokeWidth={2.2} aria-hidden="true" />}
      {children}
    </button>
  );
}
