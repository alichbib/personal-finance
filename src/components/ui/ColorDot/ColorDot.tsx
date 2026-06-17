import type { ColorDotProps } from './ColorDot.types';

export function ColorDot({ color, size = 10, className = '' }: ColorDotProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block flex-shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size, background: color }}
    />
  );
}
