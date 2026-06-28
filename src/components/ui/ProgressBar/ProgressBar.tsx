import type { ProgressBarProps } from './ProgressBar.types';

const DANGER = '#DC2626';

export function ProgressBar({
  value,
  color,
  over = false,
  minWidth = 0,
  height = 9,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100));
  const width = clamped > 0 ? Math.max(clamped, minWidth) : 0;

  return (
    <div
      className="overflow-hidden rounded-full bg-surface-muted"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-[400ms] ease-[ease]"
        style={{ width: `${width}%`, background: over ? DANGER : color }}
      />
    </div>
  );
}
