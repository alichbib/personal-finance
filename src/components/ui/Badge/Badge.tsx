import type { BadgeProps, BadgeTone } from './Badge.types';

const toneClasses: Record<BadgeTone, string> = {
  // Month chip / neutral count pill.
  muted: 'bg-surface-muted text-ink-faint',
  // "Over" / "Over budget".
  danger: 'bg-danger-tint text-danger-hover',
  // Trend up (spending increased).
  warning: 'bg-warning-bg text-warning-text',
  // Trend down (spending decreased = good).
  success: 'bg-success-bg text-success-text',
};

export function Badge({
  tone = 'muted',
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
