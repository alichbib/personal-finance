import type { SpinnerProps } from './Spinner.types';

export function Spinner({ label = 'Loading…' }: SpinnerProps) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2.5 py-12 text-sm text-ink-subtle"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-surface-muted border-t-primary" />
      <span>{label}</span>
    </div>
  );
}
