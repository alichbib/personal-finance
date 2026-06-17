import type { CardProps } from './Card.types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-[22px] shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
