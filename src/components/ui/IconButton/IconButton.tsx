import type { IconButtonProps } from './IconButton.types';

const variantClasses = {
  delete:
    'text-[#C4C4C8] hover:bg-danger-tint hover:text-danger focus-visible:ring-danger/30',
  neutral:
    'text-ink-muted hover:bg-app focus-visible:ring-primary/[.18] border border-border-strong',
} as const;

export function IconButton({
  variant = 'delete',
  size = 32,
  className = '',
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      style={{ width: size, height: size }}
      className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-transparent transition-colors focus:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
